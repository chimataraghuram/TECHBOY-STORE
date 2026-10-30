/**
 * useVoiceSearch.js
 * Custom React hook powering the "Hey TechBoy" voice search feature.
 * Uses the native Web Speech API — zero external costs, zero dependencies.
 * Works in Chrome, Edge, Safari, and Android browsers.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const isSpeechSupported = () =>
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

/**
 * @param {function} onResult  — called with the final transcript string
 * @param {object}   options
 *   lang         {string}  — BCP-47 language tag (default 'en-IN')
 *   continuous   {boolean} — keep listening (default false)
 *   interimResults {boolean} — stream partial results (default true)
 */
const useVoiceSearch = (onResult, { lang = 'en-IN', continuous = false, interimResults = true } = {}) => {
    const [isListening, setIsListening] = useState(false);
    const [interim, setInterim] = useState('');       // live partial transcript
    const [error, setError] = useState(null);         // 'unsupported' | 'no-mic' | 'network' | null
    const recognitionRef = useRef(null);

    const supported = isSpeechSupported();

    useEffect(() => {
        if (!supported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
            setInterim('');
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (interimTranscript) setInterim(interimTranscript);

            if (finalTranscript.trim()) {
                setInterim('');
                onResult(finalTranscript.trim());
            }
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            setInterim('');
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                setError('no-mic');
            } else if (event.error === 'network') {
                setError('network');
            } else {
                setError(event.error || 'unknown');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterim('');
        };

        recognitionRef.current = recognition;

        return () => {
            try { recognition.abort(); } catch (_) {}
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supported, lang, continuous, interimResults]);

    const startListening = useCallback(() => {
        if (!supported) { setError('unsupported'); return; }
        setError(null);
        try {
            recognitionRef.current?.start();
        } catch (e) {
            // already started — ignore
        }
    }, [supported]);

    const stopListening = useCallback(() => {
        try { recognitionRef.current?.stop(); } catch (_) {}
        setIsListening(false);
        setInterim('');
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) stopListening();
        else startListening();
    }, [isListening, startListening, stopListening]);

    return { isListening, interim, error, supported, startListening, stopListening, toggleListening };
};

export default useVoiceSearch;
