/**
 * NOVA - GAMIFICATION SYSTEM
 * XP, levels, badges, streaks
 */

const NovaGamification = {
    /**
     * Calculate level from XP
     */
    calculateLevel(xp) {
        return Math.floor(xp / 100) + 1;
    },

    /**
     * Calculate XP needed for next level
     */
    xpForNextLevel(currentXp) {
        const currentLevel = this.calculateLevel(currentXp);
        const nextLevelXp = currentLevel * 100;
        return nextLevelXp - currentXp;
    },

    /**
     * Get XP progress percentage for current level
     */
    getLevelProgress(xp) {
        const level = this.calculateLevel(xp);
        const levelStartXp = (level - 1) * 100;
        const progressInLevel = xp - levelStartXp;
        return (progressInLevel / 100) * 100;
    },

    /**
     * Award XP with celebration
     */
    awardXP(amount, skillId, reason = '') {
        const oldXp = NovaState.state.user.xp;
        const oldLevel = this.calculateLevel(oldXp);
        
        NovaState.awardXP(amount, skillId);
        
        const newXp = NovaState.state.user.xp;
        const newLevel = this.calculateLevel(newXp);

        // Show toast
        NovaToast.success(`+${amount} XP ${reason}`, 2000);

        // Check for level up
        if (newLevel > oldLevel) {
            this.celebrateLevelUp(newLevel);
        }
    },

    /**
     * Celebrate level up
     */
    celebrateLevelUp(newLevel) {
        setTimeout(() => {
            NovaModal.show(
                '🎉 Level Up!',
                `<div class="text-center">
                    <div style="font-size: 64px; margin: 20px 0;">🏆</div>
                    <h2 style="font-size: 36px; margin: 10px 0;">Level ${newLevel}!</h2>
                    <p style="font-size: 18px; color: var(--text-secondary);">
                        Keep learning and growing!
                    </p>
                </div>`,
                {
                    buttons: [{
                        label: 'Awesome!',
                        class: 'btn-primary',
                        onClick: 'NovaModal.hide()'
                    }]
                }
            );
        }, 500);
    },

    /**
     * Award badge
     */
    awardBadge(skillId, badge) {
        NovaState.awardBadge(skillId, badge.id, badge.name);
        
        setTimeout(() => {
            NovaModal.show(
                '🏆 Badge Earned!',
                `<div class="text-center">
                    <div style="font-size: 64px; margin: 20px 0;">${badge.icon || '🏆'}</div>
                    <h2 style="font-size: 28px; margin: 10px 0;">${badge.name}</h2>
                    <p style="font-size: 16px; color: var(--text-secondary);">
                        ${badge.description || 'Great achievement!'}
                    </p>
                </div>`,
                {
                    buttons: [{
                        label: 'Nice!',
                        class: 'btn-primary',
                        onClick: 'NovaModal.hide()'
                    }]
                }
            );
        }, 800);
    },

    /**
     * Get all badges for a skill
     */
    getBadges(skillId) {
        const progress = NovaState.getSkillProgress(skillId);
        return progress.badges || [];
    },

    /**
     * Check if badge already earned
     */
    hasBadge(skillId, badgeId) {
        const badges = this.getBadges(skillId);
        return badges.includes(badgeId);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaGamification;
}
