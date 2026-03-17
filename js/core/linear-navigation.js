/**
 * NOVA - LINEAR NAVIGATION CONTROLLER
 * Auto-guided flow - no decision fatigue
 */

const LinearNavigation = {
    skill: null,
    currentIndex: 0,
    sequence: [],

    /**
     * Initialize linear navigation for a skill
     */
    async init(skillId) {
        this.skill = await ContentLoader.loadSkill(skillId);
        this.sequence = this.skill.sequence;
        this.currentIndex = this.findResumePoint();
        
        // Auto-start or resume
        this.navigateToCurrentItem();
    },

    /**
     * Find where user should resume
     */
    findResumePoint() {
        const progress = NovaState.getSkillProgress(this.skill.skillId);
        if (!progress || !progress.completed) {
            return 0; // Start at beginning
        }

        // Find first incomplete item
        for (let i = 0; i < this.sequence.length; i++) {
            const item = this.sequence[i];
            const isComplete = this.isItemComplete(item, progress);
            
            if (!isComplete) {
                return i;
            }
        }

        // All complete - return to last item
        return this.sequence.length - 1;
    },

    /**
     * Check if item is complete
     */
    isItemComplete(item, progress) {
        switch(item.type) {
            case 'lesson':
                return progress.lessonsCompleted?.includes(item.id) || false;
            case 'practice':
                return progress.practicesCompleted?.includes(item.id) || false;
            case 'review':
                return progress.reviewsCompleted?.includes(item.id) || false;
            case 'challenge':
                return progress.challengesCompleted?.includes(item.id) || false;
            default:
                return false;
        }
    },

    /**
     * Navigate to current item in sequence
     */
    async navigateToCurrentItem() {
        const item = this.sequence[this.currentIndex];
        if (!item) {
            this.showCompletion();
            return;
        }

        // Update progress display
        this.updateProgressBar();

        // Load and display content
        switch(item.type) {
            case 'lesson':
                await this.loadLesson(item.id);
                break;
            case 'practice':
                await this.loadPractice(item.id);
                break;
            case 'review':
                await this.loadReview(item.id);
                break;
            case 'challenge':
                await this.loadChallenge(item.id);
                break;
        }
    },

    /**
     * Update progress bar
     */
    updateProgressBar() {
        const total = this.sequence.length;
        const current = this.currentIndex + 1;
        const percent = Math.round((this.currentIndex / total) * 100);

        const progressHTML = `
            <div class="linear-progress">
                <div class="progress-text">Step ${current} of ${total}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${percent}%"></div>
                </div>
                <div class="progress-next">Next: ${this.getNextItemName()}</div>
            </div>
        `;

        const container = document.getElementById('progress-container');
        if (container) {
            container.innerHTML = progressHTML;
        }
    },

    /**
     * Get next item name for preview
     */
    getNextItemName() {
        const nextItem = this.sequence[this.currentIndex + 1];
        if (!nextItem) return 'Finish!';

        const typeNames = {
            'lesson': 'Lesson',
            'practice': 'Practice',
            'review': 'Review',
            'challenge': 'Challenge'
        };

        return typeNames[nextItem.type] || 'Next';
    },

    /**
     * Load lesson
     */
    async loadLesson(lessonId) {
        const lessonSlug = this.skill.lessonMap[lessonId];
        const lessonData = await ContentLoader.loadLesson(this.skill.skillId, `${lessonId}-${lessonSlug}`);
        
        // Render lesson
        await LessonRenderer.render(lessonData);
        
        // Override completion handler to auto-advance
        LessonRenderer.completeLesson = () => {
            this.onItemComplete('lesson', lessonId);
        };
    },

    /**
     * Load practice
     */
    async loadPractice(practiceId) {
        const practiceData = await ContentLoader.loadPractice(this.skill.skillId, practiceId);
        
        // Render practice
        await PracticeRenderer.render(practiceData);
        
        // Override completion handler
        PracticeRenderer.completePractice = () => {
            this.onItemComplete('practice', practiceId);
        };
    },

    /**
     * Load review
     */
    async loadReview(reviewId) {
        const reviewData = await ContentLoader.loadReview(this.skill.skillId, reviewId);
        
        // Render review
        await ReviewRenderer.render(reviewData);
        
        // Override completion handler
        ReviewRenderer.completeReview = (score) => {
            this.onItemComplete('review', reviewId, score);
        };
    },

    /**
     * Load challenge
     */
    async loadChallenge(challengeId) {
        const challengeData = await ContentLoader.loadChallenge(this.skill.skillId, challengeId);
        
        // Render challenge
        await ChallengeRenderer.render(challengeData);
        
        // Override completion handler
        ChallengeRenderer.completeChallenge = (score) => {
            this.onItemComplete('challenge', challengeId, score);
        };
    },

    /**
     * Handle item completion - AUTO ADVANCE
     */
    onItemComplete(type, id, score) {
        const item = this.sequence[this.currentIndex];
        
        // Mark complete in state
        NovaState.markComplete(this.skill.skillId, type, id, score);

        // Award XP
        const xp = this.skill.xpStructure[type];
        NovaState.awardXP(xp, this.skill.skillId);

        // Show completion message
        const isMilestone = item.milestone || false;
        this.showItemCompletion(type, xp, isMilestone);

        // Auto-advance after short delay
        setTimeout(() => {
            this.advance();
        }, isMilestone ? 2000 : 1500);
    },

    /**
     * Show item completion
     */
    showItemCompletion(type, xp, milestone) {
        const messages = {
            'lesson': `Lesson complete! +${xp} XP`,
            'practice': `Practice complete! +${xp} XP`,
            'review': `Review complete! +${xp} XP`,
            'challenge': `Challenge complete! +${xp} XP`
        };

        const message = messages[type] || `Complete! +${xp} XP`;
        
        if (milestone) {
            NovaToast.success(`🎉 ${message} 🎉`);
        } else {
            NovaToast.success(message);
        }
    },

    /**
     * Advance to next item
     */
    advance() {
        this.currentIndex++;
        
        if (this.currentIndex >= this.sequence.length) {
            this.showCompletion();
            return;
        }

        // Navigate to next
        this.navigateToCurrentItem();
        
        // Scroll to top
        window.scrollTo(0, 0);
    },

    /**
     * Go back one item
     */
    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.navigateToCurrentItem();
            window.scrollTo(0, 0);
        } else {
            // At beginning - go back to skills menu
            NovaRouter.navigate('home');
        }
    },

    /**
     * Show completion screen
     */
    showCompletion() {
        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div class="completion-screen">
                <div class="completion-icon">🏆</div>
                <h1>Core 60 Complete!</h1>
                <p>You mastered note-taking!</p>
                <div class="completion-stats">
                    <div class="stat">
                        <div class="stat-value">${this.sequence.length}</div>
                        <div class="stat-label">Activities</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">1,020</div>
                        <div class="stat-label">XP Earned</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">15</div>
                        <div class="stat-label">Badges</div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="NovaRouter.navigate('home')">
                    Back to Skills
                </button>
                <button class="btn btn-secondary" onclick="LinearNavigation.showBonusTrack()">
                    Try Bonus Track →
                </button>
            </div>
        `;
    },

    /**
     * Show bonus track option
     */
    showBonusTrack() {
        NovaToast.show('Bonus Track coming soon! 🚀');
    },

    /**
     * View progress (optional - accessed via settings)
     */
    showProgressView() {
        const completed = this.currentIndex;
        const total = this.sequence.length;
        const percent = Math.round((completed / total) * 100);

        const container = document.getElementById('main-content');
        container.innerHTML = `
            <div class="progress-view">
                <h2>Your Progress</h2>
                <div class="big-progress">
                    <div class="big-progress-bar">
                        <div class="big-progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <div class="big-progress-text">${completed} of ${total} complete (${percent}%)</div>
                </div>
                <div class="progress-breakdown">
                    <h3>Completed:</h3>
                    ${this.renderCompletedList()}
                </div>
                <button class="btn btn-primary" onclick="LinearNavigation.navigateToCurrentItem()">
                    Continue Learning →
                </button>
            </div>
        `;
    },

    /**
     * Render completed items list
     */
    renderCompletedList() {
        let html = '<div class="completed-items">';
        
        for (let i = 0; i < this.currentIndex; i++) {
            const item = this.sequence[i];
            const icon = this.getItemIcon(item.type);
            const name = this.getItemName(item);
            
            html += `
                <div class="completed-item">
                    <span class="item-icon">${icon}</span>
                    <span class="item-name">${name}</span>
                    <span class="item-check">✓</span>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    },

    /**
     * Get item icon
     */
    getItemIcon(type) {
        const icons = {
            'lesson': '📖',
            'practice': '🎯',
            'review': '📝',
            'challenge': '🏆'
        };
        return icons[type] || '•';
    },

    /**
     * Get item display name
     */
    getItemName(item) {
        // Could load from content, but for now use ID
        return `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}: ${item.id}`;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinearNavigation;
}
