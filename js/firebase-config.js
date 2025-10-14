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
                alert('Popup was blocked by your browser. Please allow popups for this site and try again.');
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
                // User is signed in - show Account button that redirects to customer page
                button.innerHTML = `
                    <svg class="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-white font-rog-heading font-medium">Account</span>
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-rog-dark text-rog-red text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-rog-red">
                        Go to Dashboard
                    </div>
                `;
                button.onclick = () => {
                    // Redirect to customer page
                    window.location.href = 'customer.html';
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
                button.onclick = () => this.signInWithGoogle();
            }
        });

        // Update mobile menu buttons - show Account and Logout options
        const mobileButtons = document.querySelectorAll('#mobile-gmail-login');
        mobileButtons.forEach(button => {
            if (userData) {
                // User is signed in - show Account and Logout options
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
                button.onclick = () => this.signInWithGoogle();
            }
        });

        // Update staff login button to show logout when signed in
        this.updateStaffLogoutButton(userData);

        // Add logout button to mobile menu if user is signed in
        this.updateMobileLogoutButton(userData);
    },

    // Update staff login button to show logout when signed in
    updateStaffLogoutButton(userData) {
        const staffButtons = document.querySelectorAll('#staff-login-btn');
        staffButtons.forEach(button => {
            if (userData) {
                // User is signed in - show logout button
                button.innerHTML = `
                    <svg class="w-5 h-5 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-rog-dark text-rog-red text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-rog-red">
                        Logout
                    </div>
                `;
                button.onclick = () => this.signOut();
            } else {
                // User is not signed in - show staff login
                button.innerHTML = `
                    <svg class="w-5 h-5 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-rog-dark text-rog-red text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-rog-red">
                        Staff Login
                    </div>
                `;
                button.onclick = () => {
                    // Original staff login functionality
                    console.log('Staff login clicked');
                };
            }
        });
    },

    // Update mobile logout button
    updateMobileLogoutButton(userData) {
        // Find existing logout button or create one
        let logoutButton = document.getElementById('mobile-logout-btn');
        
        if (userData) {
            // User is signed in - show logout button
            if (!logoutButton) {
                // Create logout button
                const mobileMenu = document.querySelector('#mobile-menu nav');
                if (mobileMenu) {
                    const logoutBtn = document.createElement('button');
                    logoutBtn.id = 'mobile-logout-btn';
                    logoutBtn.className = 'w-full flex items-center justify-center px-4 py-3 bg-red-600/20 backdrop-blur-sm rounded-lg hover:bg-red-600/30 transition-all duration-300 border border-red-600/30 hover:border-red-600';
                    logoutBtn.innerHTML = `
                        <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span class="text-red-600 font-rog-heading font-medium">Logout</span>
                    `;
                    logoutBtn.onclick = () => this.signOut();
                    mobileMenu.appendChild(logoutBtn);
                }
            } else {
                logoutButton.style.display = 'block';
            }
        } else {
            // User is not signed in - hide logout button
            if (logoutButton) {
                logoutButton.style.display = 'none';
            }
        }
    },

    // Listen for authentication state changes
    async onAuthStateChanged(callback) {
        try {
            await this.init();
            const {
                onAuthStateChanged
            } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // Store user data
                    localStorage.setItem('user', JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    }));
                } else {
                    // Clear user data
                    localStorage.removeItem('user');
                }
                callback(user);
            });
        } catch (error) {
            console.error('Auth state listener error:', error);
        }
    }
};

// Initialize Firebase when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('DOM loaded, initializing Firebase...');
        await window.FirebaseAuth.init();
        console.log('Firebase initialized, updating UI...');
        window.FirebaseAuth.updateAuthUI();

        // Listen for auth state changes
        window.FirebaseAuth.onAuthStateChanged((user) => {
            console.log('Auth state changed:', user ? 'User signed in' : 'User signed out');
            window.FirebaseAuth.updateAuthUI(user);
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
            window.FirebaseAuth.updateAuthUI();
        } catch (error) {
            console.error('Fallback Firebase initialization failed:', error);
        }
    }
});

// Make functions globally available for backward compatibility
window.signInWithGoogle = () => window.FirebaseAuth.signInWithGoogle();
window.signOut = () => window.FirebaseAuth.signOut();