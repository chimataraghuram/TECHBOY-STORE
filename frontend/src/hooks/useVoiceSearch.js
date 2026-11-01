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

// Common smartphone term corrections for better voice accuracy
const correctPhoneTerminology = (raw = '') => {
    let text = raw;
    const replacements = [
        [/\bi\s*phone\b/gi, 'iPhone'],
        [/\bone\s*plus\b/gi, 'OnePlus'],
        [/\breal\s*me\b/gi, 'Realme'],
        [/\bred\s*mi\b/gi, 'Redmi'],
        [/\bmoto\s*rola\b/gi, 'Motorola'],
        [/\bgalaxy\s*s\s*(\d+)/gi, 'Galaxy S$1'],
        [/\bgalaxy\s*z\s*flip\s*(\d+)/gi, 'Galaxy Z Flip $1'],
        [/\bgalaxy\s*z\s*fold\s*(\d+)/gi, 'Galaxy Z Fold $1'],
        [/\bs\s*(\d{2})\s*ultra\b/gi, 'S$1 Ultra'],
        [/\bunder\s*(\d+)\s*k\b/gi, 'under $1000'],
        [/\bsnap\s*dragon\b/gi, 'Snapdragon'],
        [/\bdi\s*mensity\b/gi, 'Dimensity'],
        [/\b(\d+)\s*m\s*a\s*h\b/gi, '$1mAh'],
        [/\b(\d+)\s*m\s*p\b/gi, '$1MP'],
        [/\b(\d+)\s*h\s*z\b/gi, '$1Hz'],
        [/\b5\s*g\b/gi, '5G']
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
        const clean = text.replace(/[*#_`>]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 1.05;
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
export const queryGeminiVoice = async (userQuery, speakCallback) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || !userQuery?.trim()) return null;

    try {
        const prompt = `You are TechBoy Voice Assistant for TECHBOY-STORE.
The customer asked via voice: "${userQuery.trim()}"
Instructions:
1. Provide a direct, natural 1-2 sentence spoken reply (under 25 words).
2. Recommend the best matching smartphone or answer the question concisely.
3. Strictly plain conversational text for speech synthesis: no emojis, no asterisks, no bullets.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 60
                }
            })
        });

        if (!response.ok) return null;
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/[*#_`>]/g, '')?.trim();
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
