/**
 * NOVA - NOTE-TAKING INTRO (4-SCREEN SWIPE)
 * Shows once on first use
 */

const NoteIntro = {
    currentScreen: 0,
    screens: [
        {
            id: 'why',
            icon: '🧠💡',
            title: 'Why Take Notes?',
            content: [
                "Your brain can't remember everything you hear.",
                "Notes = your backup memory."
            ],
            audio: "Your brain can't remember everything you hear. Notes are your backup memory."
        },
        {
            id: 'what',
            icon: '✍️',
            title: 'What Are Notes?',
            content: [
                "Writing down what matters so you can find it later.",
                "Not everything. Just the important stuff."
            ],
            audio: "Notes are writing down what matters so you can find it later. Not everything. Just the important stuff."
        },
        {
            id: 'how',
            icon: '🎯',
            title: 'How to Take Notes',
            steps: [
                "1. Listen or read",
                "2. Pick out what's important",
                "3. Write it SHORT",
                "4. Organize it so it makes sense"
            ],
            footer: "That's it!",
            audio: "Listen or read. Pick out what's important. Write it short. Organize it so it makes sense. That's it!"
        },
        {
            id: 'preview',
            icon: '📚',
            title: "You'll Learn 5 Note Skills:",
            skills: [
                { icon: '🎯', text: 'Find main ideas' },
                { icon: '⭐', text: 'Pick keywords' },
                { icon: '✂️', text: 'Write short notes' },
                { icon: '•', text: 'Make bullet lists' },
                { icon: '→', text: 'Use quick symbols' }
            ],
            footer: 'Master these = take great notes!',
            audio: "You'll learn five note skills. Find main ideas. Pick keywords. Write short notes. Make bullet lists. Use quick symbols. Master these and you'll take great notes!"
        }
    ],

    /**
     * Show intro sequence
     */
    show() {
        this.currentScreen = 0;
        this.render();
    },

    /**
     * Render current screen
     */
    render() {
        const container = document.getElementById('main-content');
        const screen = this.screens[this.currentScreen];
        const isLast = this.currentScreen === this.screens.length - 1;

        let contentHTML = '';

        if (screen.content) {
            contentHTML = screen.content.map(line => 
                `<p style="font-size: 18px; line-height: 1.6; margin-bottom: 12px;">${line}</p>`
            ).join('');
        }

        if (screen.steps) {
            contentHTML = `
                <div style="text-align: left; max-width: 350px; margin: 0 auto;">
                    ${screen.steps.map(step => 
                        `<div style="font-size: 18px; padding: 8px 0;">${step}</div>`
                    ).join('')}
                </div>
            `;
        }

        if (screen.skills) {
            contentHTML = `
                <div style="text-align: left; max-width: 300px; margin: 0 auto;">
                    ${screen.skills.map(skill => 
                        `<div style="font-size: 18px; padding: 8px 0;">
                            ${skill.icon} ${skill.text}
                        </div>`
                    ).join('')}
                </div>
            `;
        }

        container.innerHTML = `
            <div class="intro-screen" style="position: relative; text-align: center; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
                ${NovaAudioEnhanced.createReplayButton(screen.audio, 'top-right')}
                
                <div style="font-size: 64px; margin-bottom: 24px;">
                    ${screen.icon}
                </div>
                
                <h1 style="font-size: 28px; margin-bottom: 24px; font-weight: bold;">
                    ${screen.title}
                </h1>
                
                <div style="margin-bottom: 32px;">
                    ${contentHTML}
                </div>
                
                ${screen.footer ? `
                    <p style="font-size: 20px; font-weight: 600; margin-bottom: 32px;">
                        ${screen.footer}
                    </p>
                ` : ''}
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 40px;">
                    ${this.currentScreen > 0 ? `
                        <button class="btn btn-secondary" onclick="NoteIntro.previous()">
                            ← Back
                        </button>
                    ` : `
                        <button class="btn btn-secondary" onclick="NoteIntro.skip()">
                            Skip Intro
                        </button>
                    `}
                    
                    <button class="btn btn-primary" onclick="NoteIntro.next()">
                        ${isLast ? "Let's Go! →" : "Next →"}
                    </button>
                </div>
                
                <div style="margin-top: 24px; color: var(--text-secondary); font-size: 14px;">
                    ${this.currentScreen + 1} / ${this.screens.length}
                </div>
            </div>
        `;

        // Auto-play audio
        NovaAudioEnhanced.speak(screen.audio);
    },

    /**
     * Go to next screen
     */
    next() {
        if (this.currentScreen < this.screens.length - 1) {
            this.currentScreen++;
            this.render();
        } else {
            this.complete();
        }
    },

    /**
     * Go to previous screen
     */
    previous() {
        if (this.currentScreen > 0) {
            this.currentScreen--;
            this.render();
        }
    },

    /**
     * Skip intro
     */
    skip() {
        if (confirm('Skip the intro? You can always replay it later from the ℹ️ icon.')) {
            this.complete();
        }
    },

    /**
     * Complete intro
     */
    complete() {
        // Mark as seen
        NovaStorage.set('note-intro-seen', true);
        
        // Stop any playing audio
        NovaAudioEnhanced.stop();
        
        // Start first lesson
        RefinedLessonRenderer.load('main-idea', false);
    },

    /**
     * Show condensed modal (from ℹ️ icon)
     */
    showModal() {
        NovaModal.show(
            '🧠 Why Take Notes?',
            `
                <div style="text-align: center; padding: 20px;">
                    <p style="font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
                        Your brain can't remember everything you hear.<br>
                        Notes = your backup memory.
                    </p>
                    
                    <div style="border-top: 2px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
                        <h3 style="margin-bottom: 16px;">You'll Learn 5 Skills:</h3>
                        <div style="text-align: left; max-width: 300px; margin: 0 auto;">
                            <div style="margin: 8px 0;">🎯 Find main ideas</div>
                            <div style="margin: 8px 0;">⭐ Pick keywords</div>
                            <div style="margin: 8px 0;">✂️ Write short notes</div>
                            <div style="margin: 8px 0;">•  Make bullet lists</div>
                            <div style="margin: 8px 0;">→ Use quick symbols</div>
                        </div>
                    </div>
                </div>
            `,
            [
                {
                    text: '🔊 Play Audio',
                    class: 'btn-secondary',
                    onclick: "NovaAudioEnhanced.speak('Your brain can\\'t remember everything you hear. Notes are your backup memory.', { force: true });"
                },
                {
                    text: 'View Full Guide →',
                    class: 'btn-primary',
                    onclick: 'NovaModal.close(); NoteIntro.show();'
                },
                {
                    text: 'Close',
                    class: 'btn-secondary',
                    onclick: 'NovaModal.close();'
                }
            ]
        );
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NoteIntro;
}
