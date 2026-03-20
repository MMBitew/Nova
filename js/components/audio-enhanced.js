/**
 * NOVA - ENHANCED AUDIO SYSTEM
 * Web Speech API with auto-play support
 */

const NovaAudioEnhanced = {
    // Audio settings
    settings: {
        autoPlay: true,
        rate: 0.88,
        pitch: 1.0,
        volume: 1.0
    },

    // Current utterance
    currentUtterance: null,
    isPlaying: false,

    /**
     * Initialize audio system
     */
    init() {
        // Load settings from storage
        const saved = NovaStorage.get('audio-settings');
        if (saved) {
            this.settings = { ...this.settings, ...saved };
        }

        // Check if Web Speech API is available
        if (!('speechSynthesis' in window)) {
            console.warn('Web Speech API not supported');
            this.settings.autoPlay = false;
        }
    },

    /**
     * Speak text with Web Speech API
     */
    speak(text, options = {}) {
        // Stop any current speech
        this.stop();

        // Check if auto-play is enabled (unless forced)
        if (!options.force && !this.settings.autoPlay) {
            return;
        }

        // Clean and format text
        const cleanText = this.formatForSpeech(text);

        // Create utterance
        this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
        this.currentUtterance.rate = options.rate || this.settings.rate;
        this.currentUtterance.pitch = options.pitch || this.settings.pitch;
        this.currentUtterance.volume = options.volume || this.settings.volume;

        // Event listeners
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            this.updatePlayButton(true);
        };

        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            this.updatePlayButton(false);
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech error:', event);
            this.isPlaying = false;
            this.updatePlayButton(false);
        };

        // Speak
        window.speechSynthesis.speak(this.currentUtterance);
    },

    /**
     * Stop current speech
     */
    stop() {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        this.isPlaying = false;
        this.updatePlayButton(false);
    },

    /**
     * Toggle play/pause
     */
    toggle(text) {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.speak(text, { force: true });
        }
    },

    /**
     * Format text for natural speech
     */
    formatForSpeech(text) {
        let formatted = text;

        // Numbers and prices
        formatted = formatted.replace(/\$(\d+)/g, (match, num) => {
            return `${num} dollars`;
        });
        formatted = formatted.replace(/\$(\d+)\.(\d+)/g, (match, dollars, cents) => {
            return `${dollars} dollars and ${cents} cents`;
        });
        formatted = formatted.replace(/(\d+)%/g, (match, num) => {
            return `${num} percent`;
        });

        // Abbreviations
        formatted = formatted.replace(/\bDr\b/g, 'Doctor');
        formatted = formatted.replace(/\bMr\b/g, 'Mister');
        formatted = formatted.replace(/\bMrs\b/g, 'Misses');
        formatted = formatted.replace(/\bvs\b/g, 'versus');
        formatted = formatted.replace(/\betc\b/g, 'et cetera');
        formatted = formatted.replace(/\bHW\b/g, 'homework');
        formatted = formatted.replace(/\bCh\b/g, 'Chapter');

        // Common symbols in context
        formatted = formatted.replace(/→/g, ' leads to ');
        formatted = formatted.replace(/=/g, ' equals ');
        formatted = formatted.replace(/\+/g, ' plus ');
        formatted = formatted.replace(/★/g, ' important ');

        // Clean up
        formatted = formatted.replace(/\s+/g, ' ').trim();

        return formatted;
    },

    /**
     * Update play button appearance
     */
    updatePlayButton(isPlaying) {
        const buttons = document.querySelectorAll('.audio-replay-btn');
        buttons.forEach(btn => {
            if (isPlaying) {
                btn.innerHTML = '⏸️';
                btn.setAttribute('aria-label', 'Pause audio');
            } else {
                btn.innerHTML = '🔊';
                btn.setAttribute('aria-label', 'Play audio');
            }
        });
    },

    /**
     * Create audio replay button
     */
    createReplayButton(text, position = 'top-right') {
        const positionStyles = {
            'top-right': 'position: absolute; top: 16px; right: 16px;',
            'bottom-center': 'position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);',
            'inline': 'display: inline-block; margin-left: 8px;'
        };

        return `
            <button 
                class="audio-replay-btn"
                onclick="NovaAudioEnhanced.toggle(\`${text.replace(/`/g, '\\`')}\`)"
                style="${positionStyles[position]} background: rgba(99, 102, 241, 0.1); border: 2px solid var(--primary-color); border-radius: 50%; width: 44px; height: 44px; cursor: pointer; font-size: 20px; transition: all 0.2s ease; z-index: 10;"
                onmouseover="this.style.background='rgba(99, 102, 241, 0.2)'; this.style.transform='scale(1.1)';"
                onmouseout="this.style.background='rgba(99, 102, 241, 0.1)'; this.style.transform='scale(1)';"
                aria-label="Play audio">
                🔊
            </button>
        `;
    },

    /**
     * Set auto-play preference
     */
    setAutoPlay(enabled) {
        this.settings.autoPlay = enabled;
        this.saveSettings();
    },

    /**
     * Save settings to storage
     */
    saveSettings() {
        NovaStorage.set('audio-settings', this.settings);
    },

    /**
     * Get current settings
     */
    getSettings() {
        return { ...this.settings };
    }
};

// Initialize on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        NovaAudioEnhanced.init();
    });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaAudioEnhanced;
}
