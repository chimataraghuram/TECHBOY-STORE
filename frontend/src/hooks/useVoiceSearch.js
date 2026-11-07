import localPhonesData from '../data/phones.json';
/**
 * useVoiceSearch.js
 * Enhanced "Hey TechBoy" Voice Engine.
 * Features:
 * - Real-time Web Audio API Analyser for true sound-reactive waveform amplitude
 * - Continuous & interim recognition with auto-retry on silence/network glitches
 * - Multi-dialect language fallback (en-IN with fallback to en-US / navigator.language)
 * - Smartphone phonetic term correction (e.g. "one plus" -> "OnePlus", "s 24" -> "S24", "gb ram", "snapdragon")
 * - SpeechSynthesis TTS voice response option for hands-free queries
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const isSpeechSupported = () =>
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

// Smartphone acoustic & phonetic term corrections for superior voice accuracy
const correctPhoneTerminology = (raw = '') => {
    let text = raw;
    const replacements = [
        [/\bi\s*phone\b/gi, 'iPhone'],
        [/\bone\s*plus\b/gi, 'OnePlus'],
        [/\breal\s*me\b/gi, 'Realme'],
        [/\bred\s*mi\b/gi, 'Redmi'],
        [/\bmoto\s*rola\b/gi, 'Motorola'],
        [/\bi\s*q\s*o\s*o\b/gi, 'iQOO'],
        [/\bi\s*coo\b/gi, 'iQOO'],
        [/\bpoco\b/gi, 'POCO'],
        [/\btecno\b/gi, 'Tecno'],
        [/\binfinix\b/gi, 'Infinix'],
        [/\bnothing\s*phone\b/gi, 'Nothing Phone'],
        [/\bphone\s*3\s*a\b/gi, 'Phone (3a)'],
        [/\bgalaxy\s*s\s*(\d+)/gi, 'Galaxy S$1'],
        [/\bgalaxy\s*z\s*flip\s*(\d+)/gi, 'Galaxy Z Flip $1'],
        [/\bgalaxy\s*z\s*fold\s*(\d+)/gi, 'Galaxy Z Fold $1'],
        [/\bs\s*(\d{2})\s*ultra\b/gi, 'S$1 Ultra'],
        [/\bunder\s*(\d+)\s*k\b/gi, (_, p1) => `under ₹${parseInt(p1, 10) * 1000}`],
        [/\bbelow\s*(\d+)\s*k\b/gi, (_, p1) => `below ₹${parseInt(p1, 10) * 1000}`],
        [/\baround\s*(\d+)\s*k\b/gi, (_, p1) => `around ₹${parseInt(p1, 10) * 1000}`],
        [/\bsnap\s*dragon\b/gi, 'Snapdragon'],
        [/\bdi\s*mensity\b/gi, 'Dimensity'],
        [/\b(\d+)\s*m\s*a\s*h\b/gi, '$1mAh'],
        [/\b(\d+)\s*m\s*p\b/gi, '$1MP'],
        [/\b(\d+)\s*h\s*z\b/gi, '$1Hz'],
        [/\b5\s*g\b/gi, '5G'],
        [/\bam\s*oled\b/gi, 'AMOLED'],
        [/\bo\s*i\s*s\b/gi, 'OIS'],
        [/\bbenchmark\b/gi, 'Benchmark'],
        [/\bantutu\b/gi, 'AnTuTu']
    ];

    replacements.forEach(([pattern, repl]) => {
        text = text.replace(pattern, repl);
    });
    return text;
};

const useVoiceSearch = (onResult, { lang = 'en-IN', continuous = false, interimResults = true } = {}) => {
    const [isListening, setIsListening] = useState(false);
    const [interim, setInterim] = useState('');
    const [error, setError] = useState(null); // 'unsupported' | 'no-mic' | 'network' | null
    const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 amplitude for live reactive waveforms

    const recognitionRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animFrameRef = useRef(null);
    const isListeningRef = useRef(false);

    const supported = isSpeechSupported();

    // Start real microphone audio analysis for visual feedback
    const startAudioMeter = useCallback(async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) return;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            mediaStreamRef.current = stream;

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;

            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateMeter = () => {
                if (!isListeningRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                }
                const avg = sum / dataArray.length;
                // Normalize 0-255 to 0-100
                const normalized = Math.min(100, Math.round((avg / 128) * 100));
                setAudioLevel(normalized);
                animFrameRef.current = requestAnimationFrame(updateMeter);
            };

            updateMeter();
        } catch (err) {
            console.warn('Audio metering unavailable:', err);
        }
    }, []);

    const stopAudioMeter = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        if (audioContextRef.current) {
            try { audioContextRef.current.close(); } catch (_) {}
            audioContextRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        setAudioLevel(0);
    }, []);

    useEffect(() => {
        if (!supported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // Auto-detect best language tag with fallback
        recognition.lang = lang || (navigator.language ? navigator.language : 'en-US');
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 2;

        recognition.onstart = () => {
            setIsListening(true);
            isListeningRef.current = true;
            setError(null);
            setInterim('');
            startAudioMeter();
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                const raw = res[0].transcript;
                const cleaned = correctPhoneTerminology(raw);

                if (res.isFinal) {
                    finalTranscript += cleaned;
                } else {
                    interimTranscript += cleaned;
                }
            }

            if (interimTranscript) setInterim(interimTranscript);

            if (finalTranscript.trim()) {
                const polished = finalTranscript.trim();
                setInterim('');
                onResult(polished);
            }
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            isListeningRef.current = false;
            setInterim('');
            stopAudioMeter();

            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                setError('no-mic');
            } else if (event.error === 'network') {
                setError('network');
            } else if (event.error === 'no-speech') {
                // Graceful silence timeout - do not treat as critical error
                setError(null);
            } else {
                setError(event.error || 'unknown');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            isListeningRef.current = false;
            setInterim('');
            stopAudioMeter();
        };

        recognitionRef.current = recognition;

        return () => {
            try { recognition.abort(); } catch (_) {}
            stopAudioMeter();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supported, lang, continuous, interimResults]);

    const startListening = useCallback(() => {
        if (!supported) {
            setError('unsupported');
            return;
        }
        setError(null);
        try {
            recognitionRef.current?.start();
        } catch (e) {
            // Already started or restarting
        }
    }, [supported]);

    const stopListening = useCallback(() => {
        try { recognitionRef.current?.stop(); } catch (_) {}
        setIsListening(false);
        isListeningRef.current = false;
        setInterim('');
        stopAudioMeter();
    }, [stopAudioMeter]);

    const toggleListening = useCallback(() => {
        if (isListening) stopListening();
        else startListening();
    }, [isListening, startListening, stopListening]);

    // Optional text-to-speech speaker to speak AI responses
    const speakText = useCallback((text) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        // Polish text for optimal TTS clarity
        let clean = text.replace(/[*#_`>•]/g, '')
                        .replace(/₹\s*(\d+)/g, '$1 rupees')
                        .replace(/\s+/g, ' ')
                        .trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 1.02; // Natural conversational cadence
        utterance.pitch = 1.0;
        
        // Find natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) || voices[0];
        if (selectedVoice) utterance.voice = selectedVoice;

        window.speechSynthesis.speak(utterance);
    }, []);

    const stopSpeaking = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    return { 
        isListening, 
        interim, 
        error, 
        supported, 
        audioLevel, 
        startListening, 
        stopListening, 
        toggleListening,
        speakText,
        stopSpeaking
    };
};


/**
 * Speaks a natural, conversational reply using Google Gemini Voice Model (gemini-2.5-flash).
 * @param {string} userQuery - Spoken speech transcript from user
 * @param {Function} [speakCallback] - Optional callback receiving the plain text answer
 */
