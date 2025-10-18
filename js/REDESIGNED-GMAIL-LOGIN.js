/**
 * REDESIGNED GMAIL LOGIN
 * Completely redesigned Gmail login logic - solid and working perfectly
 */

(function() {
    'use strict';

    console.log('REDESIGNED GMAIL LOGIN: Starting...');

    // Configuration
    const CONFIG = {
        maxAttempts: 60, // 30 seconds of trying
        checkInterval: 500, // Check every 500ms
        retryDelay: 1000, // 1 second delay between retries
        authTimeout: 10000 // 10 second timeout for auth operations
    };

    let isRunning = false;
    let attempts = 0;
    let hasInitialized = false;
    let currentUser = null;
    let authStateListeners = [];

    // Initialize the redesigned Gmail login system
    function initializeRedesignedGmailLogin() {
        if (hasInitialized) return;

        console.log('REDESIGNED GMAIL LOGIN: Initializing system...');
        hasInitialized = true;

        // Start authentication monitoring
        startAuthenticationMonitoring();

        // Setup event listeners
        setupEventListeners();

        // Setup login buttons
        setupLoginButtons();

        console.log('REDESIGNED GMAIL LOGIN: System initialized');
    }

    // Start authentication monitoring
    function startAuthenticationMonitoring() {
        if (isRunning) return;

        console.log('REDESIGNED GMAIL LOGIN: Starting authentication monitoring...');
        isRunning = true;

        const interval = setInterval(() => {
            attempts++;

            if (attempts >= CONFIG.maxAttempts) {
                clearInterval(interval);
                console.log('REDESIGNED GMAIL LOGIN: Monitoring stopped after 30 seconds');
                return;
            }

            checkAuthenticationState();
        }, CONFIG.checkInterval);

        // Also check immediately
        checkAuthenticationState();
    }

    // Check authentication state
    async function checkAuthenticationState() {
        console.log('REDESIGNED GMAIL LOGIN: Checking authentication state...');

        try {
            // Get current user from multiple sources
            const user = await getCurrentUser();

            if (user && user.email) {
                console.log('REDESIGNED GMAIL LOGIN: User found:', user.email);
                currentUser = user;
                updateUIForAuthenticatedUser(user);
                notifyAuthStateListeners(user);
            } else {
                console.log('REDESIGNED GMAIL LOGIN: No user found');
                currentUser = null;
                updateUIForUnauthenticatedUser();
                notifyAuthStateListeners(null);
            }
        } catch (error) {
            console.error('REDESIGNED GMAIL LOGIN: Error checking auth state:', error);
        }
    }

    // Get current user from multiple sources
    async function getCurrentUser() {
        const authMethods = [
            // Firebase Auth methods
            () => window.FirebaseAuth ? .getCurrentUser ? .(),
            () => window.firebase ? .auth() ? .currentUser,

            // Custom auth handlers
            () => window.ImprovedAuth ? .getCurrentUser ? .(),
            () => window.ProfilePhotoHandler ? .authState,
            () => window.DeployedAuthFix ? .getCurrentUser ? .(),
            () => window.UniversalAuthFix ? .currentUser,

            // Storage methods
            () => {
                try {
                    const storedUser = localStorage.getItem('user');
                    return storedUser ? JSON.parse(storedUser) : null;
                } catch (e) {
                    return null;
                }
            },
            () => {
                try {
                    const sessionUser = sessionStorage.getItem('user');
                    return sessionUser ? JSON.parse(sessionUser) : null;
                } catch (e) {
                    return null;
                }
            }
        ];

        for (const method of authMethods) {
            try {
                const result = await method();
                if (result && result.email) {
                    console.log('REDESIGNED GMAIL LOGIN: Found user via method:', method.name);
                    return result;
                }
            } catch (error) {
                console.log('REDESIGNED GMAIL LOGIN: Method failed:', method.name, error);
            }
        }

        return null;
    }

    // Update UI for authenticated user
    function updateUIForAuthenticatedUser(user) {
        console.log('REDESIGNED GMAIL LOGIN: Updating UI for authenticated user:', user.email);

        // Update user information
        updateUserInformation(user);

        // Update profile images
        updateProfileImages(user);

        // Show profile interface
        showProfileInterface();

        // Setup sign out functionality
        setupSignOutFunctionality();
    }

    // Update UI for unauthenticated user
    function updateUIForUnauthenticatedUser() {
        console.log('REDESIGNED GMAIL LOGIN: Updating UI for unauthenticated user');

        // Hide profile interface
        hideProfileInterface();

        // Show login interface
        showLoginInterface();
    }

    // Update user information
    function updateUserInformation(user) {
        const displayName = user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'User');
        const email = user.email || 'user@example.com';

        console.log('REDESIGNED GMAIL LOGIN: Updating user info:', {
            displayName,
            email
        });

        // Update user name elements
        const userNameSelectors = [
            '#dropdown-user-name',
            '#mobile-user-name',
            '.user-name',
            '[data-user-name]'
        ];

        userNameSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.textContent = displayName;
                console.log('REDESIGNED GMAIL LOGIN: Updated', selector, 'with name:', displayName);
            });
        });

        // Update user email elements
        const userEmailSelectors = [
            '#dropdown-user-email',
            '#mobile-user-email',
            '.user-email',
            '[data-user-email]'
        ];

        userEmailSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.textContent = email;
                console.log('REDESIGNED GMAIL LOGIN: Updated', selector, 'with email:', email);
            });
        });
    }

    // Update profile images
    function updateProfileImages(user) {
        const photoURL = user.photoURL || user.avatar || '';

        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];

        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('REDESIGNED GMAIL LOGIN: Setting', selector, 'with profile image');
                setProfileImage(img, photoURL, user);
            }
        });
    }

    // Set profile image with fallback
    function setProfileImage(imgElement, imageUrl, user) {
        console.log('REDESIGNED GMAIL LOGIN: Setting image for', imgElement.id, ':', imageUrl);

        // Clear any existing handlers
        imgElement.onerror = null;
        imgElement.onload = null;

        if (imageUrl && imageUrl !== '') {
            imgElement.src = imageUrl;
            imgElement.style.display = 'block';
            imgElement.style.visibility = 'visible';
            imgElement.style.width = '32px';
            imgElement.style.height = '32px';
            imgElement.style.borderRadius = '50%';
            imgElement.style.objectFit = 'cover';
            imgElement.style.border = '2px solid #ff0040';

            // Handle successful load
            imgElement.onload = () => {
                console.log('REDESIGNED GMAIL LOGIN: Image loaded successfully for', imgElement.id);
            };

            // Handle error with fallback
            imgElement.onerror = () => {
                console.log('REDESIGNED GMAIL LOGIN: Image failed for', imgElement.id, ', using fallback');
                setFallbackImage(imgElement, user);
            };
        } else {
            setFallbackImage(imgElement, user);
        }
    }

    // Set fallback image
    function setFallbackImage(imgElement, user) {
        const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
        imgElement.style.backgroundColor = '#ff0040';
        imgElement.style.color = 'white';
        imgElement.style.display = 'flex';
        imgElement.style.alignItems = 'center';
        imgElement.style.justifyContent = 'center';
        imgElement.style.fontWeight = 'bold';
        imgElement.style.fontSize = '16px';
        imgElement.textContent = initial;
        imgElement.src = '';
    }

    // Show profile interface
    function showProfileInterface() {
        console.log('REDESIGNED GMAIL LOGIN: Showing profile interface');

        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('REDESIGNED GMAIL LOGIN: Profile button shown');
        }

        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('REDESIGNED GMAIL LOGIN: Login button hidden');
        }

        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('REDESIGNED GMAIL LOGIN: Mobile user profile shown');
        }

        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('REDESIGNED GMAIL LOGIN: Mobile login hidden');
        }
    }

    // Hide profile interface
    function hideProfileInterface() {
        console.log('REDESIGNED GMAIL LOGIN: Hiding profile interface');

        // Hide profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.remove('show');
            profileButton.classList.add('hidden');
            profileButton.style.display = 'none';
            profileButton.style.visibility = 'hidden';
        }

        // Show login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.remove('hidden');
            loginButton.classList.add('show');
            loginButton.style.display = 'flex';
            loginButton.style.visibility = 'visible';
        }

        // Hide mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'none';
            mobileUserProfile.style.visibility = 'hidden';
        }

        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'block';
            mobileLogin.style.visibility = 'visible';
        }
    }

    // Show login interface
    function showLoginInterface() {
        console.log('REDESIGNED GMAIL LOGIN: Showing login interface');
        // This is handled by hideProfileInterface
    }

    // Setup event listeners
    function setupEventListeners() {
        console.log('REDESIGNED GMAIL LOGIN: Setting up event listeners');

        // DOM ready
        document.addEventListener('DOMContentLoaded', initializeRedesignedGmailLogin);

        // Window load
        window.addEventListener('load', initializeRedesignedGmailLogin);

        // Window focus
        window.addEventListener('focus', initializeRedesignedGmailLogin);

        // Click events
        document.addEventListener('click', initializeRedesignedGmailLogin);

        // Scroll events
        document.addEventListener('scroll', initializeRedesignedGmailLogin);
    }

    // Setup login buttons
    function setupLoginButtons() {
        console.log('REDESIGNED GMAIL LOGIN: Setting up login buttons');

        const loginButtons = document.querySelectorAll('#login-btn, .login-btn, [data-login]');
        loginButtons.forEach(button => {
            button.addEventListener('click', handleLogin);
        });
    }

    // Handle login
    async function handleLogin(event) {
        event.preventDefault();
        event.stopPropagation();

        console.log('REDESIGNED GMAIL LOGIN: Login button clicked');

        try {
            // Try multiple login methods
            const loginMethods = [
                () => window.FirebaseAuth ? .signInWithGoogle ? .(),
                () => window.firebase ? .auth() ? .signInWithPopup ? .(new window.firebase.auth.GoogleAuthProvider()),
                () => window.ImprovedAuth ? .signInWithGoogle ? .(),
                () => window.ProfilePhotoHandler ? .signInWithGoogle ? .(),
                () => window.DeployedAuthFix ? .signInWithGoogle ? .(),
                () => window.UniversalAuthFix ? .signInWithGoogle ? .()
            ];

            let loginSuccess = false;

            for (const method of loginMethods) {
                try {
                    const result = await method();
                    if (result && result.user) {
                        console.log('REDESIGNED GMAIL LOGIN: Login successful via method:', method.name);
                        loginSuccess = true;

                        // Store user in localStorage
                        localStorage.setItem('user', JSON.stringify(result.user));

                        // Update UI
                        updateUIForAuthenticatedUser(result.user);
                        notifyAuthStateListeners(result.user);

                        break;
                    }
                } catch (error) {
                    console.log('REDESIGNED GMAIL LOGIN: Login failed via method:', method.name, error);
                }
            }

            if (!loginSuccess) {
                console.error('REDESIGNED GMAIL LOGIN: All login methods failed');
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('REDESIGNED GMAIL LOGIN: Login error:', error);
            alert('Login error. Please try again.');
        }
    }

    // Setup sign out functionality
    function setupSignOutFunctionality() {
        console.log('REDESIGNED GMAIL LOGIN: Setting up sign out functionality');

        const signOutSelectors = [
            '#sign-out-btn',
            '#signout-btn',
            '#logout-btn',
            '#log-out-btn',
            '#mobile-sign-out',
            '.signout-btn',
            '.sign-out-btn',
            '.logout-btn',
            '.log-out-btn',
            '[data-signout]',
            '[data-sign-out]',
            '[data-logout]',
            '[data-log-out]'
        ];

        let signOutElements = [];

        signOutSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                signOutElements.push(element);
            });
        });

        // Also look for elements with sign out text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = element.textContent ? .toLowerCase() || '';
            if (text.includes('sign out') || text.includes('logout') || text.includes('log out')) {
                if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'DIV') {
                    signOutElements.push(element);
                }
            }
        });

        console.log('REDESIGNED GMAIL LOGIN: Found', signOutElements.length, 'sign out elements');

        signOutElements.forEach((element, index) => {
            element.removeEventListener('click', handleSignOut);
            element.addEventListener('click', handleSignOut);
            console.log('REDESIGNED GMAIL LOGIN: Sign out handler added to element', index);
        });
    }

    // Handle sign out
    async function handleSignOut(event) {
        event.preventDefault();
        event.stopPropagation();

        console.log('REDESIGNED GMAIL LOGIN: Sign out clicked');

        try {
            // Try multiple sign out methods
            const signOutMethods = [
                () => window.FirebaseAuth ? .signOut ? .(),
                () => window.firebase ? .auth() ? .signOut ? .(),
                () => window.ImprovedAuth ? .signOut ? .(),
                () => window.ProfilePhotoHandler ? .signOut ? .(),
                () => window.DeployedAuthFix ? .signOut ? .(),
                () => window.UniversalAuthFix ? .signOut ? .(),
                () => {
                    // Clear storage
                    localStorage.removeItem('user');
                    localStorage.removeItem('authUser');
                    localStorage.removeItem('firebase:authUser');
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('authUser');
                    sessionStorage.removeItem('firebase:authUser');
                    return Promise.resolve();
                }
            ];

            let signOutSuccess = false;

            for (const method of signOutMethods) {
                try {
                    await method();
                    console.log('REDESIGNED GMAIL LOGIN: Sign out successful via method:', method.name);
                    signOutSuccess = true;
                } catch (error) {
                    console.log('REDESIGNED GMAIL LOGIN: Sign out failed via method:', method.name, error);
                }
            }

            // Update UI
            updateUIForUnauthenticatedUser();
            notifyAuthStateListeners(null);

            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (error) {
            console.error('REDESIGNED GMAIL LOGIN: Sign out error:', error);
        }
    }

    // Notify auth state listeners
    function notifyAuthStateListeners(user) {
        authStateListeners.forEach(listener => {
            try {
                listener(user);
            } catch (error) {
                console.error('REDESIGNED GMAIL LOGIN: Auth state listener error:', error);
            }
        });
    }

    // Public API
    window.RedesignedGmailLogin = {
        // Initialize
        init: initializeRedesignedGmailLogin,

        // Get current user
        getCurrentUser: () => currentUser,

        // Login
        login: handleLogin,

        // Sign out
        signOut: handleSignOut,

        // Add auth state listener
        onAuthStateChanged: (callback) => {
            authStateListeners.push(callback);
        },

        // Force refresh
        forceRefresh: () => {
            attempts = 0;
            startAuthenticationMonitoring();
        },

        // Check auth state
        checkAuthState: checkAuthenticationState
    };

    // Global function for backward compatibility
    window.REDESIGNED_GMAIL_LOGIN_FORCE_REFRESH = () => {
        window.RedesignedGmailLogin.forceRefresh();
    };

    // Start immediately
    initializeRedesignedGmailLogin();

    console.log('REDESIGNED GMAIL LOGIN: Loaded and running!');
})();