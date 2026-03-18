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
            const response = await fetch(`data/content/note-master/refined-lessons/L0${this.getConceptIndex(conceptId) + 1}-${conceptId}-refined.json`);
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
        // Don't show toast on initial load, only on actual errors
        if (error.message !== 'HTTP error! status: 404') {
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
                <div class="step-icon">${intro.content.icon}</div>
                <div class="step-title">${intro.content.title}</div>
                <div class="step-text">${intro.content.subtitle}</div>
                
                ${intro.content.example ? `
                    <div class="step-example" style="margin: 32px auto; max-width: 500px;">
                        <div style="margin-bottom: 12px; color: var(--text-secondary);">
                            ${intro.content.example.text}
                        </div>
                        ${intro.content.example.highlight ? `
                            <div style="padding: 12px; background: rgba(99, 102, 241, 0.1); border-radius: 8px; font-weight: 600; color: var(--primary-color);">
                                ${intro.content.example.highlight}
                                ${intro.content.example.label ? `<span style="font-weight: normal; color: var(--text-secondary);"> ${intro.content.example.label}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <button class="btn btn-primary" onclick="RefinedLessonRenderer.startQuestions()">
                    Got it! →
                </button>
            </div>
        `;

        // Auto-advance if configured
        if (intro.autoAdvance) {
            setTimeout(() => {
                const btn = container.querySelector('.btn-primary');
                if (btn) btn.style.opacity = '1';
            }, intro.autoAdvance * 1000);
        }

        // Read aloud if audio enabled
        if (NovaState.user.audioEnabled && intro.content.audio) {
            NovaAudio.speak(intro.content.audio);
        }
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
                this.renderMultipleChoice(question); // Fallback
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

                <div class="practice-prompt">${question.prompt}</div>

                ${question.context ? `
                    <div class="sentence-container">
                        ${question.context.text}
                    </div>
                ` : ''}

               <div class="options-container" style="margin-top: 24px;">
    ${question.options.map((opt, i) => `
        <button class="option-button" 
                data-option-id="${opt.id}"
                onclick="RefinedLessonRenderer.selectAnswer('${opt.id}', ${opt.isCorrect})"
                style="width: 100%; padding: 16px; margin-bottom: 12px; border: 2px solid var(--border-color); border-radius: 12px; background: var(--surface-color); cursor: pointer; text-align: left; font-size: 16px; transition: all 0.2s ease;">
            ${opt.text}
        </button>
    `).join('')}
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
</style>
            </div>
        `;
    },

    /**
     * Handle answer selection
     */
    selectAnswer(optionId, isCorrect) {
        const question = this.currentLesson.questions[this.currentQuestionIndex];
        const option = question.options.find(o => o.id === optionId);

        // Highlight selected
        document.querySelectorAll('.example-option').forEach(el => {
            el.style.pointerEvents = 'none';
            if (el.dataset.optionId === optionId) {
                el.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });

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
        setTimeout(() => {
            this.showFeedback(option, isCorrect);
        }, 500);
    },

    /**
     * Show feedback
     */
    /**
 * Show feedback
 */
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
}

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
}

/**
 * Handle next question
 */
handleNext() {
    // For now, just advance to next question
    // In full version, this would use adaptive routing
    this.showQuestion(this.currentQuestionIndex + 1);
}
    /**
     * Handle next question
     */
    handleNext() {
        // For now, just advance to next question
        // In full version, this would use adaptive routing
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

        const nextReviewDate = new Date(reviewSchedule.nextReview);
        const reviewText = this.getReviewTimeText(reviewSchedule.hoursUntilReview);

        container.innerHTML = `
            <div class="completion-screen">
                <div class="completion-icon">
                    ${completion.message.includes('mastered') ? '🏆' : '🎯'}
                </div>
                <h1>${completion.message}</h1>
                
                <div class="completion-stats">
                    <div class="stat">
                        <div class="stat-value">${this.performance.questionsCorrect}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">+${completion.xp}</div>
                        <div class="stat-label">XP</div>
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

                <div class="btn-container">
                    <button class="btn btn-primary" onclick="RefinedLessonRenderer.continueSession()">
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
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RefinedLessonRenderer;
}
