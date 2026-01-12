/**
 * Sound Module
 * Handles audio playback for game events using Web Audio API.
 * Falls back gracefully if audio context is unavailable.
 */

const Sound = (function() {
    'use strict';

    // Audio context and state
    let audioContext = null;
    let soundEnabled = true;
    let soundsLoaded = false;
    let audioBuffers = {};

    // Sound file paths
    const SOUND_PATHS = {
        placeX: 'audio/place-x.mp3',
        placeO: 'audio/place-o.mp3',
        victory: 'audio/victory.mp3',
        defeat: 'audio/defeat.mp3',
        draw: 'audio/draw.mp3',
        click: 'audio/click.mp3'
    };

    // Oscillator frequencies for synthesized sounds (fallback)
    const SYNTH_SOUNDS = {
        placeX: { freq: 880, duration: 0.1, type: 'sine' },
        placeO: { freq: 440, duration: 0.1, type: 'sine' },
        victory: { freq: [523, 659, 784], duration: 0.15, type: 'sine' },
        defeat: { freq: [392, 311, 261], duration: 0.2, type: 'sawtooth' },
        draw: { freq: [440, 440], duration: 0.15, type: 'triangle' },
        click: { freq: 1200, duration: 0.05, type: 'square' }
    };

    /**
     * Creates or resumes the AudioContext
     * Must be called after user interaction due to browser autoplay policies
     */
    function initAudioContext() {
        if (audioContext) {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            return true;
        }

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                console.warn('Web Audio API is not supported');
                return false;
            }
            audioContext = new AudioContextClass();
            return true;
        } catch (e) {
            console.warn('Failed to create AudioContext:', e);
            return false;
        }
    }

    /**
     * Loads an audio file and decodes it into an AudioBuffer
     * @param {string} name - Sound name identifier
     * @param {string} url - URL to the audio file
     * @returns {Promise<boolean>} True if loaded successfully
     */
    async function loadSound(name, url) {
        if (!audioContext) {
            return false;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBuffers[name] = audioBuffer;
            return true;
        } catch (e) {
            console.warn(`Failed to load sound "${name}":`, e.message);
            return false;
        }
    }

    /**
     * Loads all sound files
     * @returns {Promise<boolean>} True if at least some sounds loaded
     */
    async function loadAllSounds() {
        if (!initAudioContext()) {
            return false;
        }

        const loadPromises = Object.entries(SOUND_PATHS).map(([name, path]) =>
            loadSound(name, path)
        );

        const results = await Promise.all(loadPromises);
        soundsLoaded = results.some(result => result);

        if (!soundsLoaded) {
            console.info('Audio files not available, using synthesized sounds');
        }

        return soundsLoaded;
    }

    /**
     * Plays a sound buffer
     * @param {AudioBuffer} buffer - The audio buffer to play
     * @param {number} volume - Volume level (0-1)
     */
    function playBuffer(buffer, volume = 0.5) {
        if (!audioContext || !buffer) return;

        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = buffer;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start(0);
    }

    /**
     * Plays a synthesized sound using oscillator
     * @param {Object} config - Sound configuration
     * @param {number} volume - Volume level (0-1)
     */
    function playSynth(config, volume = 0.3) {
        if (!audioContext) return;

        const frequencies = Array.isArray(config.freq) ? config.freq : [config.freq];
        const duration = config.duration;
        const type = config.type;

        frequencies.forEach((freq, index) => {
            const startTime = audioContext.currentTime + (index * duration * 0.8);

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = type;
            oscillator.frequency.value = freq;

            // Envelope for smoother sound
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration + 0.1);
        });
    }

    /**
     * Plays a sound by name
     * @param {string} name - Sound name (placeX, placeO, victory, defeat, draw, click)
     */
    function play(name) {
        if (!soundEnabled) return;

        // Ensure audio context is ready
        if (!initAudioContext()) return;

        // Resume context if suspended (due to autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // Try to play loaded sound file first
        if (audioBuffers[name]) {
            playBuffer(audioBuffers[name], 0.5);
        } else if (SYNTH_SOUNDS[name]) {
            // Fall back to synthesized sound
            playSynth(SYNTH_SOUNDS[name]);
        }
    }

    /**
     * Sets whether sound is enabled
     * @param {boolean} enabled - True to enable sound
     */
    function setEnabled(enabled) {
        soundEnabled = Boolean(enabled);
    }

    /**
     * Gets whether sound is enabled
     * @returns {boolean} True if sound is enabled
     */
    function isEnabled() {
        return soundEnabled;
    }

    /**
     * Toggles sound on/off
     * @returns {boolean} New sound enabled state
     */
    function toggle() {
        soundEnabled = !soundEnabled;
        return soundEnabled;
    }

    /**
     * Initializes the sound system
     * Should be called after first user interaction
     * @param {boolean} enabled - Initial enabled state
     */
    async function init(enabled = true) {
        soundEnabled = enabled;

        // Try to load sounds (will use synth fallback if files not available)
        await loadAllSounds();
    }

    // Public API
    return {
        init,
        play,
        setEnabled,
        isEnabled,
        toggle
    };
})();

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sound;
}
