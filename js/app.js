/**
 * NOVA - MAIN APP
 * Application initialization and coordination
 */

const NovaApp = {
    /**
     * Initialize Nova app
     */
    init() {
        console.log('✨ Nova - Learn at your own pace');
        
        // Initialize core systems
        NovaState.init();
        NovaRouter.init();
        
        // Apply saved theme
        const theme = NovaState.state.settings.theme || 'power';
        document.body.className = `theme-${theme}`;
        
        // Show home screen if no route
        if (!window.location.hash || window.location.hash === '#home') {
            this.showHome();
        }
    },
/**
 * Show home screen with skills
 */
showHome() {
    const container = document.getElementById('main-content');
    
    // Get stats
    const userXP = NovaState.state.user.xp;
    const userLevel = NovaState.state.user.level;
    const userStreak = NovaState.state.user.streak;
    
    // Get Note Master progress
    const noteProgress = NovaProgress.getCompletionPercentage('note-master', 60);
    
    container.innerHTML = `
        <div class="home-screen">
            <div class="welcome-section" style="text-align: center; margin-bottom: 40px;">
                <h1 class="gradient-text" style="font-size: 48px; margin-bottom: 8px;">
                    ✨ Nova
                </h1>
                <p style="font-size: 20px; color: var(--text-secondary);">
                    Learn at your own pace
                </p>
                <div style="margin-top: 20px;">
                    <div class="stats" style="display: inline-flex; gap: 20px; justify-content: center;">
                        <div class="stat-item">
                            Level ${userLevel}
                        </div>
                        <div class="stat-item">
                            ${userXP} XP
                        </div>
                        ${userStreak > 0 ? `
                        <div class="stat-item">
                            🔥 ${userStreak} day${userStreak > 1 ? 's' : ''}
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="skills-grid">
                <!-- ORIGINAL Note Master -->
                <div class="skill-card" onclick="NovaRouter.navigate('note-master')">
                    <div class="skill-icon">✍️</div>
                    <div class="skill-name">Note Master</div>
                    <div class="skill-desc">Master note-taking skills</div>
                    ${noteProgress > 0 ? `
                    <div style="margin-top: 12px;">
                        <div style="height: 4px; background: var(--border-color); border-radius: 2px; overflow: hidden;">
                            <div style="height: 100%; width: ${noteProgress}%; background: var(--primary-color); transition: width 0.3s ease;"></div>
                        </div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                            ${noteProgress}% complete
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- NEW: REFINED Note Master -->
                <div class="skill-card" onclick="NovaRouter.navigate('note-master-refined')" style="border: 2px solid var(--primary-color);">
                    <div class="skill-icon">🎯</div>
                    <div class="skill-name">Note Master Refined</div>
                    <div class="skill-desc">NEW: Smart daily practice</div>
                    <div style="margin-top: 12px;">
                        <span style="background: var(--success-color); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; display: inline-block;">
                            Beta
                        </span>
                    </div>
                </div>

                <!-- Coming soon skills -->
                <div class="skill-card" style="opacity: 0.5; cursor: not-allowed;">
                    <div class="skill-icon">📖</div>
                    <div class="skill-name">Reading Master</div>
                    <div class="skill-desc">Coming soon</div>
                </div>

                <div class="skill-card" style="opacity: 0.5; cursor: not-allowed;">
                    <div class="skill-icon">💰</div>
                    <div class="skill-name">Money Master</div>
                    <div class="skill-desc">Coming soon</div>
                </div>

                <div class="skill-card" style="opacity: 0.5; cursor: not-allowed;">
                    <div class="skill-icon">✏️</div>
                    <div class="skill-name">Writing Master</div>
                    <div class="skill-desc">Coming soon</div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <button class="btn btn-secondary" onclick="NovaApp.showSettings()">
                    ⚙️ Settings
                </button>
            </div>
        </div>
    `;

    // Hide voice button on home
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) voiceBtn.classList.add('hidden');
}

    /**
     * Show settings screen
     */
    showSettings() {
        const container = document.getElementById('main-content');
        const currentTheme = NovaState.state.settings.theme || 'power';
        
        container.innerHTML = `
            <div class="settings-screen" style="max-width: 600px; margin: 0 auto;">
                <h1 style="margin-bottom: 32px;">Settings</h1>

                <!-- Theme Selection -->
                <div class="setting-section" style="background: var(--surface-color); padding: 24px; border-radius: 16px; margin-bottom: 20px;">
                    <h3 style="margin-bottom: 16px;">Choose Theme</h3>
                    <div class="theme-selector">
                        <div class="theme-option power ${currentTheme === 'power' ? 'active' : ''}" 
                             onclick="NovaApp.changeTheme('power')"
                             title="Power Mode">
                        </div>
                        <div class="theme-option chill ${currentTheme === 'chill' ? 'active' : ''}"
                             onclick="NovaApp.changeTheme('chill')"
                             title="Chill Vibes">
                        </div>
                        <div class="theme-option focus ${currentTheme === 'focus' ? 'active' : ''}"
                             onclick="NovaApp.changeTheme('focus')"
                             title="Focus Zone">
                        </div>
                        <div class="theme-option party ${currentTheme === 'party' ? 'active' : ''}"
                             onclick="NovaApp.changeTheme('party')"
                             title="Party Time">
                        </div>
                    </div>
                </div>

                <!-- Data Management -->
                <div class="setting-section" style="background: var(--surface-color); padding: 24px; border-radius: 16px; margin-bottom: 20px;">
                    <h3 style="margin-bottom: 16px;">Data</h3>
                    <button class="btn btn-secondary" onclick="NovaApp.exportData()" style="margin-right: 8px;">
                        Export Data
                    </button>
                    <button class="btn btn-secondary" onclick="NovaApp.resetAllData()">
                        Reset All Data
                    </button>
                </div>

                <!-- About -->
                <div class="setting-section" style="background: var(--surface-color); padding: 24px; border-radius: 16px;">
                    <h3 style="margin-bottom: 16px;">About Nova</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 12px;">
                        Version 1.0.0
                    </p>
                    <p style="color: var(--text-secondary);">
                        Learn at your own pace<br>
                        Built for teens who learn differently
                    </p>
                </div>

                <div style="text-align: center; margin-top: 32px;">
                    <button class="btn btn-primary" onclick="NovaRouter.navigate('home')">
                        Back to Home
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Change theme
     */
    changeTheme(theme) {
        NovaState.setTheme(theme);
        NovaToast.success('Theme changed!');
        this.showSettings(); // Refresh to show active theme
    },

    /**
     * Export data
     */
    exportData() {
        const data = {
            state: NovaState.state,
            analytics: NovaAnalytics.export(),
            exportDate: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `nova-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        NovaToast.success('Data exported!');
    },

    /**
     * Reset all data
     */
    resetAllData() {
        NovaModal.confirm(
            'Reset All Data?',
            'This will delete all your progress, settings, and data. This cannot be undone.',
            () => {
                NovaStorage.clear();
                NovaToast.success('All data reset!');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        );
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    NovaApp.init();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaApp;
}
