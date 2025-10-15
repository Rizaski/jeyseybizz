// Global Firebase Configuration and Authentication
// This file provides Firebase authentication functionality across all pages

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
    authDomain: "otomono-c9938.firebaseapp.com",
    projectId: "otomono-c9938",
    storageBucket: "otomono-c9938.firebasestorage.app",
    messagingSenderId: "348906539551",
    appId: "1:348906539551:web:e249c40d0ae9e2964a632a",
    measurementId: "G-YVL497L1V3"
};

// Global Firebase instances
let app, auth, provider;

// Initialize Firebase
async function initializeFirebase() {
    try {
        // Check if Firebase is already initialized
        if (app && auth && provider) {
            console.log('Firebase already initialized');
            return true;
        }

        // Import Firebase modules dynamically
        const {
            initializeApp
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const {
            getAuth,
            GoogleAuthProvider
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

        // Initialize Firebase app
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        provider = new GoogleAuthProvider();

        // Configure Google provider
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        // Add Vercel-specific configuration
        if (window.location.hostname.includes('vercel.app')) {
            console.log('Vercel deployment detected, applying Vercel-specific configuration');
            // Ensure proper redirect handling for Vercel
            provider.addScope('email');
            provider.addScope('profile');
        }

        // Set authentication persistence
        const {
            setPersistence,
            browserLocalPersistence
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await setPersistence(auth, browserLocalPersistence);
        console.log('Authentication persistence set to local');

        console.log('Firebase initialized successfully');
        console.log('Auth instance:', auth);
        console.log('Provider instance:', provider);
        return true;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        console.error('Error details:', error.message);
        return false;
    }
}

// Check domain authorization
function checkDomainAuthorization() {
    const currentDomain = window.location.hostname;
    const currentOrigin = window.location.origin;

    // Comprehensive domain checking for deployed sites
    const authorizedPatterns = [
        'localhost',
        '127.0.0.1',
        'github.io',
        'netlify.app',
        'vercel.app',
        'otomono.vercel.app',
        'firebaseapp.com'
    ];

    // Check if current domain matches any authorized pattern
    const isAuthorized = authorizedPatterns.some(pattern => {
        if (pattern.includes('.')) {
            return currentDomain.endsWith('.' + pattern) || currentDomain === pattern;
        }
        return currentDomain.includes(pattern);
    });

    // For deployed sites, be more lenient
    const isDeployed = currentDomain.includes('.') &&
        currentDomain !== 'localhost' &&
        currentDomain !== '127.0.0.1';

    if (isDeployed && !isAuthorized) {
        console.warn('Domain not in authorized list, but allowing for deployed site:', currentDomain);
        return true; // Allow deployed sites
    }

    console.log('Domain authorization check:', {
        domain: currentDomain,
        origin: currentOrigin,
        authorized: isAuthorized,
        isDeployed: isDeployed
    });

    return isAuthorized;
}

// Global authentication functions
window.FirebaseAuth = {
    // Initialize Firebase authentication
    async init() {
        if (!app || !auth || !provider) {
            const success = await initializeFirebase();
            if (!success) {
                throw new Error('Failed to initialize Firebase');
            }
        }
        return {
            app,
            auth,
            provider
        };
    },

    // Sign in with Google - Enhanced for deployed sites
    async signInWithGoogle() {
        try {
            console.log('Starting Google sign-in process...');

            // Initialize Firebase first
            const initSuccess = await this.init();
            if (!initSuccess) {
                throw new Error('Failed to initialize Firebase');
            }

            console.log('Firebase initialized, checking domain authorization...');

            // More flexible domain checking for deployed sites
            const currentDomain = window.location.hostname;
            const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
            const isDeployed = currentDomain.includes('.') && !isLocalhost;

            console.log('Current domain:', currentDomain, 'Is deployed:', isDeployed);

            // For deployed sites, be more lenient with domain checking
            if (isDeployed && !checkDomainAuthorization()) {
                console.warn('Domain not in authorized list, but proceeding for deployed site');
                // Special handling for Vercel domains
                if (currentDomain.includes('vercel.app')) {
                    console.log('Vercel domain detected, using flexible authentication');
                }
                // Continue anyway for deployed sites
            } else if (!isDeployed && !checkDomainAuthorization()) {
                throw new Error('Domain not authorized for local development');
            }

            console.log('Domain check passed, starting authentication...');

            // Show sign-up popup first, then redirect to sign-in
            this.showSignUpPopup();

        } catch (error) {
            console.error('Google sign-in error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // Handle specific Firebase errors
            if (error.code === 'auth/unauthorized-domain') {
                console.error('Domain authorization error:', error);
                // Special handling for Vercel domains
                if (window.location.hostname.includes('vercel.app')) {
                    console.log('Vercel domain authorization error - domain needs to be added to Firebase console');
                    this.showVercelDomainErrorModal();
                } else {
                    this.showDomainErrorModal();
                }
            } else if (error.code === 'auth/internal-error') {
                console.error('Firebase internal error:', error);
                this.showGenericErrorModal('Authentication service temporarily unavailable. Please try again later.');
            } else if (error.code === 'auth/network-request-failed') {
                console.error('Network error detected:', error);
                this.showNetworkErrorModal();
            } else if (error.code === 'auth/too-many-requests') {
                this.showGenericErrorModal('Too many failed attempts. Please try again later.');
            } else if (error.code === 'auth/popup-blocked') {
                console.log('Popup blocked, showing instructions');
                this.showPopupBlockerInstructions();
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log('Popup cancelled by user');
                // Don't show error for user cancellation
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.log('Popup closed by user');
                // Don't show error for user cancellation
            } else {
                console.error('Firebase auth error:', error);
                this.showGenericErrorModal(error.message || 'Authentication failed. Please try again.');
            }
            throw error;
        }
    },

    // Sign out
    async signOut() {
        try {
            await this.init();
            const {
                signOut
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await signOut(auth);

            // Clear user data from localStorage
            localStorage.removeItem('user');

            // Update UI
            this.updateAuthUI(null);

            console.log('User signed out');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    // Get current user
    getCurrentUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },

    // Update authentication UI
    updateAuthUI(user) {
        const userData = user || this.getCurrentUser();

        // Update login buttons (desktop header)
        const loginButtons = document.querySelectorAll('#login-btn');
        loginButtons.forEach(button => {
            if (userData) {
                // User is signed in - show user profile with dropdown
                button.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <img src="${userData.photoURL || 'https://via.placeholder.com/32/ff0040/ffffff?text=' + (userData.displayName || userData.email).charAt(0).toUpperCase()}" 
                             alt="Profile" class="w-6 h-6 rounded-full border border-rog-red/30">
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-rog-dark text-rog-red text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-rog-red">
                        ${userData.displayName || userData.email}
                    </div>
                `;
                button.onclick = () => {
                    // Show dropdown menu
                    this.toggleAccountDropdown(button);
                };
            } else {
                // User is not signed in
                button.innerHTML = `
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-rog-dark text-rog-red text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-rog-red">
                        Login
                    </div>
                `;
                button.onclick = () => window.location.href = 'login.html';
            }
        });

        // Update mobile login buttons
        const mobileLoginButtons = document.querySelectorAll('#mobile-login-btn');
        mobileLoginButtons.forEach(button => {
            if (userData) {
                button.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <img src="${userData.photoURL || 'https://via.placeholder.com/32/ff0040/ffffff?text=' + (userData.displayName || userData.email).charAt(0).toUpperCase()}" 
                             alt="Profile" class="w-5 h-5 rounded-full border border-rog-red/30">
                        <span class="text-white font-rog-heading font-medium">${userData.displayName || 'Account'}</span>
                    </div>
                `;
                button.onclick = () => {
                    // Show mobile dropdown menu
                    this.toggleMobileAccountDropdown(button);
                };
            } else {
                button.innerHTML = `
                    <svg class="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-white font-rog-heading font-medium">Login</span>
                `;
                button.onclick = () => window.location.href = 'login.html';
            }
        });
    },

    // Toggle account dropdown
    toggleAccountDropdown(button) {
        // Remove existing dropdown
        const existingDropdown = document.getElementById('account-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.id = 'account-dropdown';
        dropdown.className = 'absolute top-full right-0 mt-2 w-56 bg-rog-dark rounded-lg shadow-lg border border-rog-red/30 z-50';
        dropdown.innerHTML = `
            <div class="py-2">
                <div class="px-4 py-3 text-sm text-gray-300 border-b border-rog-red/30">
                    <div class="flex items-center space-x-3">
                        <img src="${this.getCurrentUser()?.photoURL || 'https://via.placeholder.com/40/ff0040/ffffff?text=' + (this.getCurrentUser()?.displayName || this.getCurrentUser()?.email).charAt(0).toUpperCase()}" 
                             alt="Profile" class="w-8 h-8 rounded-full border border-rog-red/30">
                        <div>
                            <div class="font-rog-heading font-semibold text-white">${this.getCurrentUser()?.displayName || 'User'}</div>
                            <div class="text-gray-400 font-rog-body text-xs">${this.getCurrentUser()?.email || ''}</div>
                        </div>
                    </div>
                </div>
                <a href="customer.html" class="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-rog-red/20 transition-colors font-rog-body">
                    <svg class="w-4 h-4 mr-3 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Dashboard
                </a>
                <a href="designer-studio.html" class="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-rog-red/20 transition-colors font-rog-body">
                    <svg class="w-4 h-4 mr-3 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Jersey Designer Studio
                </a>
                <div class="border-t border-rog-red/30 my-2"></div>
                <button id="sign-out-btn" class="flex items-center w-full px-4 py-3 text-sm text-rog-red hover:bg-rog-red/20 transition-colors font-rog-body">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        `;

        // Position dropdown relative to button
        const buttonRect = button.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.right = '0';
        dropdown.style.marginTop = '0.5rem';

        // Add to button's parent (which should be relative positioned)
        button.parentElement.style.position = 'relative';
        button.parentElement.appendChild(dropdown);

        // Add event listener for sign-out button
        const signOutBtn = dropdown.querySelector('#sign-out-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', async () => {
                try {
                    await this.signOut();
                    dropdown.remove();
                } catch (error) {
                    console.error('Sign out error:', error);
                }
            });
        }

        // Close dropdown when clicking outside
        const closeDropdown = (event) => {
            if (!dropdown.contains(event.target) && !button.contains(event.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };

        // Add click outside listener after a short delay
        setTimeout(() => {
            document.addEventListener('click', closeDropdown);
        }, 100);
    },

    // Toggle mobile account dropdown
    toggleMobileAccountDropdown(button) {
        // Remove existing dropdown
        const existingDropdown = document.getElementById('mobile-account-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }

        // Create mobile dropdown menu
        const dropdown = document.createElement('div');
        dropdown.id = 'mobile-account-dropdown';
        dropdown.className = 'mt-4 bg-rog-light/20 backdrop-blur-sm rounded-lg border border-rog-red/30';
        dropdown.innerHTML = `
            <div class="p-4">
                <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-rog-red/30">
                    <img src="${this.getCurrentUser()?.photoURL || 'https://via.placeholder.com/40/ff0040/ffffff?text=' + (this.getCurrentUser()?.displayName || this.getCurrentUser()?.email).charAt(0).toUpperCase()}" 
                         alt="Profile" class="w-10 h-10 rounded-full border border-rog-red/30">
                    <div>
                        <div class="font-rog-heading font-semibold text-white">${this.getCurrentUser()?.displayName || 'User'}</div>
                        <div class="text-gray-400 font-rog-body text-sm">${this.getCurrentUser()?.email || ''}</div>
                    </div>
                </div>
                <div class="space-y-2">
                    <a href="customer.html" class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-rog-red/20 transition-colors font-rog-body rounded-lg">
                        <svg class="w-4 h-4 mr-3 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Customer Dashboard
                    </a>
                    <a href="designer-studio.html" class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-rog-red/20 transition-colors font-rog-body rounded-lg">
                        <svg class="w-4 h-4 mr-3 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Jersey Designer Studio
                    </a>
                    <div class="border-t border-rog-red/30 my-2"></div>
                    <button id="mobile-sign-out-btn" class="flex items-center w-full px-3 py-2 text-sm text-rog-red hover:bg-rog-red/20 transition-colors font-rog-body rounded-lg">
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        `;

        // Add to button's parent
        button.parentElement.appendChild(dropdown);

        // Add event listener for sign-out button
        const signOutBtn = dropdown.querySelector('#mobile-sign-out-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', async () => {
                try {
                    await this.signOut();
                    dropdown.remove();
                } catch (error) {
                    console.error('Sign out error:', error);
                }
            });
        }
    },

    // Show popup blocker instructions
    showPopupBlockerInstructions() {
        // Remove existing modal if any
        const existingModal = document.getElementById('popup-blocker-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'popup-blocker-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-rog-dark rounded-lg shadow-xl max-w-md w-full p-6 border border-rog-red/30">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-rog-red/20 rounded-full flex items-center justify-center mr-4 border border-rog-red">
                        <svg class="w-6 h-6 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-rog-display font-bold text-white glow">Popup Blocked</h3>
                        <p class="text-sm text-gray-300 font-rog-body">Your browser blocked the Gmail login popup</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-rog-heading font-semibold text-rog-red mb-3">To allow Gmail login, please:</h4>
                    <div class="space-y-3 text-sm text-gray-300 font-rog-body">
                        <div class="flex items-start">
                            <span class="font-rog-heading font-bold text-rog-red mr-2">1.</span>
                            <div>
                                <strong class="text-white">Chrome/Edge:</strong> Click the popup blocker icon in the address bar, then select "Always allow popups from this site"
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="font-rog-heading font-bold text-rog-red mr-2">2.</span>
                            <div>
                                <strong class="text-white">Firefox:</strong> Go to Settings → Privacy & Security → Permissions → Block pop-up windows → Add this site to exceptions
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="font-rog-heading font-bold text-rog-red mr-2">3.</span>
                            <div>
                                <strong class="text-white">Safari:</strong> Go to Safari → Preferences → Websites → Pop-up Windows → Allow for this site
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-rog-red/10 border border-rog-red/30 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-rog-red mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-sm text-rog-red font-rog-heading font-medium">Quick Fix:</p>
                            <p class="text-sm text-gray-300 font-rog-body">Look for a popup blocker icon in your browser's address bar and click "Allow" or "Always allow"</p>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button id="retry-login" class="flex-1 rog-button px-4 py-2 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                        Try Again
                    </button>
                    <button id="close-popup-modal" class="px-4 py-2 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                        Close
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('retry-login').addEventListener('click', () => {
            modal.remove();
            // Retry login after a short delay
            setTimeout(() => {
                this.signInWithGoogle();
            }, 500);
        });

        document.getElementById('close-popup-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Detect popup blocker before attempting login
    async detectPopupBlocker() {
        return new Promise((resolve) => {
            const popup = window.open('', '_blank', 'width=1,height=1,left=-1000,top=-1000');

            if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                // Popup was blocked
                resolve(true);
            } else {
                // Popup opened successfully
                popup.close();
                resolve(false);
            }
        });
    },

    // Test network connectivity
    async testNetworkConnection() {
        try {
            console.log('Testing network connectivity...');

            // Test basic connectivity
            const response = await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });

            console.log('Network test successful');
            return true;
        } catch (error) {
            console.error('Network test failed:', error);
            return false;
        }
    },

    // Enhanced sign in with popup blocker detection
    async signInWithGoogleEnhanced() {
        try {
            console.log('Checking for popup blocker...');

            // Check if popup blocker is active
            const isBlocked = await this.detectPopupBlocker();
            if (isBlocked) {
                console.log('Popup blocker detected');
                this.showPopupBlockerInstructions();
                return;
            }

            // Test network connectivity before attempting login
            console.log('Testing network connectivity...');
            const networkOk = await this.testNetworkConnection();
            if (!networkOk) {
                console.log('Network connectivity issues detected');
                this.showNetworkErrorModal();
                return;
            }

            console.log('No popup blocker detected, network OK, proceeding with login...');
            return await this.signInWithGoogle();
        } catch (error) {
            console.error('Enhanced sign-in error:', error);
            throw error;
        }
    },

    // Show popup blocker warning banner
    showPopupBlockerWarning() {
        // Remove existing warning if any
        const existingWarning = document.getElementById('popup-blocker-warning');
        if (existingWarning) {
            existingWarning.remove();
        }

        // Create warning banner
        const warning = document.createElement('div');
        warning.id = 'popup-blocker-warning';
        warning.className = 'fixed top-0 left-0 right-0 bg-rog-red text-white px-4 py-3 z-50 shadow-lg border-b border-rog-red/30';
        warning.innerHTML = `
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span class="font-rog-heading font-medium">Popup blocker detected! Gmail login may not work. </span>
                    <button id="fix-popup-blocker" class="ml-2 underline hover:no-underline font-rog-heading font-semibold text-yellow-300 hover:text-white transition-colors">
                        Click here to fix
                    </button>
                </div>
                <button id="dismiss-warning" class="ml-4 text-white hover:text-yellow-300 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(warning);

        // Add event listeners
        document.getElementById('fix-popup-blocker').addEventListener('click', () => {
            warning.remove();
            this.showPopupBlockerInstructions();
        });

        document.getElementById('dismiss-warning').addEventListener('click', () => {
            warning.remove();
        });

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (document.getElementById('popup-blocker-warning')) {
                warning.remove();
            }
        }, 10000);
    },

    // Listen for authentication state changes
    async onAuthStateChanged(callback) {
        try {
            await this.init();
            const {
                onAuthStateChanged
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            onAuthStateChanged(auth, (user) => {
                console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');

                if (user) {
                    // Store user data with timestamp for session management
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        lastSignIn: new Date().toISOString(),
                        isAuthenticated: true
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('User data stored:', userData);
                } else {
                    // Clear user data
                    localStorage.removeItem('user');
                    console.log('User data cleared');
                }

                // Update UI immediately
                this.updateAuthUI(user);
                callback(user);
            });
        } catch (error) {
            console.error('Auth state listener error:', error);
        }
    },

    // Check if user session is still valid
    isSessionValid() {
        const userData = this.getCurrentUser();
        if (!userData) return false;

        // Check if session is older than 30 days (optional security measure)
        const lastSignIn = new Date(userData.lastSignIn);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (lastSignIn < thirtyDaysAgo) {
            console.log('Session expired (older than 30 days)');
            localStorage.removeItem('user');
            return false;
        }

        return true;
    },

    // Handle redirect result after Google sign-in
    async handleRedirectResult() {
        try {
            await this.init();
            const {
                getRedirectResult
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            const result = await getRedirectResult(auth);
            if (result) {
                const user = result.user;
                console.log('User signed in via redirect:', user.email);

                // Store user data
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    lastSignIn: new Date().toISOString(),
                    isAuthenticated: true
                };
                localStorage.setItem('user', JSON.stringify(userData));

                // Create or update user profile in Firestore
                if (window.FirebaseDB) {
                    try {
                        const existingProfile = await window.FirebaseDB.getUserProfile(user.uid);
                        if (!existingProfile) {
                            await window.FirebaseDB.createUserProfile(user);
                            console.log('New user profile created in Firestore');
                        } else {
                            await window.FirebaseDB.updateUserProfile(user.uid, {
                                lastLogin: new Date().toISOString()
                            });
                            console.log('User profile updated in Firestore');
                        }

                        // Track user login
                        await window.FirebaseDB.trackUserAction(user.uid, 'user_login', {
                            method: 'google_redirect'
                        });
                    } catch (dbError) {
                        console.error('Error managing user profile:', dbError);
                        // Continue with authentication even if database fails
                    }
                }

                // Update UI
                this.updateAuthUI(user);

                // Redirect to customer page
                console.log('Redirecting to customer page after successful login');
                window.location.replace('customer.html');
                return user;
            }
            return null;
        } catch (error) {
            console.error('Failed to handle redirect result:', error);
            return null;
        }
    },

    // Restore authentication state on page load
    async restoreAuthState() {
        try {
            await this.init();

            // First check for redirect result
            const redirectUser = await this.handleRedirectResult();
            if (redirectUser) {
                return redirectUser;
            }

            // Check if we have a valid session
            if (!this.isSessionValid()) {
                console.log('No valid session found');
                this.updateAuthUI(null);
                return null;
            }

            // Get current user from Firebase
            const {
                onAuthStateChanged
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe(); // Unsubscribe after first call
                    if (user) {
                        console.log('User session restored:', user.email);
                        this.updateAuthUI(user);
                        resolve(user);
                    } else {
                        console.log('No active Firebase session');
                        localStorage.removeItem('user');
                        this.updateAuthUI(null);
                        resolve(null);
                    }
                });
            });
        } catch (error) {
            console.error('Failed to restore auth state:', error);
            this.updateAuthUI(null);
            return null;
        }
    },

    // Show network error modal
    showNetworkErrorModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('network-error-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'network-error-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-rog-dark rounded-lg shadow-xl max-w-md w-full p-6 border border-rog-red/30">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-rog-red/20 rounded-full flex items-center justify-center mr-4 border border-rog-red">
                        <svg class="w-6 h-6 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-rog-display font-bold text-white glow">Network Error</h3>
                        <p class="text-sm text-gray-300 font-rog-body">Unable to connect to authentication service</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-rog-heading font-semibold text-rog-red mb-3">Please try these solutions:</h4>
                    <div class="space-y-3 text-sm text-gray-300 font-rog-body">
                        <div class="flex items-start">
                            <span class="font-rog-heading font-bold text-rog-red mr-2">1.</span>
                            <div>
                                <strong class="text-white">Check your internet connection</strong> - Ensure you have a stable internet connection
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="font-rog-heading font-bold text-rog-red mr-2">2.</span>
                            <div>
                                <strong class="text-white">Try refreshing the page</strong> - Sometimes a simple refresh resolves connectivity issues
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="font-rog-heading font-bold text-rog-red mr-2">3.</span>
                            <div>
                                <strong class="text-white">Check firewall settings</strong> - Ensure your firewall isn't blocking the authentication service
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="font-rog-heading font-bold text-rog-red mr-2">4.</span>
                            <div>
                                <strong class="text-white">Try a different network</strong> - Switch to mobile data or a different WiFi network
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-rog-red/10 border border-rog-red/30 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-rog-red mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-sm text-rog-red font-rog-heading font-medium">Still having issues?</p>
                            <p class="text-sm text-gray-300 font-rog-body">Contact our support team for assistance with authentication problems.</p>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button id="retry-network-login" class="flex-1 rog-button px-4 py-2 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                        Try Again
                    </button>
                    <button id="close-network-modal" class="px-4 py-2 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                        Close
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('retry-network-login').addEventListener('click', () => {
            modal.remove();
            // Retry login after a short delay
            setTimeout(() => {
                this.signInWithGoogle();
            }, 1000);
        });

        document.getElementById('close-network-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Show sign-up popup first, then redirect to sign-in
    showSignUpPopup() {
        // Remove existing modal if any
        const existingModal = document.getElementById('signup-popup-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.id = 'signup-popup-modal';

        modal.innerHTML = `
            <div class="bg-rog-dark rounded-2xl shadow-2xl w-full max-w-md p-6 border border-rog-red/30">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-rog-red/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rog-red">
                        <svg class="w-8 h-8 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-rog-display font-bold text-white glow mb-2">Welcome to Otomono</h3>
                    <p class="text-gray-300 font-rog-body">Create your account to access premium jersey designs</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-rog-light/20 backdrop-blur-sm rounded-lg p-4 border border-rog-red/30">
                        <h4 class="font-rog-heading font-semibold text-rog-red mb-2">Get Started</h4>
                        <p class="text-sm text-gray-300 font-rog-body">
                            Sign up with your Google account to access our designer studio and track your orders.
                        </p>
                    </div>
                    
                    <div class="space-y-3">
                        <h4 class="font-rog-heading font-semibold text-white">What you'll get:</h4>
                        <ul class="text-sm text-gray-300 space-y-2 font-rog-body">
                            <li class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>3D Jersey Designer Studio</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Order History & Tracking</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Save & Share Designs</span>
                            </li>
                            <li class="flex items-center space-x-2">
                                <svg class="w-4 h-4 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Priority Customer Support</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button id="signup-with-google" class="flex-1 rog-button px-4 py-3 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Sign Up with Google</span>
                        </button>
                        <button id="close-signup-popup" class="px-4 py-3 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('signup-with-google').addEventListener('click', () => {
            modal.remove();
            this.proceedWithGoogleSignIn();
        });

        document.getElementById('close-signup-popup').addEventListener('click', () => {
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Proceed with Google sign-in after sign-up popup
    async proceedWithGoogleSignIn() {
        // Always use new window approach for better user experience
        console.log('Opening Gmail authentication in new window...');
        this.openGmailAuthWindow();
    },

    // Open Gmail authentication in new window
    openGmailAuthWindow() {
        // Create a new window for Gmail authentication
        const authWindow = window.open(
            'about:blank',
            'gmailAuth',
            'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
        );

        if (!authWindow) {
            console.error('Failed to open authentication window - popup blocked');
            this.showPopupBlockerModal();
            return;
        }

        // Show loading message in new window
        authWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Gmail Authentication - Otomono</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Inter', sans-serif;
                        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        text-align: center;
                    }
                    .container {
                        max-width: 400px;
                        padding: 2rem;
                    }
                    .logo {
                        width: 60px;
                        height: 60px;
                        background: linear-gradient(135deg, #ff0040, #dc143c);
                        border-radius: 50%;
                        margin: 0 auto 1.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    h1 {
                        font-size: 1.5rem;
                        margin-bottom: 0.5rem;
                        color: #ff0040;
                    }
                    p {
                        color: #ccc;
                        margin-bottom: 2rem;
                    }
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid #333;
                        border-top: 3px solid #ff0040;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .error {
                        color: #ff4444;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">O</div>
                    <h1>Gmail Authentication</h1>
                    <p>Please wait while we redirect you to Google for secure authentication...</p>
                    <div class="spinner"></div>
                    <div id="error" class="error" style="display: none;">
                        Authentication failed. Please close this window and try again.
                    </div>
                </div>
            </body>
            </html>
        `);

        // Start the authentication process
        this.performGmailAuth(authWindow);

        // Listen for authentication result
        this.setupAuthWindowListener(authWindow);
    },

    // Setup listener for authentication window
    setupAuthWindowListener(authWindow) {
        // Check if authentication window is closed
        const checkClosed = setInterval(() => {
            if (authWindow.closed) {
                clearInterval(checkClosed);
                console.log('Authentication window closed');
                // Check if user is authenticated
                this.checkAuthResult();
            }
        }, 1000);

        // Listen for messages from the authentication window
        window.addEventListener('message', (event) => {
            if (event.data.type === 'AUTH_SUCCESS') {
                console.log('Authentication successful from new window');
                authWindow.close();
                this.handleSuccessfulAuth(event.data.user, 'google_new_window');
            } else if (event.data.type === 'AUTH_ERROR') {
                console.error('Authentication error from new window:', event.data.error);
                authWindow.close();
                this.showGenericErrorModal('Authentication failed. Please try again.');
            }
        });
    },

    // Check authentication result
    async checkAuthResult() {
        try {
            const user = auth.currentUser;
            if (user) {
                console.log('User authenticated successfully:', user.email);
                await this.handleSuccessfulAuth(user, 'google_new_window');
            }
        } catch (error) {
            console.error('Error checking authentication result:', error);
        }
    },

    // Perform Gmail authentication in the new window
    async performGmailAuth(authWindow) {
        try {
            // Check if domain is authorized
            if (!this.isDomainAuthorized()) {
                console.error('Domain not authorized for Firebase authentication');
                authWindow.document.getElementById('error').style.display = 'block';
                authWindow.document.querySelector('.spinner').style.display = 'none';
                return;
            }

            // Initialize Firebase in the new window
            const {
                initializeApp,
                getAuth,
                GoogleAuthProvider,
                signInWithRedirect,
                getRedirectResult
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            // Initialize Firebase in the new window
            const authApp = initializeApp(firebaseConfig);
            const authInstance = getAuth(authApp);
            const googleProvider = new GoogleAuthProvider();

            // Check if we're returning from a redirect
            const result = await getRedirectResult(authInstance);
            if (result) {
                console.log('Authentication successful in new window:', result.user.email);
                // Send success message to parent window
                window.opener.postMessage({
                    type: 'AUTH_SUCCESS',
                    user: result.user
                }, '*');
                return;
            }

            // Start redirect authentication
            console.log('Starting Gmail authentication in new window...');
            await signInWithRedirect(authInstance, googleProvider);
            
        } catch (error) {
            console.error('Gmail authentication error:', error);
            authWindow.document.getElementById('error').style.display = 'block';
            authWindow.document.querySelector('.spinner').style.display = 'none';
            
            // Send error message to parent window
            window.opener.postMessage({
                type: 'AUTH_ERROR',
                error: error.message
            }, '*');
        }
    },

    // Attempt popup sign-in with popup blocker detection
    async attemptPopupSignIn() {
        const {
            signInWithPopup
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        console.log('Attempting popup sign-in...');
        
        // Test for popup blocker before attempting authentication
        const popupTest = window.open('', '_blank', 'width=1,height=1');
        if (!popupTest || popupTest.closed || typeof popupTest.closed === 'undefined') {
            popupTest?.close();
            throw new Error('Popup blocked by browser');
        }
        popupTest.close();

        const result = await signInWithPopup(auth, provider);
        console.log('Popup sign-in successful:', result.user.email);

        // Handle successful authentication
        await this.handleSuccessfulAuth(result.user, 'google_popup');
        return result;
    },

    // Handle redirect sign-in
    async signInWithRedirect() {
        try {
            const {
                signInWithRedirect,
                getRedirectResult
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            // Check if we're returning from a redirect
            const result = await getRedirectResult(auth);
            if (result) {
                console.log('Redirect sign-in successful:', result.user.email);
                await this.handleSuccessfulAuth(result.user, 'google_redirect');
                return;
            }

            // Start redirect sign-in
            console.log('Starting redirect sign-in...');
            await signInWithRedirect(auth, provider);
            return; // Don't continue as redirect will navigate away
            
        } catch (error) {
            console.error('Redirect sign-in error:', error);
            this.showGenericErrorModal('Authentication failed. Please try again.');
        }
    },

    // Handle successful authentication (common for both popup and redirect)
    async handleSuccessfulAuth(user, method) {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastSignIn: new Date().toISOString(),
            isAuthenticated: true
        };
        localStorage.setItem('user', JSON.stringify(userData));

        // Create or update user profile in Firestore
        if (window.FirebaseDB) {
            try {
                const existingProfile = await window.FirebaseDB.getUserProfile(user.uid);
                if (!existingProfile) {
                    await window.FirebaseDB.createUserProfile(user);
                    console.log('New user profile created in Firestore');
                } else {
                    await window.FirebaseDB.updateUserProfile(user.uid, {
                        lastLogin: new Date().toISOString()
                    });
                    console.log('User profile updated in Firestore');
                }

                // Track user login
                await window.FirebaseDB.trackUserAction(user.uid, 'user_login', {
                    method: method
                });
            } catch (dbError) {
                console.error('Error managing user profile:', dbError);
                // Continue with authentication even if database fails
            }
        }

        this.updateAuthUI(user);

        // Redirect to customer page
        console.log('Redirecting to customer page after successful login');
        window.location.replace('customer.html');
    },

    // Show redirect modal for deployed sites
    showRedirectModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.id = 'redirect-modal';

        modal.innerHTML = `
            <div class="bg-rog-dark rounded-2xl shadow-2xl w-full max-w-md p-6 border border-rog-red/30">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-rog-red/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rog-red">
                        <svg class="w-8 h-8 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-rog-display font-bold text-white glow mb-2">Redirecting to Google</h3>
                    <p class="text-gray-300 font-rog-body">You'll be redirected to Google for secure authentication</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-rog-light/20 backdrop-blur-sm rounded-lg p-4 border border-rog-red/30">
                        <h4 class="font-rog-heading font-semibold text-rog-red mb-2">Secure Authentication</h4>
                        <p class="text-sm text-gray-300 font-rog-body">
                            For security reasons, we use Google's secure authentication system. 
                            You'll be redirected to Google and then back to our site.
                        </p>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button id="proceed-redirect" class="flex-1 rog-button px-4 py-3 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                            Continue to Google
                        </button>
                        <button id="cancel-redirect" class="px-4 py-3 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('proceed-redirect').addEventListener('click', async () => {
            modal.remove();
            await this.signInWithRedirect();
        });

        document.getElementById('cancel-redirect').addEventListener('click', () => {
            modal.remove();
        });
    },

    // Show popup blocker modal
    showPopupBlockerModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.id = 'popup-blocker-modal';

        modal.innerHTML = `
            <div class="bg-rog-dark rounded-2xl shadow-2xl w-full max-w-md p-6 border border-rog-red/30">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-rog-red/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rog-red">
                        <svg class="w-8 h-8 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-rog-display font-bold text-white glow mb-2">Popup Blocked</h3>
                    <p class="text-gray-300 font-rog-body">Your browser blocked the authentication popup</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-rog-light/20 backdrop-blur-sm rounded-lg p-4 border border-rog-red/30">
                        <h4 class="font-rog-heading font-semibold text-rog-red mb-2">How to Fix:</h4>
                        <ol class="text-sm text-gray-300 space-y-2 font-rog-body">
                            <li>1. Allow popups for this site in your browser</li>
                            <li>2. Or use the redirect method below</li>
                            <li>3. Disable popup blocker temporarily</li>
                        </ol>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button id="try-redirect" class="flex-1 rog-button px-4 py-3 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                            Use Redirect Method
                        </button>
                        <button id="cancel-popup-modal" class="px-4 py-3 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('try-redirect').addEventListener('click', async () => {
            modal.remove();
            await this.signInWithRedirect();
        });

        document.getElementById('cancel-popup-modal').addEventListener('click', () => {
            modal.remove();
        });
    },

    // Check if current domain is authorized for Firebase
    isDomainAuthorized() {
        const currentDomain = window.location.hostname;
        const authorizedDomains = [
            'localhost',
            '127.0.0.1',
            'otomono.vercel.app',
            'otomono-c9938.firebaseapp.com'
        ];
        
        return authorizedDomains.some(domain => 
            currentDomain === domain || currentDomain.endsWith('.' + domain)
        );
    },

    // Show domain not authorized modal
    showDomainNotAuthorizedModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.id = 'domain-not-authorized-modal';

        modal.innerHTML = `
            <div class="bg-rog-dark rounded-2xl shadow-2xl w-full max-w-md p-6 border border-rog-red/30">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-rog-red/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rog-red">
                        <svg class="w-8 h-8 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-rog-display font-bold text-white glow mb-2">Domain Not Authorized</h3>
                    <p class="text-gray-300 font-rog-body">This domain needs to be added to Firebase authorized domains</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-rog-light/20 backdrop-blur-sm rounded-lg p-4 border border-rog-red/30">
                        <h4 class="font-rog-heading font-semibold text-rog-red mb-2">Current Domain</h4>
                        <p class="text-sm text-gray-300 font-rog-body">
                            <strong class="text-white">${window.location.hostname}</strong>
                        </p>
                    </div>
                    
                    <div class="space-y-3">
                        <h4 class="font-rog-heading font-semibold text-white">Steps to Fix:</h4>
                        <ol class="text-sm text-gray-300 space-y-2 font-rog-body">
                            <li>1. Go to <a href="https://console.firebase.google.com" target="_blank" class="text-rog-red hover:underline">Firebase Console</a></li>
                            <li>2. Select project: <strong class="text-white">otomono-c9938</strong></li>
                            <li>3. Go to Authentication → Settings → Authorized domains</li>
                            <li>4. Add: <strong class="text-white">${window.location.hostname}</strong></li>
                            <li>5. Save and refresh this page</li>
                        </ol>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button id="retry-domain-check" class="flex-1 rog-button px-4 py-3 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                            Check Again
                        </button>
                        <button id="close-domain-modal" class="px-4 py-3 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('retry-domain-check').addEventListener('click', () => {
            modal.remove();
            this.proceedWithGoogleSignIn();
        });

        document.getElementById('close-domain-modal').addEventListener('click', () => {
            modal.remove();
        });
    },

    // Check for redirect result on page load
    async checkRedirectResult() {
        try {
            const {
                getRedirectResult
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            const result = await getRedirectResult(auth);
            if (result) {
                console.log('Redirect authentication successful:', result.user.email);
                await this.handleSuccessfulAuth(result.user, 'google_redirect');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking redirect result:', error);
            return false;
        }
    },

    // Show Vercel-specific domain error modal
    showVercelDomainErrorModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('vercel-domain-error-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.id = 'vercel-domain-error-modal';

        modal.innerHTML = `
            <div class="bg-rog-dark rounded-2xl shadow-2xl w-full max-w-md p-6 border border-rog-red/30">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-rog-display font-bold text-white glow">Vercel Domain Setup Required</h3>
                    <button id="close-vercel-modal" class="text-gray-400 hover:text-rog-red transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    <div class="bg-rog-light/20 backdrop-blur-sm rounded-lg p-4 border border-rog-red/30">
                        <h4 class="font-rog-heading font-semibold text-rog-red mb-2">Domain Authorization Required</h4>
                        <p class="text-sm text-gray-300 font-rog-body">
                            The Vercel domain <strong class="text-white">${window.location.hostname}</strong> needs to be added to Firebase authorized domains.
                        </p>
                    </div>
                    <div class="space-y-3">
                        <h4 class="font-rog-heading font-semibold text-white">Steps to Fix:</h4>
                        <ol class="text-sm text-gray-300 space-y-2 font-rog-body">
                            <li>1. Go to <a href="https://console.firebase.google.com" target="_blank" class="text-rog-red hover:underline">Firebase Console</a></li>
                            <li>2. Select your project: <strong class="text-white">otomono-c9938</strong></li>
                            <li>3. Go to Authentication → Settings → Authorized domains</li>
                            <li>4. Add: <strong class="text-white">${window.location.hostname}</strong></li>
                            <li>5. Save and refresh this page</li>
                        </ol>
                    </div>
                    <div class="flex space-x-3">
                        <button id="retry-vercel-login" class="flex-1 rog-button px-4 py-2 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                            Try Again
                        </button>
                        <button id="close-vercel-modal" class="px-4 py-2 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('retry-vercel-login').addEventListener('click', () => {
            modal.remove();
            this.signInWithGoogle();
        });

        document.getElementById('close-vercel-modal').addEventListener('click', () => {
            modal.remove();
        });
    },

    // Show domain error modal
    showDomainErrorModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('domain-error-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'domain-error-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-rog-dark rounded-lg shadow-xl max-w-md w-full p-6 border border-rog-red/30">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-rog-red/20 rounded-full flex items-center justify-center mr-4 border border-rog-red">
                        <svg class="w-6 h-6 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-rog-display font-bold text-white glow">Domain Authorization Error</h3>
                        <p class="text-sm text-gray-300 font-rog-body">Authentication domain not configured</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <p class="text-gray-300 font-rog-body mb-4">
                        The current domain <strong class="text-white">${window.location.hostname}</strong> is not authorized for Google authentication.
                    </p>
                    <p class="text-sm text-gray-400 font-rog-body">
                        This is a configuration issue that needs to be resolved by the site administrator.
                    </p>
                </div>

                <div class="bg-rog-red/10 border border-rog-red/30 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-rog-red mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-sm text-rog-red font-rog-heading font-medium">Contact Support</p>
                            <p class="text-sm text-gray-300 font-rog-body">Please contact the site administrator to add this domain to the authorized list.</p>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button id="retry-domain-login" class="flex-1 rog-button px-4 py-2 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                        Try Again
                    </button>
                    <button id="close-domain-modal" class="px-4 py-2 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                        Close
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('retry-domain-login').addEventListener('click', () => {
            modal.remove();
            // Retry login after a short delay
            setTimeout(() => {
                this.signInWithGoogle();
            }, 1000);
        });

        document.getElementById('close-domain-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    // Show generic error modal
    showGenericErrorModal(errorMessage) {
        // Remove existing modal if any
        const existingModal = document.getElementById('generic-error-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'generic-error-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-rog-dark rounded-lg shadow-xl max-w-md w-full p-6 border border-rog-red/30">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-rog-red/20 rounded-full flex items-center justify-center mr-4 border border-rog-red">
                        <svg class="w-6 h-6 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-rog-display font-bold text-white glow">Authentication Error</h3>
                        <p class="text-sm text-gray-300 font-rog-body">Unable to complete login process</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <p class="text-gray-300 font-rog-body mb-4">${errorMessage}</p>
                    <p class="text-sm text-gray-400 font-rog-body">Please try again or contact support if the problem persists.</p>
                </div>

                <div class="flex space-x-3">
                    <button id="retry-generic-login" class="flex-1 rog-button px-4 py-2 rounded-lg font-rog-heading font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                        Try Again
                    </button>
                    <button id="close-generic-modal" class="px-4 py-2 bg-rog-light/20 backdrop-blur-sm border border-rog-red/30 text-white rounded-lg hover:bg-rog-red/20 transition-all duration-300 hover:border-rog-red font-rog-heading">
                        Close
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('retry-generic-login').addEventListener('click', () => {
            modal.remove();
            // Retry login after a short delay
            setTimeout(() => {
                this.signInWithGoogle();
            }, 1000);
        });

        document.getElementById('close-generic-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
};

// Initialize Firebase when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('DOM loaded, initializing Firebase...');
        await window.FirebaseAuth.init();
        console.log('Firebase initialized, restoring auth state...');

        // Check for redirect result first
        await window.FirebaseAuth.checkRedirectResult();

        // Restore authentication state (persistent login)
        const user = await window.FirebaseAuth.restoreAuthState();
        if (user) {
            console.log('User session restored successfully:', user.email);
        } else {
            console.log('No active user session found');
        }

        // No need to check for popup blocker since we're using redirect

        // Listen for auth state changes (for real-time updates)
        window.FirebaseAuth.onAuthStateChanged((user) => {
            console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
            // UI is already updated in restoreAuthState and onAuthStateChanged
        });
    } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        console.error('This might be due to network issues or Firebase configuration problems');
    }
});

// Add a fallback initialization method
window.addEventListener('load', async () => {
    // If Firebase wasn't initialized on DOMContentLoaded, try again
    if (!window.FirebaseAuth || !window.FirebaseAuth.getCurrentUser) {
        console.log('Firebase not initialized on DOM load, retrying...');
        try {
            await window.FirebaseAuth.init();
            // Restore authentication state
            await window.FirebaseAuth.restoreAuthState();
        } catch (error) {
            console.error('Fallback Firebase initialization failed:', error);
        }
    }
});

// Make functions globally available for backward compatibility
window.signInWithGoogle = () => window.FirebaseAuth.signInWithGoogleEnhanced();
window.signOut = () => window.FirebaseAuth.signOut();