/**
 * NOVA - STATE MANAGEMENT
 * Centralized app state with localStorage persistence
 */

const NovaState = {
    // Current state
    state: {
        user: {
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: null
        },
        skills: {},
        settings: {
            theme: 'power',
            audioEnabled: true,
            volume: 0.7
        }
    },

    /**
     * Initialize state from localStorage
     */
    init() {
        const saved = NovaStorage.get('nova-state');
        if (saved) {
            this.state = { ...this.state, ...saved };
            this.updateStreak();
        }
        this.render();
    },

    /**
     * Get skill progress
     */
    getSkillProgress(skillId) {
        return this.state.skills[skillId] || {
            xpEarned: 0,
            lessonsCompleted: [],
            practicesCompleted: [],
            reviewsCompleted: [],
            challengesCompleted: [],
            currentActivity: null,
            badges: []
        };
    },

    /**
     * Mark activity as complete
     */
    markComplete(skillId, type, activityId, score) {
        if (!this.state.skills[skillId]) {
            this.state.skills[skillId] = this.getSkillProgress(skillId);
        }

        const skill = this.state.skills[skillId];
        const completedKey = `${type}sCompleted`;

        if (!skill[completedKey].includes(activityId)) {
            skill[completedKey].push(activityId);
        }

        if (score !== undefined) {
            if (!skill.scores) skill.scores = {};
            skill.scores[activityId] = score;
        }

        this.save();
    },

    /**
     * Award XP
     */
    awardXP(amount, skillId) {
        this.state.user.xp += amount;

        if (skillId && this.state.skills[skillId]) {
            this.state.skills[skillId].xpEarned += amount;
        }

        // Level up check
        const newLevel = Math.floor(this.state.user.xp / 100) + 1;
        if (newLevel > this.state.user.level) {
            this.state.user.level = newLevel;
            NovaToast.success(`Level ${newLevel}! 🎉`);
        }

        this.save();
        this.render();
    },

    /**
     * Update streak
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastActive = this.state.user.lastActiveDate;

        if (lastActive === today) {
            // Already active today
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastActive === yesterdayStr) {
            // Continuing streak
            this.state.user.streak++;
        } else if (lastActive !== null) {
            // Streak broken
            this.state.user.streak = 1;
        } else {
            // First time
            this.state.user.streak = 1;
        }

        this.state.user.lastActiveDate = today;
        this.save();
        this.render();
    },

    /**
     * Award badge
     */
    awardBadge(skillId, badgeId, badgeName) {
        if (!this.state.skills[skillId]) {
            this.state.skills[skillId] = this.getSkillProgress(skillId);
        }

        if (!this.state.skills[skillId].badges.includes(badgeId)) {
            this.state.skills[skillId].badges.push(badgeId);
            NovaToast.success(`Badge earned: ${badgeName} 🏆`);
        }

        this.save();
    },

    /**
     * Reset skill progress
     */
    resetSkill(skillId) {
        if (this.state.skills[skillId]) {
            delete this.state.skills[skillId];
            this.save();
        }
    },

    /**
     * Save to localStorage
     */
    save() {
        NovaStorage.set('nova-state', this.state);
    },

    /**
     * Render state to UI
     */
    render() {
        // Update XP display
        const xpEl = document.getElementById('xp');
        if (xpEl) xpEl.textContent = this.state.user.xp;

        // Update streak display
        const streakEl = document.getElementById('streak');
        if (streakEl) streakEl.textContent = this.state.user.streak;
    },

    /**
     * Change theme
     */
    setTheme(theme) {
        this.state.settings.theme = theme;
        document.body.className = `theme-${theme}`;
        this.save();
    },

    /**
     * Export data
     */
    exportData() {
        return JSON.stringify(this.state, null, 2);
    },

    /**
     * Import data
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.state = data;
            this.save();
            this.render();
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }
};

// Auto-init when loaded
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaState;
}
