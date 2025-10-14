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
        const { setPersistence, browserLocalPersistence } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
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
    const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
    const isGitHubPages = currentDomain.includes('github.io');

    if (isLocalhost) {
        console.log('Running on localhost - make sure to add localhost to Firebase authorized domains');
    } else if (isGitHubPages) {
        console.log('Running on GitHub Pages - make sure to add your GitHub Pages domain to Firebase authorized domains');
    }

    return true; // Continue with authentication attempt
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

    // Sign in with Google
    async signInWithGoogle() {
        try {
            console.log('Starting Google sign-in process...');

            // Initialize Firebase first
            const initSuccess = await this.init();
            if (!initSuccess) {
                throw new Error('Failed to initialize Firebase');
            }

            console.log('Firebase initialized, checking domain authorization...');

            if (!checkDomainAuthorization()) {
                throw new Error('Domain not authorized');
            }

            console.log('Domain authorized, importing signInWithPopup...');
            const {
                signInWithPopup
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            console.log('Starting popup sign-in...');
            const result = await signInWithPopup(auth, provider);

            const user = result.user;
            console.log('User signed in successfully:', user);

            // Store user data in localStorage
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('User data stored in localStorage');

            // Update UI
            this.updateAuthUI(user);

            return user;
        } catch (error) {
            console.error('Google sign-in error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // Handle specific Firebase errors
            if (error.code === 'auth/unauthorized-domain') {
                alert('Authentication domain not authorized. Please contact support or try again later.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.log('User closed the popup');
                // Don't show alert for user closing popup
            } else if (error.code === 'auth/internal-error') {
                console.error('Firebase internal error:', error);
                alert('Authentication service temporarily unavailable. Please try again later or contact support.');
            } else if (error.code === 'auth/network-request-failed') {
                alert('Network error. Please check your internet connection and try again.');
            } else if (error.code === 'auth/too-many-requests') {
                alert('Too many failed attempts. Please try again later.');
            } else if (error.code === 'auth/popup-blocked') {
                this.showPopupBlockerInstructions();
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log('Popup request was cancelled');
                // Don't show alert for cancelled requests
            } else {
                console.error('Firebase auth error:', error);
                alert(`Authentication failed: ${error.message}. Please try again.`);
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
        dropdown.className = 'absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50';
        dropdown.innerHTML = `
            <div class="py-2">
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div class="font-semibold">${this.getCurrentUser()?.displayName || 'User'}</div>
                    <div class="text-gray-500">${this.getCurrentUser()?.email || ''}</div>
                </div>
                <a href="customer.html" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account Dashboard
                </a>
                <a href="designer-studio.html" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Jersey Designer
                </a>
                <div class="border-t border-gray-100"></div>
                <button onclick="window.FirebaseAuth.signOut()" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Popup Blocked</h3>
                        <p class="text-sm text-gray-600">Your browser blocked the Gmail login popup</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-semibold text-gray-900 mb-3">To allow Gmail login, please:</h4>
                    <div class="space-y-3 text-sm text-gray-700">
                        <div class="flex items-start">
                            <span class="font-semibold text-rog-red mr-2">1.</span>
                            <div>
                                <strong>Chrome/Edge:</strong> Click the popup blocker icon in the address bar, then select "Always allow popups from this site"
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="font-semibold text-rog-red mr-2">2.</span>
                            <div>
                                <strong>Firefox:</strong> Go to Settings → Privacy & Security → Permissions → Block pop-up windows → Add this site to exceptions
                            </div>
                        </div>
                        <div class="flex items-start">
                            <span class="font-semibold text-rog-red mr-2">3.</span>
                            <div>
                                <strong>Safari:</strong> Go to Safari → Preferences → Websites → Pop-up Windows → Allow for this site
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-sm text-blue-800 font-medium">Quick Fix:</p>
                            <p class="text-sm text-blue-700">Look for a popup blocker icon in your browser's address bar and click "Allow" or "Always allow"</p>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button id="retry-login" class="flex-1 bg-rog-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
                        Try Again
                    </button>
                    <button id="close-popup-modal" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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

            console.log('No popup blocker detected, proceeding with login...');
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
        warning.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 px-4 py-3 z-50 shadow-lg';
        warning.innerHTML = `
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span class="font-medium">Popup blocker detected! Gmail login may not work. </span>
                    <button id="fix-popup-blocker" class="ml-2 underline hover:no-underline font-semibold">
                        Click here to fix
                    </button>
                </div>
                <button id="dismiss-warning" class="ml-4 text-yellow-900 hover:text-yellow-700">
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

    // Restore authentication state on page load
    async restoreAuthState() {
        try {
            await this.init();
            
            // Check if we have a valid session
            if (!this.isSessionValid()) {
                console.log('No valid session found');
                this.updateAuthUI(null);
                return null;
            }

            // Get current user from Firebase
            const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
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

            // Check for popup blocker and show warning if needed
            const isBlocked = await window.FirebaseAuth.detectPopupBlocker();
            if (isBlocked) {
                console.log('Popup blocker detected, showing warning...');
                window.FirebaseAuth.showPopupBlockerWarning();
            }

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