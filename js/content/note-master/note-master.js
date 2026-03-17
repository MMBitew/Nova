/**
 * NOVA - NOTE MASTER MODULE
 * Entry point for Note Master skill
 */

const NoteMaster = {
    /**
     * Initialize Note Master with linear navigation
     */
    async init() {
        console.log('🚀 Starting Note Master');
        
        // Track analytics
        NovaAnalytics.trackSkillOpened('note-master');
        
        // Show voice button
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) voiceBtn.classList.remove('hidden');
        
        try {
            // Use linear navigation
            await LinearNavigation.init('note-master');
        } catch (error) {
            console.error('Failed to initialize Note Master:', error);
            this.showError(error);
        }
    },

    /**
     * Show error screen
     */
    showError(error) {
        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">😕</div>
                <h2>Oops! Something went wrong</h2>
                <p style="color: var(--text-secondary); margin: 20px 0;">
                    We couldn't load Note Master
                </p>
                <details style="margin: 20px 0; text-align: left;">
                    <summary style="cursor: pointer;">Error details</summary>
                    <pre style="background: var(--bg-color); padding: 10px; border-radius: 8px; margin-top: 10px; overflow-x: auto;">
${error.message}
${error.stack}
                    </pre>
                </details>
                <button class="btn btn-primary" onclick="location.reload()">
                    Try Again
                </button>
                <button class="btn btn-secondary" onclick="NovaRouter.navigate('home')">
                    Back to Home
                </button>
            </div>
        `;
    },

    /**
     * Show progress view
     */
    showProgress() {
        const container = document.getElementById('main-content');
        NovaProgress.renderProgress('note-master', container);
        
        // Add continue button
        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn btn-primary';
        continueBtn.textContent = 'Continue Learning →';
        continueBtn.style.marginTop = '20px';
        continueBtn.onclick = () => this.init();
        
        container.appendChild(continueBtn);
    },

    /**
     * Reset progress (for testing/debugging)
     */
    resetProgress() {
        NovaModal.confirm(
            'Reset Progress?',
            'This will delete all your Note Master progress. This cannot be undone.',
            () => {
                NovaState.resetSkill('note-master');
                NovaToast.success('Progress reset! Starting fresh.');
                setTimeout(() => {
                    this.init();
                }, 1000);
            }
        );
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NoteMaster;
}
