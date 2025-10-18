/**
 * GMAIL USER INFO FIX
 * Fixes Gmail user information display and sign out functionality
 */

(function() {
    'use strict';
    
    console.log('GMAIL USER INFO FIX: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 40; // 20 seconds of trying
    let hasSetUserInfo = false;
    
    function startGmailUserInfoFix() {
        if (isRunning) return;
        
        console.log('GMAIL USER INFO FIX: Starting Gmail user info monitoring...');
        isRunning = true;
        
        // Check every 500ms for 20 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts || hasSetUserInfo) {
                clearInterval(interval);
                console.log('GMAIL USER INFO FIX: Stopped after 20 seconds or user info set');
                return;
            }
            
            GMAIL_USER_INFO_CHECK();
        }, 500);
        
        // Also check immediately
        GMAIL_USER_INFO_CHECK();
    }
    
    function GMAIL_USER_INFO_CHECK() {
        console.log('GMAIL USER INFO FIX: Attempt', attempts, '- Checking Gmail user info...');
        
        // Get current user from ANY possible source
        let user = null;
        
        // Try ALL possible authentication methods
        const authMethods = [
            () => window.FirebaseAuth?.getCurrentUser?.(),
            () => window.ImprovedAuth?.getCurrentUser?.(),
            () => window.ProfilePhotoHandler?.authState,
            () => window.DeployedAuthFix?.getCurrentUser?.(),
            () => window.UniversalAuthFix?.currentUser,
            () => window.FirebaseAuth?.currentUser,
            () => window.firebase?.auth()?.currentUser,
            () => {
                try {
                    const storedUser = localStorage.getItem('user');
                    return storedUser ? JSON.parse(storedUser) : null;
                } catch (e) { return null; }
            },
            () => {
                try {
                    const sessionUser = sessionStorage.getItem('user');
                    return sessionUser ? JSON.parse(sessionUser) : null;
                } catch (e) { return null; }
            }
        ];
        
        for (const method of authMethods) {
            try {
                const result = method();
                if (result && result.email) {
                    user = result;
                    console.log('GMAIL USER INFO FIX: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('GMAIL USER INFO FIX: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('GMAIL USER INFO FIX: User found!', user);
            GMAIL_SET_USER_INFO(user);
        } else {
            console.log('GMAIL USER INFO FIX: No user found');
            GMAIL_HIDE_USER_INFO();
        }
    }
    
    function GMAIL_SET_USER_INFO(user) {
        if (hasSetUserInfo) {
            console.log('GMAIL USER INFO FIX: User info already set, skipping');
            return;
        }
        
        console.log('GMAIL USER INFO FIX: Setting Gmail user info for:', user);
        
        // Get user information
        const displayName = user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'User');
        const email = user.email || 'user@example.com';
        const photoURL = user.photoURL || user.avatar || '';
        
        console.log('GMAIL USER INFO FIX: User info:', { displayName, email, photoURL });
        
        // Update all user name elements
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
                console.log('GMAIL USER INFO FIX: Updated', selector, 'with name:', displayName);
            });
        });
        
        // Update all user email elements
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
                console.log('GMAIL USER INFO FIX: Updated', selector, 'with email:', email);
            });
        });
        
        // Update all profile images
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('GMAIL USER INFO FIX: Setting', selector, 'with profile image');
                GMAIL_SET_IMAGE(img, photoURL, user);
            }
        });
        
        // Show profile interface
        GMAIL_SHOW_PROFILE_INTERFACE();
        
        // Setup sign out functionality
        GMAIL_SETUP_SIGNOUT();
        
        // Mark as set to prevent loops
        hasSetUserInfo = true;
    }
    
    function GMAIL_SET_IMAGE(imgElement, imageUrl, user) {
        console.log('GMAIL USER INFO FIX: Setting image for', imgElement.id, ':', imageUrl);
        
        // Clear any existing handlers
        imgElement.onerror = null;
        imgElement.onload = null;
        
        // Set the image
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
                console.log('GMAIL USER INFO FIX: Image loaded successfully for', imgElement.id);
            };
            
            // Handle error with fallback
            imgElement.onerror = () => {
                console.log('GMAIL USER INFO FIX: Image failed for', imgElement.id, ', using fallback');
                GMAIL_SET_FALLBACK_IMAGE(imgElement, user);
            };
        } else {
            GMAIL_SET_FALLBACK_IMAGE(imgElement, user);
        }
    }
    
    function GMAIL_SET_FALLBACK_IMAGE(imgElement, user) {
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
    
    function GMAIL_SHOW_PROFILE_INTERFACE() {
        console.log('GMAIL USER INFO FIX: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('GMAIL USER INFO FIX: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('GMAIL USER INFO FIX: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('GMAIL USER INFO FIX: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('GMAIL USER INFO FIX: Mobile login hidden');
        }
    }
    
    function GMAIL_SETUP_SIGNOUT() {
        console.log('GMAIL USER INFO FIX: Setting up sign out functionality');
        
        // Find all sign out buttons and links
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
            '[data-log-out]',
            'button[onclick*="signOut"]',
            'button[onclick*="logout"]',
            'a[onclick*="signOut"]',
            'a[onclick*="logout"]'
        ];
        
        let signOutElements = [];
        
        signOutSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                signOutElements.push(element);
            });
        });
        
        // Also look for any element with text containing "sign out", "logout", etc.
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = element.textContent?.toLowerCase() || '';
            if (text.includes('sign out') || text.includes('logout') || text.includes('log out')) {
                if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'DIV') {
                    signOutElements.push(element);
                }
            }
        });
        
        console.log('GMAIL USER INFO FIX: Found', signOutElements.length, 'sign out elements');
        
        signOutElements.forEach((element, index) => {
            console.log('GMAIL USER INFO FIX: Setting up element', index, ':', element);
            
            // Remove any existing event listeners
            element.removeEventListener('click', handleGmailSignOut);
            
            // Add new event listener
            element.addEventListener('click', handleGmailSignOut);
            
            // Also add onclick handler as backup
            element.onclick = handleGmailSignOut;
            
            console.log('GMAIL USER INFO FIX: Sign out handler added to element', index);
        });
    }
    
    function handleGmailSignOut(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('GMAIL USER INFO FIX: Gmail sign out clicked!');
        
        // Try all possible sign out methods
        const signOutMethods = [
            () => window.FirebaseAuth?.signOut?.(),
            () => window.ImprovedAuth?.signOut?.(),
            () => window.ProfilePhotoHandler?.signOut?.(),
            () => window.DeployedAuthFix?.signOut?.(),
            () => window.UniversalAuthFix?.signOut?.(),
            () => window.firebase?.auth()?.signOut?.(),
            () => {
                // Clear local storage
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
                const result = method();
                if (result && typeof result.then === 'function') {
                    result.then(() => {
                        console.log('GMAIL USER INFO FIX: Sign out successful via method:', method.name);
                        signOutSuccess = true;
                        handleGmailSignOutSuccess();
                    }).catch(error => {
                        console.log('GMAIL USER INFO FIX: Sign out failed via method:', method.name, error);
                    });
                } else {
                    console.log('GMAIL USER INFO FIX: Sign out successful via method:', method.name);
                    signOutSuccess = true;
                    handleGmailSignOutSuccess();
                }
            } catch (error) {
                console.log('GMAIL USER INFO FIX: Sign out failed via method:', method.name, error);
            }
        }
        
        // If no method worked, try manual sign out
        if (!signOutSuccess) {
            console.log('GMAIL USER INFO FIX: Trying manual sign out...');
            handleGmailSignOutSuccess();
        }
    }
    
    function handleGmailSignOutSuccess() {
        console.log('GMAIL USER INFO FIX: Gmail sign out successful, updating UI...');
        
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
        
        // Clear profile images
        const profileImages = [
            document.getElementById('user-profile-image'),
            document.getElementById('dropdown-profile-image'),
            document.getElementById('mobile-user-profile-image')
        ];
        
        profileImages.forEach(img => {
            if (img) {
                img.src = '';
                img.style.display = 'none';
                img.style.visibility = 'hidden';
            }
        });
        
        // Clear user info
        const userNameElements = document.querySelectorAll('#dropdown-user-name, #mobile-user-name, .user-name, [data-user-name]');
        userNameElements.forEach(element => {
            element.textContent = 'User';
        });
        
        const userEmailElements = document.querySelectorAll('#dropdown-user-email, #mobile-user-email, .user-email, [data-user-email]');
        userEmailElements.forEach(element => {
            element.textContent = 'user@example.com';
        });
        
        // Close any open dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-menu, .profile-dropdown, #user-dropdown, .user-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
            dropdown.style.visibility = 'hidden';
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
        });
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
        console.log('GMAIL USER INFO FIX: UI updated after Gmail sign out');
    }
    
    function GMAIL_HIDE_USER_INFO() {
        console.log('GMAIL USER INFO FIX: Hiding user info');
        
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
    
    // Global function to force refresh
    window.GMAIL_USER_INFO_FORCE_REFRESH = function() {
        console.log('GMAIL USER INFO FIX: Force refresh triggered');
        hasSetUserInfo = false;
        attempts = 0;
        startGmailUserInfoFix();
    };
    
    // Start immediately
    startGmailUserInfoFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startGmailUserInfoFix);
    
    // Also start on window load
    window.addEventListener('load', startGmailUserInfoFix);
    
    // Also start on window focus
    window.addEventListener('focus', startGmailUserInfoFix);
    
    // Also start on any click
    document.addEventListener('click', startGmailUserInfoFix);
    
    console.log('GMAIL USER INFO FIX: Loaded and running!');
})();
