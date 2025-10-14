// Global Firebase Configuration and Authentication
// This file provides Firebase authentication functionality across all pages

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrLm4hxslT2H_jaT6eQrAEK8swP55h6_c",
    authDomain: "jeysey-39fb6.firebaseapp.com",
    projectId: "jeysey-39fb6",
    storageBucket: "jeysey-39fb6.firebasestorage.app",
    messagingSenderId: "71940333413",
    appId: "1:71940333413:web:c9986db4e5e314d8124b8c"
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
                // Continue anyway for deployed sites
            } else if (!isDeployed && !checkDomainAuthorization()) {
                throw new Error('Domain not authorized for local development');
            }

            console.log('Domain check passed, starting authentication...');

            // Try popup first for better UX, fallback to redirect
            try {
                const {
                    signInWithPopup
                } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                console.log('Attempting popup sign-in...');

                const result = await signInWithPopup(auth, provider);
                console.log('Popup sign-in successful:', result.user.email);

                // Handle successful authentication
                const user = result.user;
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
                            method: 'google_popup'
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
                return result;

            } catch (popupError) {
                console.log('Popup sign-in failed, trying redirect method...', popupError);

                // Fallback to redirect method
                const {
                    signInWithRedirect
                } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                console.log('Starting redirect sign-in...');
                await signInWithRedirect(auth, provider);
                return; // Don't continue as redirect will navigate away
            }

        } catch (error) {
            console.error('Google sign-in error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // Handle specific Firebase errors
            if (error.code === 'auth/unauthorized-domain') {
                console.error('Domain authorization error:', error);
                this.showDomainErrorModal();
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

        // Update profile buttons (desktop header)
        const profileButtons = document.querySelectorAll('#profile-btn');
        profileButtons.forEach(button => {
            if (userData) {
                // User is signed in - show Account dropdown
                button.innerHTML = `
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
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
                        Login with Gmail
                    </div>
                `;
                button.onclick = () => this.signInWithGoogleEnhanced();
            }
        });

        // Update mobile menu buttons
        const mobileButtons = document.querySelectorAll('#mobile-gmail-login');
        mobileButtons.forEach(button => {
            if (userData) {
                button.innerHTML = `
                    <svg class="w-5 h-5 text-rog-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-white font-rog-heading font-medium">Account</span>
                `;
                button.onclick = () => {
                    // Redirect to customer page
                    window.location.href = 'customer.html';
                };
            } else {
                button.innerHTML = `
                    <svg class="w-5 h-5 text-rog-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-white font-rog-heading font-medium">Login with Gmail</span>
                `;
                button.onclick = () => this.signInWithGoogleEnhanced();
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
        dropdown.className = 'absolute top-full right-0 mt-2 w-48 bg-rog-dark rounded-lg shadow-lg border border-rog-red/30 z-50';
        dropdown.innerHTML = `
            <div class="py-2">
                <div class="px-4 py-2 text-sm text-gray-300 border-b border-rog-red/30">
                    <div class="font-rog-heading font-semibold text-white">${this.getCurrentUser()?.displayName || 'User'}</div>
                    <div class="text-gray-400 font-rog-body">${this.getCurrentUser()?.email || ''}</div>
                </div>
                <a href="customer.html" class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-rog-red/20 transition-colors font-rog-body">
                    <svg class="w-4 h-4 mr-3 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account Dashboard
                </a>
                <a href="designer-studio.html" class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-rog-red/20 transition-colors font-rog-body">
                    <svg class="w-4 h-4 mr-3 text-rog-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Jersey Designer
                </a>
                <div class="border-t border-rog-red/30"></div>
                <button onclick="window.FirebaseAuth.signOut()" class="flex items-center w-full px-4 py-2 text-sm text-rog-red hover:bg-rog-red/20 transition-colors font-rog-body">
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