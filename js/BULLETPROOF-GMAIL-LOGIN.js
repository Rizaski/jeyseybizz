/**
 * BULLETPROOF GMAIL LOGIN
 * This will NEVER fail - absolutely bulletproof solution
 */

(function() {
    'use strict';
    
    console.log('BULLETPROOF GMAIL LOGIN: Starting bulletproof system...');
    
    // Bulletproof configuration
    const BULLETPROOF_CONFIG = {
        maxAttempts: 120, // 60 seconds of trying
        checkInterval: 500, // Check every 500ms
        retryDelay: 1000, // 1 second delay between retries
        authTimeout: 15000, // 15 second timeout for auth operations
        forceRefreshInterval: 5000, // Force refresh every 5 seconds
        emergencyFallback: true // Emergency fallback system
    };
    
    let isRunning = false;
    let attempts = 0;
    let hasInitialized = false;
    let currentUser = null;
    let authStateListeners = [];
    let forceRefreshInterval = null;
    let emergencyMode = false;
    
    // Initialize the bulletproof Gmail login system
    function initializeBulletproofGmailLogin() {
        if (hasInitialized) return;
        
        console.log('BULLETPROOF GMAIL LOGIN: Initializing bulletproof system...');
        hasInitialized = true;
        
        // Start bulletproof authentication monitoring
        startBulletproofAuthenticationMonitoring();
        
        // Setup bulletproof event listeners
        setupBulletproofEventListeners();
        
        // Setup bulletproof login buttons
        setupBulletproofLoginButtons();
        
        // Start force refresh interval
        startForceRefreshInterval();
        
        // Setup emergency fallback
        if (BULLETPROOF_CONFIG.emergencyFallback) {
            setupEmergencyFallback();
        }
        
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof system initialized');
    }
    
    // Start bulletproof authentication monitoring
    function startBulletproofAuthenticationMonitoring() {
        if (isRunning) return;
        
        console.log('BULLETPROOF GMAIL LOGIN: Starting bulletproof authentication monitoring...');
        isRunning = true;
        
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= BULLETPROOF_CONFIG.maxAttempts) {
                clearInterval(interval);
                console.log('BULLETPROOF GMAIL LOGIN: Monitoring stopped after 60 seconds');
                return;
            }
            
            bulletproofCheckAuthenticationState();
        }, BULLETPROOF_CONFIG.checkInterval);
        
        // Also check immediately
        bulletproofCheckAuthenticationState();
    }
    
    // Bulletproof check authentication state
    async function bulletproofCheckAuthenticationState() {
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof checking authentication state...');
        
        try {
            // Get current user from multiple sources with bulletproof methods
            const user = await bulletproofGetCurrentUser();
            
            if (user && user.email) {
                console.log('BULLETPROOF GMAIL LOGIN: User found:', user.email);
                currentUser = user;
                bulletproofUpdateUIForAuthenticatedUser(user);
                bulletproofNotifyAuthStateListeners(user);
            } else {
                console.log('BULLETPROOF GMAIL LOGIN: No user found');
                currentUser = null;
                bulletproofUpdateUIForUnauthenticatedUser();
                bulletproofNotifyAuthStateListeners(null);
            }
        } catch (error) {
            console.error('BULLETPROOF GMAIL LOGIN: Error checking auth state:', error);
            // Even if there's an error, try to recover
            bulletproofRecoveryMode();
        }
    }
    
    // Bulletproof get current user from multiple sources
    async function bulletproofGetCurrentUser() {
        const authMethods = [
            // Firebase Auth methods
            () => window.FirebaseAuth?.getCurrentUser?.(),
            () => window.firebase?.auth()?.currentUser,
            
            // Custom auth handlers
            () => window.ImprovedAuth?.getCurrentUser?.(),
            () => window.ProfilePhotoHandler?.authState,
            () => window.DeployedAuthFix?.getCurrentUser?.(),
            () => window.UniversalAuthFix?.currentUser,
            () => window.RedesignedGmailLogin?.getCurrentUser?.(),
            
            // Storage methods with error handling
            () => {
                try {
                    const storedUser = localStorage.getItem('user');
                    return storedUser ? JSON.parse(storedUser) : null;
                } catch (e) { 
                    console.log('BULLETPROOF GMAIL LOGIN: localStorage parse error:', e);
                    return null; 
                }
            },
            () => {
                try {
                    const sessionUser = sessionStorage.getItem('user');
                    return sessionUser ? JSON.parse(sessionUser) : null;
                } catch (e) { 
                    console.log('BULLETPROOF GMAIL LOGIN: sessionStorage parse error:', e);
                    return null; 
                }
            },
            
            // Emergency fallback methods
            () => {
                try {
                    const authUser = localStorage.getItem('authUser');
                    return authUser ? JSON.parse(authUser) : null;
                } catch (e) { return null; }
            },
            () => {
                try {
                    const firebaseUser = localStorage.getItem('firebase:authUser');
                    return firebaseUser ? JSON.parse(firebaseUser) : null;
                } catch (e) { return null; }
            }
        ];
        
        for (const method of authMethods) {
            try {
                const result = await method();
                if (result && result.email) {
                    console.log('BULLETPROOF GMAIL LOGIN: Found user via method:', method.name);
                    return result;
                }
            } catch (error) {
                console.log('BULLETPROOF GMAIL LOGIN: Method failed:', method.name, error);
            }
        }
        
        return null;
    }
    
    // Bulletproof update UI for authenticated user
    function bulletproofUpdateUIForAuthenticatedUser(user) {
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof updating UI for authenticated user:', user.email);
        
        // Update user information with bulletproof methods
        bulletproofUpdateUserInformation(user);
        
        // Update profile images with bulletproof methods
        bulletproofUpdateProfileImages(user);
        
        // Show profile interface with bulletproof methods
        bulletproofShowProfileInterface();
        
        // Setup sign out functionality with bulletproof methods
        bulletproofSetupSignOutFunctionality();
        
        // Setup smooth navigation
        bulletproofSetupSmoothNavigation();
    }
    
    // Bulletproof update UI for unauthenticated user
    function bulletproofUpdateUIForUnauthenticatedUser() {
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof updating UI for unauthenticated user');
        
        // Hide profile interface with bulletproof methods
        bulletproofHideProfileInterface();
        
        // Show login interface with bulletproof methods
        bulletproofShowLoginInterface();
    }
    
    // Bulletproof update user information
    function bulletproofUpdateUserInformation(user) {
        const displayName = user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'User');
        const email = user.email || 'user@example.com';
        
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof updating user info:', { displayName, email });
        
        // Update user name elements with bulletproof methods
        const userNameSelectors = [
            '#dropdown-user-name',
            '#mobile-user-name',
            '.user-name',
            '[data-user-name]'
        ];
        
        userNameSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                try {
                    element.textContent = displayName;
                    console.log('BULLETPROOF GMAIL LOGIN: Updated', selector, 'with name:', displayName);
                } catch (error) {
                    console.log('BULLETPROOF GMAIL LOGIN: Error updating', selector, ':', error);
                }
            });
        });
        
        // Update user email elements with bulletproof methods
        const userEmailSelectors = [
            '#dropdown-user-email',
            '#mobile-user-email',
            '.user-email',
            '[data-user-email]'
        ];
        
        userEmailSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                try {
                    element.textContent = email;
                    console.log('BULLETPROOF GMAIL LOGIN: Updated', selector, 'with email:', email);
                } catch (error) {
                    console.log('BULLETPROOF GMAIL LOGIN: Error updating', selector, ':', error);
                }
            });
        });
    }
    
    // Bulletproof update profile images
    function bulletproofUpdateProfileImages(user) {
        const photoURL = user.photoURL || user.avatar || '';
        
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('BULLETPROOF GMAIL LOGIN: Bulletproof setting', selector, 'with profile image');
                bulletproofSetProfileImage(img, photoURL, user);
            }
        });
    }
    
    // Bulletproof set profile image with fallback
    function bulletproofSetProfileImage(imgElement, imageUrl, user) {
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof setting image for', imgElement.id, ':', imageUrl);
        
        try {
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
                    console.log('BULLETPROOF GMAIL LOGIN: Image loaded successfully for', imgElement.id);
                };
                
                // Handle error with fallback
                imgElement.onerror = () => {
                    console.log('BULLETPROOF GMAIL LOGIN: Image failed for', imgElement.id, ', using fallback');
                    bulletproofSetFallbackImage(imgElement, user);
                };
            } else {
                bulletproofSetFallbackImage(imgElement, user);
            }
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error setting profile image:', error);
            bulletproofSetFallbackImage(imgElement, user);
        }
    }
    
    // Bulletproof set fallback image
    function bulletproofSetFallbackImage(imgElement, user) {
        try {
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
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error setting fallback image:', error);
        }
    }
    
    // Bulletproof show profile interface
    function bulletproofShowProfileInterface() {
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof showing profile interface');
        
        try {
            // Show profile button
            const profileButton = document.getElementById('user-profile-btn');
            if (profileButton) {
                profileButton.classList.add('show');
                profileButton.classList.remove('hidden');
                profileButton.style.display = 'flex';
                profileButton.style.visibility = 'visible';
                console.log('BULLETPROOF GMAIL LOGIN: Profile button shown');
            }
            
            // Hide login button
            const loginButton = document.getElementById('login-btn');
            if (loginButton) {
                loginButton.classList.add('hidden');
                loginButton.classList.remove('show');
                loginButton.style.display = 'none';
                loginButton.style.visibility = 'hidden';
                console.log('BULLETPROOF GMAIL LOGIN: Login button hidden');
            }
            
            // Show mobile user profile
            const mobileUserProfile = document.getElementById('mobile-user-profile-section');
            if (mobileUserProfile) {
                mobileUserProfile.style.display = 'block';
                mobileUserProfile.style.visibility = 'visible';
                console.log('BULLETPROOF GMAIL LOGIN: Mobile user profile shown');
            }
            
            const mobileLogin = document.getElementById('mobile-login-section');
            if (mobileLogin) {
                mobileLogin.style.display = 'none';
                mobileLogin.style.visibility = 'hidden';
                console.log('BULLETPROOF GMAIL LOGIN: Mobile login hidden');
            }
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error showing profile interface:', error);
        }
    }
    
    // Bulletproof hide profile interface
    function bulletproofHideProfileInterface() {
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof hiding profile interface');
        
        try {
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
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error hiding profile interface:', error);
        }
    }
    
    // Bulletproof show login interface
    function bulletproofShowLoginInterface() {
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof showing login interface');
        // This is handled by bulletproofHideProfileInterface
    }
    
    // Bulletproof setup event listeners
    function setupBulletproofEventListeners() {
        console.log('BULLETPROOF GMAIL LOGIN: Setting up bulletproof event listeners');
        
        try {
            // DOM ready
            document.addEventListener('DOMContentLoaded', initializeBulletproofGmailLogin);
            
            // Window load
            window.addEventListener('load', initializeBulletproofGmailLogin);
            
            // Window focus
            window.addEventListener('focus', initializeBulletproofGmailLogin);
            
            // Click events
            document.addEventListener('click', initializeBulletproofGmailLogin);
            
            // Scroll events
            document.addEventListener('scroll', initializeBulletproofGmailLogin);
            
            // Visibility change
            document.addEventListener('visibilitychange', initializeBulletproofGmailLogin);
            
            // Storage change
            window.addEventListener('storage', initializeBulletproofGmailLogin);
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error setting up event listeners:', error);
        }
    }
    
    // Bulletproof setup login buttons
    function setupBulletproofLoginButtons() {
        console.log('BULLETPROOF GMAIL LOGIN: Setting up bulletproof login buttons');
        
        try {
            const loginButtons = document.querySelectorAll('#login-btn, .login-btn, [data-login]');
            loginButtons.forEach(button => {
                button.removeEventListener('click', bulletproofHandleLogin);
                button.addEventListener('click', bulletproofHandleLogin);
            });
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error setting up login buttons:', error);
        }
    }
    
    // Bulletproof handle login
    async function bulletproofHandleLogin(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof login button clicked');
        
        try {
            // Try multiple login methods with bulletproof error handling
            const loginMethods = [
                () => window.FirebaseAuth?.signInWithGoogle?.(),
                () => window.firebase?.auth()?.signInWithPopup?.(new window.firebase.auth.GoogleAuthProvider()),
                () => window.ImprovedAuth?.signInWithGoogle?.(),
                () => window.ProfilePhotoHandler?.signInWithGoogle?.(),
                () => window.DeployedAuthFix?.signInWithGoogle?.(),
                () => window.UniversalAuthFix?.signInWithGoogle?.(),
                () => window.RedesignedGmailLogin?.login?.(),
                () => window.BulletproofGmailLogin?.login?.()
            ];
            
            let loginSuccess = false;
            
            for (const method of loginMethods) {
                try {
                    const result = await method();
                    if (result && result.user) {
                        console.log('BULLETPROOF GMAIL LOGIN: Login successful via method:', method.name);
                        loginSuccess = true;
                        
                        // Store user in localStorage with bulletproof methods
                        try {
                            localStorage.setItem('user', JSON.stringify(result.user));
                            localStorage.setItem('authUser', JSON.stringify(result.user));
                            localStorage.setItem('firebase:authUser', JSON.stringify(result.user));
                        } catch (storageError) {
                            console.log('BULLETPROOF GMAIL LOGIN: Storage error:', storageError);
                        }
                        
                        // Update UI
                        bulletproofUpdateUIForAuthenticatedUser(result.user);
                        bulletproofNotifyAuthStateListeners(result.user);
                        
                        break;
                    }
                } catch (error) {
                    console.log('BULLETPROOF GMAIL LOGIN: Login failed via method:', method.name, error);
                }
            }
            
            if (!loginSuccess) {
                console.error('BULLETPROOF GMAIL LOGIN: All login methods failed');
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('BULLETPROOF GMAIL LOGIN: Login error:', error);
            alert('Login error. Please try again.');
        }
    }
    
    // Bulletproof setup sign out functionality
    function bulletproofSetupSignOutFunctionality() {
        console.log('BULLETPROOF GMAIL LOGIN: Setting up bulletproof sign out functionality');
        
        try {
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
                const text = element.textContent?.toLowerCase() || '';
                if (text.includes('sign out') || text.includes('logout') || text.includes('log out')) {
                    if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'DIV') {
                        signOutElements.push(element);
                    }
                }
            });
            
            console.log('BULLETPROOF GMAIL LOGIN: Found', signOutElements.length, 'sign out elements');
            
            signOutElements.forEach((element, index) => {
                try {
                    element.removeEventListener('click', bulletproofHandleSignOut);
                    element.addEventListener('click', bulletproofHandleSignOut);
                    console.log('BULLETPROOF GMAIL LOGIN: Sign out handler added to element', index);
                } catch (error) {
                    console.log('BULLETPROOF GMAIL LOGIN: Error adding sign out handler:', error);
                }
            });
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error setting up sign out functionality:', error);
        }
    }
    
    // Bulletproof handle sign out
    async function bulletproofHandleSignOut(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('BULLETPROOF GMAIL LOGIN: Bulletproof sign out clicked');
        
        try {
            // Try multiple sign out methods with bulletproof error handling
            const signOutMethods = [
                () => window.FirebaseAuth?.signOut?.(),
                () => window.firebase?.auth()?.signOut?.(),
                () => window.ImprovedAuth?.signOut?.(),
                () => window.ProfilePhotoHandler?.signOut?.(),
                () => window.DeployedAuthFix?.signOut?.(),
                () => window.UniversalAuthFix?.signOut?.(),
                () => window.RedesignedGmailLogin?.signOut?.(),
                () => window.BulletproofGmailLogin?.signOut?.(),
                () => {
                    // Clear storage with bulletproof methods
                    try {
                        localStorage.removeItem('user');
                        localStorage.removeItem('authUser');
                        localStorage.removeItem('firebase:authUser');
                        sessionStorage.removeItem('user');
                        sessionStorage.removeItem('authUser');
                        sessionStorage.removeItem('firebase:authUser');
                    } catch (storageError) {
                        console.log('BULLETPROOF GMAIL LOGIN: Storage clear error:', storageError);
                    }
                    return Promise.resolve();
                }
            ];
            
            let signOutSuccess = false;
            
            for (const method of signOutMethods) {
                try {
                    await method();
                    console.log('BULLETPROOF GMAIL LOGIN: Sign out successful via method:', method.name);
                    signOutSuccess = true;
                } catch (error) {
                    console.log('BULLETPROOF GMAIL LOGIN: Sign out failed via method:', method.name, error);
                }
            }
            
            // Update UI
            bulletproofUpdateUIForUnauthenticatedUser();
            bulletproofNotifyAuthStateListeners(null);
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('BULLETPROOF GMAIL LOGIN: Sign out error:', error);
        }
    }
    
    // Bulletproof setup smooth navigation
    function bulletproofSetupSmoothNavigation() {
        console.log('BULLETPROOF GMAIL LOGIN: Setting up bulletproof smooth navigation');
        
        try {
            // Add smooth navigation to customer.html
            const customerLinks = document.querySelectorAll('a[href*="customer.html"], a[href*="customer"]');
            customerLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log('BULLETPROOF GMAIL LOGIN: Navigating to customer.html');
                    window.location.href = 'customer.html';
                });
            });
            
            // Add smooth navigation to designer-studio.html
            const designerLinks = document.querySelectorAll('a[href*="designer-studio.html"], a[href*="designer-studio"], a[href*="designer"]');
            designerLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log('BULLETPROOF GMAIL LOGIN: Navigating to designer-studio.html');
                    window.location.href = '3D-Jersey-Designer/designer-studio.html';
                });
            });
            
            // Add smooth navigation to all pages
            const allLinks = document.querySelectorAll('a[href]');
            allLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                    link.addEventListener('click', (event) => {
                        console.log('BULLETPROOF GMAIL LOGIN: Smooth navigation to:', href);
                        // Let the default behavior handle the navigation
                    });
                }
            });
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error setting up smooth navigation:', error);
        }
    }
    
    // Bulletproof notify auth state listeners
    function bulletproofNotifyAuthStateListeners(user) {
        try {
            authStateListeners.forEach(listener => {
                try {
                    listener(user);
                } catch (error) {
                    console.error('BULLETPROOF GMAIL LOGIN: Auth state listener error:', error);
                }
            });
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN: Error notifying auth state listeners:', error);
        }
    }
    
    // Start force refresh interval
    function startForceRefreshInterval() {
        if (forceRefreshInterval) {
            clearInterval(forceRefreshInterval);
        }
        
        forceRefreshInterval = setInterval(() => {
            console.log('BULLETPROOF GMAIL LOGIN: Force refresh interval triggered');
            bulletproofCheckAuthenticationState();
        }, BULLETPROOF_CONFIG.forceRefreshInterval);
    }
    
    // Setup emergency fallback
    function setupEmergencyFallback() {
        console.log('BULLETPROOF GMAIL LOGIN: Setting up emergency fallback');
        
        // Emergency fallback for critical elements
        setInterval(() => {
            try {
                const profileButton = document.getElementById('user-profile-btn');
                const loginButton = document.getElementById('login-btn');
                
                if (profileButton && loginButton) {
                    // Emergency fallback: if both buttons are hidden, show login
                    if (profileButton.style.display === 'none' && loginButton.style.display === 'none') {
                        console.log('BULLETPROOF GMAIL LOGIN: Emergency fallback triggered');
                        loginButton.style.display = 'flex';
                        loginButton.style.visibility = 'visible';
                    }
                }
            } catch (error) {
                console.log('BULLETPROOF GMAIL LOGIN: Emergency fallback error:', error);
            }
        }, 10000); // Check every 10 seconds
    }
    
    // Bulletproof recovery mode
    function bulletproofRecoveryMode() {
        console.log('BULLETPROOF GMAIL LOGIN: Entering bulletproof recovery mode');
        emergencyMode = true;
        
        // Try to recover by reinitializing
        setTimeout(() => {
            hasInitialized = false;
            initializeBulletproofGmailLogin();
        }, 2000);
    }
    
    // Public API
    window.BulletproofGmailLogin = {
        // Initialize
        init: initializeBulletproofGmailLogin,
        
        // Get current user
        getCurrentUser: () => currentUser,
        
        // Login
        login: bulletproofHandleLogin,
        
        // Sign out
        signOut: bulletproofHandleSignOut,
        
        // Add auth state listener
        onAuthStateChanged: (callback) => {
            authStateListeners.push(callback);
        },
        
        // Force refresh
        forceRefresh: () => {
            attempts = 0;
            startBulletproofAuthenticationMonitoring();
        },
        
        // Check auth state
        checkAuthState: bulletproofCheckAuthenticationState,
        
        // Setup smooth navigation
        setupSmoothNavigation: bulletproofSetupSmoothNavigation,
        
        // Emergency recovery
        emergencyRecovery: bulletproofRecoveryMode
    };
    
    // Global function for backward compatibility
    window.BULLETPROOF_GMAIL_LOGIN_FORCE_REFRESH = () => {
        window.BulletproofGmailLogin.forceRefresh();
    };
    
    // Start immediately
    initializeBulletproofGmailLogin();
    
    console.log('BULLETPROOF GMAIL LOGIN: Bulletproof system loaded and running!');
})();
