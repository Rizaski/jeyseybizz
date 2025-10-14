// Enhanced Firebase Configuration for Seamless Authentication
// This version is optimized for deployed sites and handles all edge cases

// Firebase configuration - Production ready
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
let app, auth, provider, db, storage;

// Enhanced domain authorization check
function isDomainAuthorized() {
    const currentDomain = window.location.hostname;
    const currentOrigin = window.location.origin;
    
    // Comprehensive domain checking
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
    
    console.log('Domain check:', {
        domain: currentDomain,
        origin: currentOrigin,
        authorized: isAuthorized
    });
    
    return isAuthorized;
}

// Initialize Firebase with enhanced error handling
async function initializeFirebase() {
    try {
        if (app && auth && provider) {
            console.log('Firebase already initialized');
            return { app, auth, provider };
        }

        console.log('Initializing Firebase...');
        
        // Dynamic imports for better error handling
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        // Initialize Firebase app
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        provider = new GoogleAuthProvider();
        
        // Configure Google provider
        provider.setCustomParameters({
            prompt: 'select_account',
            access_type: 'online'
        });
        
        // Set persistence
        await setPersistence(auth, browserLocalPersistence);
        
        console.log('Firebase initialized successfully');
        return { app, auth, provider };
        
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        throw new Error(`Firebase initialization failed: ${error.message}`);
    }
}

