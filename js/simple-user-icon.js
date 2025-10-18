/**
 * Simple User Icon
 * Just sets a user icon - no profile picture loading attempts
 */

(function() {
    'use strict';
    
    console.log('Simple User Icon: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 10; // 5 seconds of trying
    let hasSetIcon = false;
    
    function startSimpleUserIcon() {
        if (isRunning) return;
        
        console.log('Simple User Icon: Starting simple monitoring...');
        isRunning = true;
        
        // Check every 500ms for 5 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts || hasSetIcon) {
                clearInterval(interval);
                console.log('Simple User Icon: Stopped after 5 seconds or icon set');
                return;
            }
            
            SIMPLE_CHECK_USER();
        }, 500);
        
        // Also check immediately
        SIMPLE_CHECK_USER();
    }
    
    function SIMPLE_CHECK_USER() {
        console.log('Simple User Icon: Attempt', attempts, '- Checking user...');
        
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
                    console.log('Simple User Icon: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('Simple User Icon: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('Simple User Icon: User found!', user);
            SIMPLE_SET_USER_ICON(user);
        } else {
            console.log('Simple User Icon: No user found');
            SIMPLE_HIDE_USER_ICON();
        }
    }
    
    function SIMPLE_SET_USER_ICON(user) {
        if (hasSetIcon) {
            console.log('Simple User Icon: Icon already set, skipping');
            return;
        }
        
        console.log('Simple User Icon: Setting user icon for:', user);
        
        // Get user initial for icon
        const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
        
        // Set user icon on all profile images
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('Simple User Icon: Setting', selector, 'with user icon');
                SIMPLE_SET_ICON(img, initial);
            }
        });
        
        // Show profile interface
        SIMPLE_SHOW_PROFILE_INTERFACE();
        
        // Mark as set to prevent loops
        hasSetIcon = true;
    }
    
    function SIMPLE_SET_ICON(imgElement, initial) {
        console.log('Simple User Icon: Setting icon for', imgElement.id, ':', initial);
        
        // Clear any existing handlers and sources
        imgElement.onerror = null;
        imgElement.onload = null;
        imgElement.src = '';
        
        // Set user icon immediately - no loading, no network requests
        imgElement.style.backgroundColor = '#ff0040';
        imgElement.style.color = 'white';
        imgElement.style.display = 'flex';
        imgElement.style.alignItems = 'center';
        imgElement.style.justifyContent = 'center';
        imgElement.style.fontWeight = 'bold';
        imgElement.style.fontSize = '16px';
        imgElement.style.width = '32px';
        imgElement.style.height = '32px';
        imgElement.style.borderRadius = '50%';
        imgElement.style.border = '2px solid #ff0040';
        imgElement.textContent = initial;
        
        // Remove any loading classes
        imgElement.classList.remove('loading', 'spinner', 'loading-spinner', 'loading-state');
        
        console.log('Simple User Icon: Icon set for', imgElement.id);
    }
    
    function SIMPLE_SHOW_PROFILE_INTERFACE() {
        console.log('Simple User Icon: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('Simple User Icon: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('Simple User Icon: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('Simple User Icon: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('Simple User Icon: Mobile login hidden');
        }
    }
    
    function SIMPLE_HIDE_USER_ICON() {
        console.log('Simple User Icon: Hiding user icon');
        
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
    window.SIMPLE_USER_ICON_REFRESH = function() {
        console.log('Simple User Icon: Force refresh triggered');
        hasSetIcon = false;
        attempts = 0;
        startSimpleUserIcon();
    };
    
    // Start immediately
    startSimpleUserIcon();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startSimpleUserIcon);
    
    // Also start on window load
    window.addEventListener('load', startSimpleUserIcon);
    
    // Also start on window focus
    window.addEventListener('focus', startSimpleUserIcon);
    
    console.log('Simple User Icon: Loaded and running!');
})();
