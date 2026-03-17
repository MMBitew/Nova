/**
 * NOVA - CONTENT LOADER
 * Loads JSON-based lesson content
 */

const ContentLoader = {
    cache: {},
    basePath: 'data/content',

    /**
     * Load skill metadata
     */
    async loadSkill(skillId) {
        const cacheKey = `skill-${skillId}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const data = await this.loadJSON(`${this.basePath}/${skillId}/skill.json`);
        this.cache[cacheKey] = data;
        return data;
    },

    /**
     * Load specific lesson
     */
    async loadLesson(skillId, lessonSlug) {
        const cacheKey = `${skillId}-${lessonSlug}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const data = await this.loadJSON(`${this.basePath}/${skillId}/lessons/${lessonSlug}.json`);
        this.cache[cacheKey] = data;
        return data;
    },

    /**
     * Load practice activity
     */
    async loadPractice(skillId, practiceId) {
        const cacheKey = `practice-${skillId}-${practiceId}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const data = await this.loadJSON(`${this.basePath}/${skillId}/practice/${practiceId}.json`);
        this.cache[cacheKey] = data;
        return data;
    },

    /**
     * Load review
     */
    async loadReview(skillId, reviewId) {
        const cacheKey = `review-${skillId}-${reviewId}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const data = await this.loadJSON(`${this.basePath}/${skillId}/reviews/${reviewId}.json`);
        this.cache[cacheKey] = data;
        return data;
    },

    /**
     * Load challenge
     */
    async loadChallenge(skillId, challengeId) {
        const cacheKey = `challenge-${skillId}-${challengeId}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }

        const data = await this.loadJSON(`${this.basePath}/${skillId}/challenges/${challengeId}.json`);
        this.cache[cacheKey] = data;
        return data;
    },

    /**
     * Load JSON file
     */
    async loadJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load: ${path}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Content load error:', error);
            NovaToast.error('Failed to load content');
            return null;
        }
    },

    /**
     * Preload commonly used content
     */
    async preload(skillId) {
        try {
            await this.loadSkill(skillId);
            await this.loadLesson(skillId, 'L01-why-notes-work');
            console.log(`Preloaded content for ${skillId}`);
        } catch (error) {
            console.error('Preload error:', error);
        }
    },

    /**
     * Clear cache
     */
    clearCache() {
        this.cache = {};
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentLoader;
}
