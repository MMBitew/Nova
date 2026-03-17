/**
 * NOVA - MODAL COMPONENT
 * Reusable modal dialogs
 */

const NovaModal = {
    /**
     * Show modal
     */
    show(title, content, options = {}) {
        const overlay = document.getElementById('modal-overlay');
        const container = document.getElementById('modal-container');

        // Build modal HTML
        const html = `
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="NovaModal.hide()">×</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
            ${options.buttons ? `
                <div class="modal-footer">
                    ${options.buttons.map(btn => `
                        <button class="btn ${btn.class || 'btn-secondary'}" 
                                onclick="${btn.onClick}">
                            ${btn.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;

        container.innerHTML = html;
        overlay.classList.remove('hidden');
        container.classList.remove('hidden');

        // Close on overlay click
        if (!options.disableOverlayClose) {
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    this.hide();
                }
            };
        }
    },

    /**
     * Hide modal
     */
    hide() {
        const overlay = document.getElementById('modal-overlay');
        const container = document.getElementById('modal-container');
        
        overlay.classList.add('hidden');
        container.classList.add('hidden');
        container.innerHTML = '';
    },

    /**
     * Confirm dialog
     */
    confirm(title, message, onConfirm) {
        this.show(title, `<p>${message}</p>`, {
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-secondary',
                    onClick: 'NovaModal.hide()'
                },
                {
                    label: 'Confirm',
                    class: 'btn-primary',
                    onClick: `NovaModal.hide(); (${onConfirm.toString()})()`
                }
            ]
        });
    },

    /**
     * Alert dialog
     */
    alert(title, message) {
        this.show(title, `<p>${message}</p>`, {
            buttons: [
                {
                    label: 'OK',
                    class: 'btn-primary',
                    onClick: 'NovaModal.hide()'
                }
            ]
        });
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaModal;
}
