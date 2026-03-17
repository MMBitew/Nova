/**
 * NOVA - ANALYTICS SYSTEM
 * Local-only analytics (no external tracking)
 */

const NovaAnalytics = {
    events: [],

    /**
     * Track event
     */
    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            properties: {
                ...properties,
                userLevel: NovaState.state.user.level,
                userXP: NovaState.state.user.xp
            }
        };

        this.events.push(event);
        this.save();

        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.log('[Analytics]', eventName, properties);
        }
    },

    /**
     * Track skill opened
     */
    trackSkillOpened(skillId) {
        this.track('skill_opened', { skillId });
    },

    /**
     * Track lesson completed
     */
    trackLessonCompleted(skillId, lessonId, timeSpent) {
        this.track('lesson_completed', {
            skillId,
            lessonId,
            timeSpent
        });
    },

    /**
     * Track practice completed
     */
    trackPracticeCompleted(skillId, practiceId, score) {
        this.track('practice_completed', {
            skillId,
            practiceId,
            score
        });
    },

    /**
     * Track review completed
     */
    trackReviewCompleted(skillId, reviewId, score) {
        this.track('review_completed', {
            skillId,
            reviewId,
            score
        });
    },

    /**
     * Track challenge completed
     */
    trackChallengeCompleted(skillId, challengeId, score) {
        this.track('challenge_completed', {
            skillId,
            challengeId,
            score
        });
    },

    /**
     * Get event summary
     */
    getSummary() {
        const summary = {
            totalEvents: this.events.length,
            skillOpened: 0,
            lessonsCompleted: 0,
            practicesCompleted: 0,
            reviewsCompleted: 0,
            challengesCompleted: 0
        };

        this.events.forEach(event => {
            switch(event.name) {
                case 'skill_opened': summary.skillOpened++; break;
                case 'lesson_completed': summary.lessonsCompleted++; break;
                case 'practice_completed': summary.practicesCompleted++; break;
                case 'review_completed': summary.reviewsCompleted++; break;
                case 'challenge_completed': summary.challengesCompleted++; break;
            }
        });

        return summary;
    },

    /**
     * Export analytics data
     */
    export() {
        return {
            events: this.events,
            summary: this.getSummary(),
            exportDate: new Date().toISOString()
        };
    },

    /**
     * Save to localStorage
     */
    save() {
        NovaStorage.set('nova-analytics', { events: this.events });
    },

    /**
     * Load from localStorage
     */
    load() {
        const data = NovaStorage.get('nova-analytics');
        if (data && data.events) {
            this.events = data.events;
        }
    },

    /**
     * Clear all analytics
     */
    clear() {
        this.events = [];
        this.save();
    }
};

// Auto-load on init
NovaAnalytics.load();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaAnalytics;
}
