/**
 * NOVA - LESSON RENDERER
 * Dynamically renders lessons from JSON data
 */

const LessonRenderer = {
    currentStep: 0,
    lessonData: null,

    /**
     * Render a complete lesson
     */
    async render(lessonData) {
        this.lessonData = lessonData;
        this.currentStep = 0;
        this.renderStep(0);
    },

    /**
     * Render specific step
     */
    renderStep(stepIndex) {
        const step = this.lessonData.flow[stepIndex];
        if (!step) {
            this.completeLesson();
            return;
        }

        this.currentStep = stepIndex;
        const container = document.getElementById('main-content');
        container.innerHTML = '';

        // Render progress indicator
        if (this.lessonData.flow.length > 1) {
            container.innerHTML += this.renderProgress();
        }

        // Render step based on type
        container.innerHTML += this.renderStepByType(step);

        // Render navigation buttons
        container.innerHTML += this.renderButtons();

        // Play audio if available
        if (step.content.audio && NovaAudio.enabled) {
            setTimeout(() => NovaAudio.speak(step.content.audio), 500);
        }
    },

    /**
     * Render step by type
     */
    renderStepByType(step) {
        switch(step.type) {
            case 'intro-card':
            case 'step-card':
                return this.renderStepCard(step);
            case 'tap-keywords':
                return this.renderTapKeywords(step);
            default:
                return this.renderStepCard(step);
        }
    },

    /**
     * Render progress indicator
     */
    renderProgress() {
        const totalSteps = this.lessonData.flow.length;
        const currentStep = this.currentStep + 1;

        let dots = '';
        for (let i = 0; i < totalSteps; i++) {
            const dotClass = i < this.currentStep ? 'complete' : 
                            i === this.currentStep ? 'active' : '';
            dots += `<div class="progress-dot ${dotClass}"></div>`;
        }

        return `
            <div class="progress-indicator">
                <div class="progress-text">${this.lessonData.metadata.title}: Step ${currentStep} of ${totalSteps}</div>
                <div class="progress-dots">${dots}</div>
            </div>
        `;
    },

    /**
     * Render step card
     */
    renderStepCard(step) {
        const content = step.content;
        let html = `<div class="step-card"><div>`;
        
        if (content.icon) html += `<div class="step-icon">${content.icon}</div>`;
        if (content.title) html += `<div class="step-title">${content.title}</div>`;
        if (content.text) html += `<div class="step-text">${content.text}</div>`;

        if (content.sections) {
            content.sections.forEach(section => {
                html += this.renderSection(section);
            });
        }

        html += `</div></div>`;
        return html;
    },

    /**
     * Render section
     */
    renderSection(section) {
        switch(section.type) {
            case 'text':
                return `<div class="step-text">${section.content}</div>`;
            case 'example':
                return `<div class="step-example"><strong>${section.title || 'Example:'}</strong><br>${section.text}</div>`;
            case 'tip':
                return `<div class="notes-box"><div class="notes-title">${section.icon || '💡'} ${section.title}</div><div class="notes-content">${section.text}</div></div>`;
            case 'list':
                return `<ul style="margin: 20px; line-height: 1.8;">${section.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
            default:
                return '';
        }
    },

    /**
     * Render tap keywords activity
     */
    renderTapKeywords(step) {
        const content = step.content;
        let html = `<div class="step-card">`;
        
        html += `<div class="step-icon">${content.icon}</div>`;
        html += `<div class="step-title">${content.title}</div>`;
        html += `<p class="practice-prompt">${content.instruction}</p>`;
        
        html += `<div class="sentence-container" style="font-size: 20px; line-height: 2; margin: 20px 0;">`;
        content.words.forEach((word, index) => {
            html += `<span class="word-tap" data-word="${word}" onclick="LessonRenderer.toggleWord(this, ${JSON.stringify(content.correctWords).replace(/"/g, '&quot;')})" style="cursor: pointer; padding: 8px; margin: 4px; border: 2px solid #e5e5e5; border-radius: 8px; display: inline-block;">${word}</span>`;
        });
        html += `</div>`;
        
        if (content.hint) html += `<p style="color: #666; font-size: 14px; text-align: center;">${content.hint}</p>`;
        
        html += `</div>`;
        return html;
    },

    /**
     * Toggle word selection
     */
    toggleWord(element, correctWords) {
        const word = element.dataset.word;
        const isSelected = element.classList.contains('selected');
        
        if (isSelected) {
            element.classList.remove('selected');
            element.style.background = '';
            element.style.borderColor = '#e5e5e5';
        } else {
            element.classList.add('selected');
            if (correctWords.includes(word)) {
                element.style.background = '#f0fdf4';
                element.style.borderColor = '#58cc02';
            } else {
                element.style.background = '#fef2f2';
                element.style.borderColor = '#ef4444';
            }
        }
    },

    /**
     * Render navigation buttons
     */
    renderButtons() {
        const isLastStep = this.currentStep >= this.lessonData.flow.length - 1;
        const buttonText = isLastStep ? 'Complete Lesson →' : 'Next →';
        
        return `<div class="btn-container"><button class="btn btn-primary" onclick="LessonRenderer.nextStep()">${buttonText}</button></div>`;
    },

    /**
     * Go to next step
     */
    nextStep() {
        const nextIndex = this.currentStep + 1;
        
        if (nextIndex >= this.lessonData.flow.length) {
            this.completeLesson();
        } else {
            this.renderStep(nextIndex);
            window.scrollTo(0, 0);
        }
    },

    /**
     * Complete lesson
     */
    completeLesson() {
        NovaState.awardXP(this.lessonData.metadata.xpReward, 'note-master');
        NovaState.completeCard('note-master', this.lessonData.lessonId);
        NovaToast.success(`${this.lessonData.metadata.title} completed! +${this.lessonData.metadata.xpReward} XP`);
        
        setTimeout(() => {
            NovaRouter.navigate('note-master');
        }, 1500);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonRenderer;
}
