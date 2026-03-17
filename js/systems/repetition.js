/**
 * NOVA - SPACED REPETITION SYSTEM
 * Schedules concept reviews based on performance
 */

const NovaRepetition = {
    
    /**
     * Spacing intervals (in hours)
     */
    intervals: {
        // For concepts user is mastering
        mastery: [48, 96, 168, 336],  // 2 days, 4 days, 1 week, 2 weeks
        
        // For concepts user knows but needs reinforcement
        good: [24, 48, 96, 168],  // 1 day, 2 days, 4 days, 1 week
        
        // For concepts user is struggling with
        struggling: [4, 8, 24, 48],  // 4 hours, 8 hours, 1 day, 2 days
        
        // For brand new concepts
        new: [24, 48, 96]  // 1 day, 2 days, 4 days
    },

    /**
     * Get all concepts due for review
     */
    getDueReviews() {
        const concepts = NovaStorage.get('nova-concepts') || {};
        const now = Date.now();
        const due = [];

        for (const [conceptId, data] of Object.entries(concepts)) {
            if (data.nextReview && data.nextReview <= now) {
                due.push({
                    conceptId,
                    ...data,
                    overdue: now - data.nextReview
                });
            }
        }

        // Sort by most overdue first
        return due.sort((a, b) => b.overdue - a.overdue);
    },

    /**
     * Schedule next review for a concept
     */
    scheduleReview(conceptId, performance) {
        const concepts = NovaStorage.get('nova-concepts') || {};
        const concept = concepts[conceptId] || {
            conceptId,
            attempts: 0,
            correctCount: 0,
            lastReview: null,
            intervalIndex: 0,
            performanceHistory: []
        };

        // Update statistics
        concept.attempts++;
        concept.lastReview = Date.now();
        concept.performanceHistory.push({
            timestamp: Date.now(),
            performance,
            questionsCorrect: performance.questionsCorrect || 0,
            questionsTotal: performance.questionsTotal || 0
        });

        // Determine performance level
        const level = this.getPerformanceLevel(performance);
        
        // Get appropriate interval sequence
        const intervals = this.intervals[level];
        
        // Advance or reset interval index
        if (level === 'mastery') {
            concept.intervalIndex = Math.min(
                concept.intervalIndex + 1,
                intervals.length - 1
            );
        } else if (level === 'struggling') {
            concept.intervalIndex = 0; // Reset to shortest interval
        } else {
            // Good performance - advance but not as fast
            concept.intervalIndex = Math.min(
                Math.floor(concept.intervalIndex + 0.5),
                intervals.length - 1
            );
        }

        // Calculate next review time
        const hoursUntilReview = intervals[concept.intervalIndex];
        concept.nextReview = Date.now() + (hoursUntilReview * 60 * 60 * 1000);
        concept.performanceLevel = level;

        // Save updated concept
        concepts[conceptId] = concept;
        NovaStorage.set('nova-concepts', concepts);

        return {
            nextReview: concept.nextReview,
            hoursUntilReview,
            performanceLevel: level
        };
    },

    /**
     * Determine performance level from session results
     */
    getPerformanceLevel(performance) {
        const { questionsCorrect = 0, questionsTotal = 1, firstTryCorrect = 0 } = performance;
        const accuracy = questionsCorrect / questionsTotal;
        const firstTryRate = firstTryCorrect / questionsTotal;

        // Mastery: 80%+ correct, 60%+ first-try
        if (accuracy >= 0.8 && firstTryRate >= 0.6) {
            return 'mastery';
        }
        
        // Struggling: < 50% correct
        if (accuracy < 0.5) {
            return 'struggling';
        }

        // Good: everything else
        return 'good';
    },

    /**
     * Generate today's practice session
     */
    generateDailySession() {
        const dueReviews = this.getDueReviews();
        const concepts = NovaStorage.get('nova-concepts') || {};
        
        const session = {
            reviews: [],
            new: null,
            estimatedTime: 0
        };

        // Add up to 3 due reviews (most overdue first)
        session.reviews = dueReviews.slice(0, 3).map(r => r.conceptId);
        session.estimatedTime += session.reviews.length * 5; // 5 min per review

        // Add 1 new concept if not too many reviews
        if (session.reviews.length < 2) {
            const newConcept = this.getNextNewConcept();
            if (newConcept) {
                session.new = newConcept;
                session.estimatedTime += 8; // 8 min for new concept
            }
        }

        return session;
    },

    /**
     * Get next concept user hasn't started
     */
    getNextNewConcept() {
        const allConcepts = [
            'main-idea',
            'keywords',
            'short-notes',
            'bullets',
            'symbols'
        ];

        const learnedConcepts = NovaStorage.get('nova-concepts') || {};
        
        for (const conceptId of allConcepts) {
            if (!learnedConcepts[conceptId]) {
                return conceptId;
            }
        }

        return null; // All concepts learned
    },

    /**
     * Get concept statistics
     */
    getConceptStats(conceptId) {
        const concepts = NovaStorage.get('nova-concepts') || {};
        const concept = concepts[conceptId];

        if (!concept) {
            return {
                status: 'not-started',
                attempts: 0,
                accuracy: 0
            };
        }

        const totalCorrect = concept.performanceHistory.reduce(
            (sum, h) => sum + (h.questionsCorrect || 0), 0
        );
        const totalQuestions = concept.performanceHistory.reduce(
            (sum, h) => sum + (h.questionsTotal || 1), 0
        );

        return {
            status: concept.performanceLevel || 'learning',
            attempts: concept.attempts,
            accuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0,
            lastReview: concept.lastReview,
            nextReview: concept.nextReview,
            intervalIndex: concept.intervalIndex
        };
    },

    /**
     * Show today's session to user
     */
    showDailySessionPrompt() {
        const session = this.generateDailySession();
        
        if (session.reviews.length === 0 && !session.new) {
            NovaToast.show('✨ No practice due today! Check back tomorrow', 'success', 3000);
            return null;
        }

        let message = '📅 Today\'s Practice:\n';
        
        if (session.new) {
            message += `\n🆕 Learn: ${this.getConceptName(session.new)}`;
        }

        if (session.reviews.length > 0) {
            message += `\n🔄 Review: ${session.reviews.length} concept${session.reviews.length > 1 ? 's' : ''}`;
        }

        message += `\n\n⏱️ About ${session.estimatedTime} minutes`;

        NovaModal.show(
            'Ready to Learn?',
            `<p style="white-space: pre-line; line-height: 1.8;">${message}</p>`,
            [
                {
                    text: 'Start Session',
                    class: 'btn-primary',
                    onclick: `NovaRepetition.startDailySession(); NovaModal.close();`
                },
                {
                    text: 'Later',
                    class: 'btn-secondary',
                    onclick: 'NovaModal.close()'
                }
            ]
        );

        return session;
    },

    /**
     * Start today's session
     */
    async startDailySession() {
        const session = this.generateDailySession();
        
        // Store session in state
        NovaStorage.set('current-session', {
            items: [
                ...(session.new ? [{ type: 'new', conceptId: session.new }] : []),
                ...session.reviews.map(id => ({ type: 'review', conceptId: id }))
            ],
            currentIndex: 0,
            startTime: Date.now()
        });

        // Start first item
        this.startSessionItem(0);
    },

    /**
     * Start a specific session item
     */
    async startSessionItem(index) {
        const session = NovaStorage.get('current-session');
        if (!session || index >= session.items.length) {
            this.completeSession();
            return;
        }

        const item = session.items[index];
        session.currentIndex = index;
        NovaStorage.set('current-session', session);

        // Load appropriate lesson
        const lessonFile = `L0${['main-idea', 'keywords', 'short-notes', 'bullets', 'symbols'].indexOf(item.conceptId) + 1}-${item.conceptId}-refined.json`;
        
        // Use refined lesson renderer
        await RefinedLessonRenderer.load(item.conceptId, item.type === 'review');
    },

    /**
     * Complete current session
     */
    completeSession() {
        const session = NovaStorage.get('current-session');
        if (!session) return;

        const duration = Math.floor((Date.now() - session.startTime) / 1000 / 60);
        
        NovaStorage.remove('current-session');
        
        NovaModal.show(
            'Session Complete! 🎉',
            `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🎯</div>
                    <p>You completed ${session.items.length} concept${session.items.length > 1 ? 's' : ''}</p>
                    <p style="color: var(--text-secondary);">Time: ${duration} minutes</p>
                </div>
            `,
            [
                {
                    text: 'Done!',
                    class: 'btn-primary',
                    onclick: 'NovaModal.close(); NovaRouter.navigate("home");'
                }
            ]
        );

        NovaAnalytics.track('session_complete', {
            concepts: session.items.length,
            duration
        });
    },

    /**
     * Get friendly concept name
     */
    getConceptName(conceptId) {
        const names = {
            'main-idea': 'Main Idea',
            'keywords': 'Keywords',
            'short-notes': 'Short Notes',
            'bullets': 'Bullet Lists',
            'symbols': 'Symbols'
        };
        return names[conceptId] || conceptId;
    },

    /**
     * Debug: View all concept schedules
     */
    viewSchedule() {
        const concepts = NovaStorage.get('nova-concepts') || {};
        console.table(
            Object.entries(concepts).map(([id, data]) => ({
                Concept: this.getConceptName(id),
                Level: data.performanceLevel,
                Attempts: data.attempts,
                'Next Review': data.nextReview ? new Date(data.nextReview).toLocaleString() : 'N/A'
            }))
        );
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaRepetition;
}