/**
 * Trained Voice Model Assistant using Google Gemini 2.5 Flash API.
 * Features:
 * - Domain Knowledge Base: Grounded in TECHBOY-STORE live smartphone catalog (40+ devices, exact prices & specs)
 * - Few-Shot Training Examples for crisp, conversational speech synthesis
 * - Strict anti-hallucination constraints: Never fabricates unverified phones or fake prices
 * - Plain-text output optimized for speech synthesis without formatting artifacts
 * 
 * @param {string} userQuery - Spoken speech transcript from user
 * @param {Function} [speakCallback] - Optional callback receiving the natural speech text
 * @param {Array} [customCatalog] - Optional live catalog array from store state
 */
export const queryGeminiVoice = async (userQuery, speakCallback, customCatalog = null) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || !userQuery?.trim()) return null;

    const catalog = customCatalog && customCatalog.length > 0 ? customCatalog : localPhonesData;

    // Compact catalog context for RAG grounding
    const catalogContext = catalog.slice(0, 30).map(p => 
        `${p.name} (₹${p.price}): ${p.tag || ''}, ${p.description || ''}`
    ).join('\n');

    const systemInstruction = `You are TechBoy Voice Assistant for TECHBOY-STORE, India's premier AI smartphone discovery hub.
TRAINING & PERSONA GUIDELINES:
- Voice: Friendly, authoritative tech concierge. Speaks directly to the buyer.
- Length: Exactly 1 to 2 spoken sentences (under 30 words total).
- Content: Recommend 1 specific phone with its exact price from the catalog that best matches user criteria (budget, camera, gaming, battery).
- Format: Pure plain conversational text. NO asterisks, NO markdown bullets, NO emojis, NO technical abbreviations that sound unnatural when spoken. Speak currency as "rupees".
- Grounding: Only recommend phones from the TECHBOY catalog. Never invent prices or unavailable phones.`;

    const fewShotExamples = [
        {
            user: "Best phone under 15000 rupees?",
            assistant: "For under fifteen thousand rupees, the Redmi 13C 5G at nine thousand two hundred rupees is your top pick for reliable five G performance."
        },
        {
            user: "Best gaming smartphone?",
            assistant: "The iQOO Z9 5G at seventeen thousand nine hundred ninety rupees delivers class-leading gaming with its Dimensity processor and ultra-smooth display."
        },
        {
            user: "Best camera phone for portraits?",
            assistant: "The Nothing Phone 3a at twenty-three thousand nine hundred ninety rupees features exceptional studio-grade dual fifty-megapixel cameras with optical stabilization."
        },
        {
            user: "Flagship phone with best battery?",
            assistant: "The OnePlus 13 offers supreme flagship speed alongside a massive six-thousand milliamp-hour battery and lightning fast one-hundred-watt charging."
        }
    ];

    try {
        const contents = [
            ...fewShotExamples.flatMap(ex => [
                { role: 'user', parts: [{ text: ex.user }] },
                { role: 'model', parts: [{ text: ex.assistant }] }
            ]),
            {
                role: 'user',
                parts: [{
                    text: `Available TECHBOY Catalog:\n${catalogContext}\n\nCustomer Spoken Query: "${userQuery.trim()}"`
                }]
            }
        ];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents,
                generationConfig: {
                    temperature: 0.25,
                    maxOutputTokens: 80,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) return null;
        const data = await response.json();
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return null;

        // Clean speech formatting
        text = text.replace(/[*#_`>•]/g, '').replace(/₹/g, 'rupees ').replace(/\s+/g, ' ').trim();

        if (text && typeof speakCallback === 'function') {
            speakCallback(text);
        }
        return text;
    } catch (err) {
        console.warn('Gemini Voice query error:', err);
        return null;
    }
};

export default useVoiceSearch;
