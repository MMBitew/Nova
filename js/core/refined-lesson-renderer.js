/**
 * NOVA - REFINED LESSON RENDERER
 * Renders Introduce → Ask → Evaluate → Adapt lessons
 */
 
const RefinedLessonRenderer = {
    currentLesson: null,
    currentQuestionIndex: 0,
    performance: {
        questionsAttempted: 0,
        questionsCorrect: 0,
        firstTryCorrect: 0,
        retriesNeeded: 0,
        hintsUsed: 0,
        startTime: Date.now()
    },
 
    /**
     * Load and start a refined lesson
     */
    async load(conceptId, isReview = false) {
        try {
            const lessonNumber = this.getConceptIndex(conceptId) + 1;
            const lessonFile = `L0${lessonNumber}-${conceptId}-refined.json`;
            const response = await fetch(`data/content/note-master/refined-lessons/${lessonFile}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.currentLesson = await response.json();
            
            // Reset performance tracking
            this.performance = {
                questionsAttempted: 0,
                questionsCorrect: 0,
                firstTryCorrect: 0,
                retriesNeeded: 0,
                hintsUsed: 0,
                startTime: Date.now(),
                isReview
            };
 
            // Start with intro or skip to questions if review
            if (isReview) {
                this.showQuestion(0);
            } else {
                this.showIntro();
            }
 
        } catch (error) {
            console.error('Failed to load refined lesson:', error);
            // Only show error if not a 404 on initial load
            if (error.message.includes('404')) {
                console.warn('Lesson file not found - this is normal on page load');
            } else {
                NovaToast.error('Could not load lesson');
            }
        }
    },
 
    /**
     * Get concept index for file lookup
     */
    getConceptIndex(conceptId) {
        return ['main-idea', 'keywords', 'short-notes', 'bullets', 'symbols'].indexOf(conceptId);
    },
 
    /**
     * Show intro step
     */
    showIntro() {
        const intro = this.currentLesson.introduce;
        const container = document.getElementById('main-content');
 
        container.innerHTML = `
            <div class="step-card" style="text-align: center;">
                <div class="step-icon" style="font-size: 64px; margin-bottom: 16px;">${intro.content.icon}</div>
                <div class="step-title" style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">${intro.content.title}</div>
                <div class="step-text" style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">${intro.content.subtitle}</div>
                
                ${intro.content.example ? `
                    <div class="step-example" style="margin: 32px auto; max-width: 500px;">
                        <div style="margin-bottom: 12px; color: var(--text-secondary); line-height: 1.6;">
                            ${intro.content.example.text}
                        </div>
                        ${intro.content.example.highlight ? `
                            <div style="padding: 12px; background: rgba(99, 102, 241, 0.1); border-radius: 8px; font-weight: 600; color: var(--primary-color); margin-top: 12px;">
                                ${intro.content.example.highlight}
                                ${intro.content.example.label ? `<span style="font-weight: normal; color: var(--text-secondary);"> ${intro.content.example.label}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
 
                <button class="btn btn-primary" onclick="RefinedLessonRenderer.startQuestions()" style="font-size: 18px; padding: 16px 32px;">
                    Got it! →
                </button>
            </div>
        `;
    },
 
    /**
     * Start questions
     */
    startQuestions() {
        this.currentQuestionIndex = 0;
        this.showQuestion(0);
    },
 
    /**
     * Show a question
     */
    showQuestion(index) {
        const questions = this.currentLesson.questions;
        
        if (index >= questions.length) {
            this.completeLesson();
            return;
        }
 
        const question = questions[index];
        this.currentQuestionIndex = index;
 
        // Render based on question type
        switch (question.type) {
            case 'multiple-choice':
                this.renderMultipleChoice(question);
                break;
            case 'tap-keywords':
                this.renderTapKeywords(question);
                break;
            case 'choose-shortest':
                this.renderChooseShortest(question);
                break;
            default:
                this.renderMultipleChoice(question);
        }
 
        this.performance.questionsAttempted++;
    },
 
    /**
     * Render multiple choice question
     */
    renderMultipleChoice(question) {
        const container = document.getElementById('main-content');
        
        const totalQuestions = this.currentLesson.questions.length;
        const currentQuestion = this.currentQuestionIndex + 1;
        const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);
 
        container.innerHTML = `
            <div class="step-card">
                <!-- Progress Bar -->
                <div style="margin-bottom: 24px;">
                    <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${progressPercent}%; background: var(--primary-color); transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 8px; text-align: center;">
                        ${currentQuestion} of ${totalQuestions}
                    </div>
                </div>
 
                <div class="practice-prompt" style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">
                    ${question.prompt}
                </div>
 
                ${question.context ? `
                    <div class="sentence-container" style="background: rgba(99, 102, 241, 0.05); padding: 16px; border-radius: 12px; margin-bottom: 20px; line-height: 1.6;">
                        ${question.context.text}
                    </div>
                ` : ''}
 
                <div class="options-container" style="margin-top: 24px;">
                    ${question.options.map((opt, i) => `
                        <button class="option-button" 
                                data-option-id="${opt.id}"
                                onclick="RefinedLessonRenderer.selectAnswer('${opt.id}', ${opt.isCorrect})"
                                style="width: 100%; padding: 16px; margin-bottom: 12px; border: 2px solid var(--border-color); border-radius: 12px; background: var(--surface-color); cursor: pointer; text-align: left; font-size: 16px; transition: all 0.2s ease; display: block;">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <style>
            .option-button:hover {
                border-color: var(--primary-color);
                background: rgba(99, 102, 241, 0.05);
                transform: translateX(4px);
            }
            
            .option-button:active {
                transform: scale(0.98);
            }
            
            .option-button:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }
            </style>
        `;
    },
 
    /**
     * Handle answer selection
     */
    selectAnswer(optionId, isCorrect) {
        const question = this.currentLesson.questions[this.currentQuestionIndex];
        const option = question.options.find(o => o.id === optionId);
 
        // Track performance
        if (isCorrect) {
            this.performance.questionsCorrect++;
            if (this.performance.retriesNeeded === 0) {
                this.performance.firstTryCorrect++;
            }
        } else {
            this.performance.retriesNeeded++;
        }
 
        // Show feedback
        this.showFeedback(option, isCorrect);
    },
 
    /**
     * Show feedback and auto-advance
     */
    showFeedback(option, isCorrect) {
        // Disable all buttons
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
        });
 
        // Highlight selected answer
        const selectedButton = document.querySelector(`[data-option-id="${option.id}"]`);
        if (selectedButton) {
            selectedButton.style.borderColor = isCorrect ? 'var(--success-color)' : 'var(--error-color)';
            selectedButton.style.background = isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            selectedButton.style.fontWeight = 'bold';
        }
 
        const feedback = isCorrect ? option.feedback.correct : option.feedback.incorrect;
 
        // Show toast feedback
        if (isCorrect) {
            NovaToast.success('✓ ' + feedback);
            
            // Auto-advance after 1.5 seconds
            setTimeout(() => {
                this.handleNext();
            }, 1500);
        } else {
            NovaToast.warning('↻ ' + feedback);
            
            // Re-enable other buttons for retry after 1.5 seconds
            setTimeout(() => {
                document.querySelectorAll('.option-button').forEach(btn => {
                    if (btn.dataset.optionId !== option.id) {
                        btn.disabled = false;
                        btn.style.pointerEvents = 'auto';
                    }
                });
            }, 1500);
        }
    },
 
    /**
     * Handle next question
     */
    handleNext() {
        this.showQuestion(this.currentQuestionIndex + 1);
    },
 
    /**
     * Complete lesson
     */
    completeLesson() {
        const duration = Math.floor((Date.now() - this.performance.startTime) / 1000);
        const accuracy = this.performance.questionsCorrect / this.performance.questionsAttempted;
 
        // Determine performance level
        let completionType = 'needsPractice';
        if (accuracy >= 0.8 && this.performance.firstTryCorrect >= 2) {
            completionType = 'mastery';
        } else if (accuracy >= 0.5) {
            completionType = 'good';
        }
 
        const completion = this.currentLesson.completion[completionType];
 
        // Award XP
        NovaGamification.awardXP(
            completion.xp,
            'note-master',
            'refined-lesson'
        );
 
        // Schedule review
        const reviewSchedule = NovaRepetition.scheduleReview(
            this.currentLesson.conceptId,
            {
                questionsCorrect: this.performance.questionsCorrect,
                questionsTotal: this.performance.questionsAttempted,
                firstTryCorrect: this.performance.firstTryCorrect
            }
        );
 
        // Track analytics
        NovaAnalytics.track('refined_lesson_complete', {
            conceptId: this.currentLesson.conceptId,
            performance: completionType,
            accuracy,
            duration,
            ...this.performance
        });
 
        // Show completion
        this.showCompletion(completion, reviewSchedule);
    },
 
    /**
     * Show completion screen
     */
    showCompletion(completion, reviewSchedule) {
        const container = document.getElementById('main-content');
 
        const reviewText = this.getReviewTimeText(reviewSchedule.hoursUntilReview);
 
        container.innerHTML = `
            <div class="completion-screen" style="text-align: center; padding: 40px 20px;">
                <div class="completion-icon" style="font-size: 80px; margin-bottom: 16px;">
                    ${completion.message.includes('mastered') ? '🏆' : '🎯'}
                </div>
                <h1 style="font-size: 32px; margin-bottom: 32px;">${completion.message}</h1>
                
                <div class="completion-stats" style="display: flex; justify-content: center; gap: 40px; margin: 32px 0;">
                    <div class="stat">
                        <div class="stat-value" style="font-size: 36px; font-weight: bold; color: var(--primary-color);">${this.performance.questionsCorrect}</div>
                        <div class="stat-label" style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">Correct</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="font-size: 36px; font-weight: bold; color: var(--primary-color);">+${completion.xp}</div>
                        <div class="stat-label" style="font-size: 14px; color: var(--text-secondary); margin-top: 4px;">XP</div>
                    </div>
                </div>
 
                <div style="margin: 24px 0; padding: 16px; background: var(--bg-color); border-radius: 12px;">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">
                        Review scheduled:
                    </div>
                    <div style="font-size: 18px; font-weight: 600; color: var(--primary-color);">
                        ${reviewText}
                    </div>
                </div>
 
                <div class="btn-container" style="margin-top: 32px;">
                    <button class="btn btn-primary" onclick="RefinedLessonRenderer.continueSession()" style="font-size: 18px; padding: 16px 32px;">
                        Continue
                    </button>
                </div>
            </div>
        `;
    },
 
    /**
     * Get friendly review time text
     */
    getReviewTimeText(hours) {
        if (hours < 24) {
            return `In ${hours} hours`;
        } else if (hours < 168) {
            const days = Math.round(hours / 24);
            return `In ${days} day${days > 1 ? 's' : ''}`;
        } else {
            const weeks = Math.round(hours / 168);
            return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
        }
    },
 
    /**
     * Continue to next session item
     */
    continueSession() {
        const session = NovaStorage.get('current-session');
        if (session) {
            NovaRepetition.startSessionItem(session.currentIndex + 1);
        } else {
            NovaRouter.navigate('home');
        }
    },
 
    /**
     * Render tap keywords question (placeholder)
     */
    renderTapKeywords(question) {
        this.renderMultipleChoice(question);
    },
 
    /**
     * Render choose shortest question (placeholder)
     */
    renderChooseShortest(question) {
        this.renderMultipleChoice(question);
    }
};
 
// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RefinedLessonRenderer;
}
