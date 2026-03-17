/**
 * NOVA - AUDIO COMPONENT
 * Text-to-speech and audio playback
 */

const NovaAudio = {
    synthesis: window.speechSynthesis,
    currentUtterance: null,

    /**
     * Speak text using Web Speech API
     */
    speak(text, options = {}) {
        if (!this.synthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.stop();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure utterance
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1;
        utterance.volume = NovaState.state.settings.volume || 0.7;
        utterance.lang = options.lang || 'en-US';

        // Event handlers
        utterance.onend = () => {
            this.currentUtterance = null;
            if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
            this.currentUtterance = null;
        };

        // Speak
        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    },

    /**
     * Stop speaking
     */
    stop() {
        if (this.synthesis && this.currentUtterance) {
            this.synthesis.cancel();
            this.currentUtterance = null;
        }
    },

    /**
     * Read current screen content
     */
    readCurrentScreen() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        // Get text content, excluding certain elements
        const clone = mainContent.cloneNode(true);
        
        // Remove buttons, code blocks, etc.
        clone.querySelectorAll('button, code, .btn, .toast').forEach(el => el.remove());
        
        const text = clone.textContent.trim();
        
        if (text) {
            this.speak(text);
        }
    },

    /**
     * Read specific element
     */
    readElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const text = element.textContent.trim();
            this.speak(text);
        }
    },

    /**
     * Toggle audio on/off
     */
    toggle() {
        const settings = NovaState.state.settings;
        settings.audioEnabled = !settings.audioEnabled;
        NovaState.save();
        
        if (!settings.audioEnabled) {
            this.stop();
        }
        
        return settings.audioEnabled;
    },

    /**
     * Set volume (0-1)
     */
    setVolume(volume) {
        NovaState.state.settings.volume = Math.max(0, Math.min(1, volume));
        NovaState.save();
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaAudio;
}
