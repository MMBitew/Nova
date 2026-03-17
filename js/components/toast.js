/**
 * NOVA - TOAST NOTIFICATIONS
 * Non-blocking notifications
 */

const NovaToast = {
    /**
     * Show toast notification
     */
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Auto-remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, duration);
    },

    /**
     * Show success toast
     */
    success(message, duration) {
        this.show(message, 'success', duration);
    },

    /**
     * Show error toast
     */
    error(message, duration) {
        this.show(message, 'error', duration);
    },

    /**
     * Show warning toast
     */
    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    /**
     * Get icon for toast type
     */
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
};

// Add slideOutRight animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaToast;
}
