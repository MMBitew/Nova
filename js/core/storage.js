/**
 * NOVA - LOCAL STORAGE WRAPPER
 * Simple localStorage abstraction with error handling
 */

const NovaStorage = {
    /**
     * Get item from localStorage
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Storage get error for key "${key}":`, error);
            return null;
        }
    },

    /**
     * Set item in localStorage
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage set error for key "${key}":`, error);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Storage remove error for key "${key}":`, error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    /**
     * Check if localStorage is available
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Get all keys
     */
    keys() {
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.error('Storage keys error:', error);
            return [];
        }
    },

    /**
     * Get storage size estimate (in KB)
     */
    getSize() {
        try {
            let size = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    size += localStorage[key].length + key.length;
                }
            }
            return (size / 1024).toFixed(2);
        } catch (error) {
            console.error('Storage size error:', error);
            return 0;
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaStorage;
}
