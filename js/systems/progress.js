/**
 * NOVA - PROGRESS TRACKING
 * Track and display learning progress
 */

const NovaProgress = {
    /**
     * Get completion percentage for a skill
     */
    getCompletionPercentage(skillId, totalActivities) {
        const progress = NovaState.getSkillProgress(skillId);
        const completed = 
            progress.lessonsCompleted.length +
            progress.practicesCompleted.length +
            progress.reviewsCompleted.length +
            progress.challengesCompleted.length;
        
        return Math.round((completed / totalActivities) * 100);
    },

    /**
     * Get detailed progress stats
     */
    getStats(skillId) {
        const progress = NovaState.getSkillProgress(skillId);
        
        return {
            lessons: {
                completed: progress.lessonsCompleted.length,
                total: 15
            },
            practices: {
                completed: progress.practicesCompleted.length,
                total: 30
            },
            reviews: {
                completed: progress.reviewsCompleted.length,
                total: 10
            },
            challenges: {
                completed: progress.challengesCompleted.length,
                total: 5
            },
            xp: progress.xpEarned || 0,
            badges: progress.badges?.length || 0
        };
    },

    /**
     * Render progress display
     */
    renderProgress(skillId, container) {
        const stats = this.getStats(skillId);
        const totalActivities = 60; // Core 60
        const totalCompleted = 
            stats.lessons.completed +
            stats.practices.completed +
            stats.reviews.completed +
            stats.challenges.completed;
        const percentage = Math.round((totalCompleted / totalActivities) * 100);

        container.innerHTML = `
            <div class="progress-display">
                <h2>Your Progress</h2>
                <div class="big-progress">
                    <div class="big-progress-bar">
                        <div class="big-progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="big-progress-text">
                        ${totalCompleted} of ${totalActivities} (${percentage}%)
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${stats.lessons.completed}/${stats.lessons.total}</div>
                        <div class="stat-label">Lessons</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.practices.completed}/${stats.practices.total}</div>
                        <div class="stat-label">Practices</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.reviews.completed}/${stats.reviews.total}</div>
                        <div class="stat-label">Reviews</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.challenges.completed}/${stats.challenges.total}</div>
                        <div class="stat-label">Challenges</div>
                    </div>
                </div>
                <div class="rewards-summary">
                    <div class="reward-item">
                        <span class="reward-icon">⭐</span>
                        <span class="reward-value">${stats.xp} XP</span>
                    </div>
                    <div class="reward-item">
                        <span class="reward-icon">🏆</span>
                        <span class="reward-value">${stats.badges} Badges</span>
                    </div>
                </div>
            </div>
        `;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaProgress;
}
