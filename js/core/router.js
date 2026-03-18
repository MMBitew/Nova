/**
 * NOVA - SIMPLE ROUTER
 * Hash-based routing for single-page app
 */

const NovaRouter = {
    routes: {
    'home': () => NovaApp.showHome(),
    'note-master': () => NoteMaster.init(),
   'note-master-refined': () => {
    if (typeof NovaRepetition !== 'undefined') {
        // Check if there's an existing session
        const session = NovaStorage.get('current-session');
        if (!session) {
            NovaRepetition.startDailySession();
        } else {
            NovaRepetition.startSessionItem(0);
        }
    } else {
        console.error('NovaRepetition not loaded!');
        alert('Refined system not available. Please reload the page.');
    }
},
    'settings': () => NovaApp.showSettings()
},

    currentRoute: null,

    /**
     * Initialize router
     */
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    },

    /**
     * Handle current route
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.navigate(hash);
    },

    /**
     * Navigate to route
     */
    navigate(route) {
        if (this.routes[route]) {
            this.currentRoute = route;
            window.location.hash = route;
            this.routes[route]();
            this.updateUI(route);
        } else {
            console.warn(`Route not found: ${route}`);
            this.navigate('home');
        }
    },

    /**
     * Go back (show home)
     */
    goBack() {
        this.navigate('home');
    },

    /**
     * Update UI based on route
     */
    updateUI(route) {
        // Show/hide back button
        const backBtn = document.getElementById('backBtn');
        const homeBtn = document.getElementById('homeBtn');
        
        if (route === 'home') {
            backBtn?.classList.add('hidden');
            homeBtn?.classList.add('hidden');
        } else {
            backBtn?.classList.remove('hidden');
            homeBtn?.classList.remove('hidden');
        }
    },

    /**
     * Register new route
     */
    register(path, handler) {
        this.routes[path] = handler;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaRouter;
}