// Enhanced authentication manager
window.FirebaseAuthV2 = {
    // Initialize with comprehensive checks
    async init() {
        try {
            const result = await initializeFirebase();
            
            // Test network connectivity
            await this.testConnectivity();
            
            // Check domain authorization
            if (!isDomainAuthorized()) {
                console.warn('Domain may not be authorized, but proceeding...');
            }
            
            return result;
        } catch (error) {
            console.error('Firebase Auth V2 initialization failed:', error);
            throw error;
        }
    },

    // Test network connectivity
    async testConnectivity() {
        try {
            // Test basic connectivity
            const response = await fetch('https://www.googleapis.com/robots.txt', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            console.log('Network connectivity test passed');
            return true;
        } catch (error) {
            console.warn('Network connectivity test failed:', error);
            return false;
        }
    },

    // Enhanced Google sign-in with multiple fallback methods
    async signInWithGoogle() {
        try {
            console.log('Starting enhanced Google sign-in...');
            
            // Initialize Firebase
            await this.init();
            
            // Method 1: Try popup authentication
            try {
                console.log('Attempting popup authentication...');
                const { signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                
                const result = await signInWithPopup(auth, provider);
                console.log('Popup authentication successful');
                
                await this.handleSuccessfulAuth(result.user);
                return result;
                
            } catch (popupError) {
                console.log('Popup authentication failed, trying redirect...', popupError);
                
                // Method 2: Fallback to redirect authentication
                const { signInWithRedirect } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                await signInWithRedirect(auth, provider);
                return; // Redirect will navigate away
            }
            
        } catch (error) {
            console.error('Enhanced Google sign-in failed:', error);
            this.handleAuthError(error);
            throw error;
        }
    },

    // Handle successful authentication
    async handleSuccessfulAuth(user) {
        try {
            console.log('Handling successful authentication for:', user.email);
            
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
            
            // Update UI
            this.updateAuthUI(user);
            
            // Handle Firestore operations
            if (window.FirebaseDB) {
                try {
                    const existingProfile = await window.FirebaseDB.getUserProfile(user.uid);
                    if (!existingProfile) {
                        await window.FirebaseDB.createUserProfile(user);
                        console.log('New user profile created');
                    } else {
                        await window.FirebaseDB.updateUserProfile(user.uid, {
                            lastLogin: new Date().toISOString()
                        });
                        console.log('User profile updated');
                    }
                    
                    // Track login
                    await window.FirebaseDB.trackUserAction(user.uid, 'user_login', {
                        method: 'google_enhanced'
                    });
                } catch (dbError) {
                    console.error('Database operations failed:', dbError);
                    // Continue even if database fails
                }
            }
            
            // Redirect to customer page
            console.log('Redirecting to customer page...');
            window.location.replace('customer.html');
            
        } catch (error) {
            console.error('Error handling successful auth:', error);
            throw error;
        }
    },

    // Handle authentication errors
    handleAuthError(error) {
        console.error('Authentication error:', error);
        
        let errorMessage = 'Authentication failed. Please try again.';
        let showModal = true;
        
        switch (error.code) {
            case 'auth/unauthorized-domain':
                errorMessage = 'Domain not authorized. Please contact support.';
                this.showDomainErrorModal();
                return;
                
            case 'auth/popup-blocked':
                errorMessage = 'Popup blocked. Please allow popups for this site.';
                this.showPopupBlockerModal();
                return;
                
            case 'auth/popup-closed-by-user':
                console.log('User closed popup - no error needed');
                showModal = false;
                break;
                
            case 'auth/cancelled-popup-request':
                console.log('Popup cancelled by user - no error needed');
                showModal = false;
                break;
                
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection.';
                this.showNetworkErrorModal();
                return;
                
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Please try again later.';
                break;
                
            case 'auth/internal-error':
                errorMessage = 'Authentication service error. Please try again.';
                break;
                
            default:
                errorMessage = error.message || 'Authentication failed. Please try again.';
        }
        
        if (showModal) {
            this.showErrorModal(errorMessage);
        }
    },

    // Update authentication UI
    updateAuthUI(user) {
        if (!user) {
            // User signed out
            document.querySelectorAll('[data-auth="login"]').forEach(el => {
                el.style.display = 'block';
            });
            document.querySelectorAll('[data-auth="user"]').forEach(el => {
                el.style.display = 'none';
            });
            return;
        }
        
        // User signed in
        document.querySelectorAll('[data-auth="login"]').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('[data-auth="user"]').forEach(el => {
            el.style.display = 'block';
        });
        
        // Update user info
        const userElements = document.querySelectorAll('[data-user="name"]');
        userElements.forEach(el => {
            el.textContent = user.displayName || 'User';
        });
        
        const emailElements = document.querySelectorAll('[data-user="email"]');
        emailElements.forEach(el => {
            el.textContent = user.email || '';
        });
    },

    // Sign out
    async signOut() {
        try {
            await this.init();
            const { signOut: firebaseSignOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            await firebaseSignOut(auth);
            localStorage.removeItem('user');
            this.updateAuthUI(null);
            
            console.log('User signed out successfully');
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

    // Handle redirect result
    async handleRedirectResult() {
        try {
            await this.init();
            const { getRedirectResult } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            
            const result = await getRedirectResult(auth);
            if (result) {
                console.log('Redirect authentication successful');
                await this.handleSuccessfulAuth(result.user);
                return result.user;
            }
            return null;
        } catch (error) {
            console.error('Redirect result handling failed:', error);
            return null;
        }
    },

    // Error modals
    showErrorModal(message) {
        this.createModal('Authentication Error', message, 'error');
    },

    showNetworkErrorModal() {
        this.createModal(
            'Network Error',
            'Please check your internet connection and try again.',
            'network'
        );
    },

    showDomainErrorModal() {
        this.createModal(
            'Domain Authorization Error',
            'This domain is not authorized for authentication. Please contact support.',
            'domain'
        );
    },

    showPopupBlockerModal() {
        this.createModal(
            'Popup Blocked',
            'Please allow popups for this site and try again.',
            'popup'
        );
    },

    createModal(title, message, type) {
        // Remove existing modals
        document.querySelectorAll('.firebase-modal').forEach(modal => modal.remove());
        
        const modal = document.createElement('div');
        modal.className = 'firebase-modal fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                        <p class="text-sm text-gray-600">${message}</p>
                    </div>
                </div>
                <div class="flex justify-end">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onclick="this.closest('.firebase-modal').remove()">
                        OK
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing Firebase Auth V2...');
        await window.FirebaseAuthV2.init();
        
        // Handle redirect result if coming back from authentication
        const redirectUser = await window.FirebaseAuthV2.handleRedirectResult();
        if (redirectUser) {
            console.log('User authenticated via redirect');
        }
        
        // Set up auth state listener
        if (auth) {
            const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    window.FirebaseAuthV2.updateAuthUI(user);
                } else {
                    window.FirebaseAuthV2.updateAuthUI(null);
                }
            });
        }
        
        console.log('Firebase Auth V2 initialized successfully');
    } catch (error) {
        console.error('Firebase Auth V2 initialization failed:', error);
    }
});

// Make functions globally available
window.signInWithGoogleV2 = () => window.FirebaseAuthV2.signInWithGoogle();
window.signOutV2 = () => window.FirebaseAuthV2.signOut();
