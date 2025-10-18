/**
 * User Icon Fix
 * Shows user icon instead of Gmail profile picture
 */

(function() {
    'use strict';
    
    console.log('User Icon Fix: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 100; // 50 seconds of trying
    
    function startUserIconFix() {
        if (isRunning) return;
        
        console.log('User Icon Fix: Starting user icon monitoring...');
        isRunning = true;
        
        // Check every 500ms for 50 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.log('User Icon Fix: Stopped after 50 seconds');
                return;
            }
            
            USER_ICON_CHECK_AUTH();
        }, 500);
        
        // Also check immediately
        USER_ICON_CHECK_AUTH();
    }
    
    function USER_ICON_CHECK_AUTH() {
        console.log('User Icon Fix: Attempt', attempts, '- Checking auth...');
        
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
                    console.log('User Icon Fix: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('User Icon Fix: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('User Icon Fix: User found!', user);
            USER_ICON_UPDATE_UI(user);
        } else {
            console.log('User Icon Fix: No user found');
            USER_ICON_HIDE_UI();
        }
    }
    
    function USER_ICON_UPDATE_UI(user) {
        console.log('User Icon Fix: Updating UI for user:', user);
        
        // Get user initial for icon
        const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
        
        // FORCE UPDATE ALL PROFILE IMAGES WITH USER ICON
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('User Icon Fix: Updating', selector, 'with user icon');
                USER_ICON_SET_IMAGE(img, initial, user);
            }
        });
        
        // FORCE SHOW PROFILE INTERFACE
        USER_ICON_SHOW_PROFILE_INTERFACE();
    }
    
    function USER_ICON_SET_IMAGE(imgElement, initial, user) {
        console.log('User Icon Fix: Setting user icon for', imgElement.id, ':', initial);
        
        // Clear any existing handlers
        imgElement.onerror = null;
        imgElement.onload = null;
        
        // Set user icon instead of profile picture
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
        imgElement.src = '';
        
        console.log('User Icon Fix: User icon set for', imgElement.id);
    }
    
    function USER_ICON_SHOW_PROFILE_INTERFACE() {
        console.log('User Icon Fix: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('User Icon Fix: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('User Icon Fix: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('User Icon Fix: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('User Icon Fix: Mobile login hidden');
        }
    }
    
    function USER_ICON_HIDE_UI() {
        console.log('User Icon Fix: Hiding UI');
        
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
    window.USER_ICON_FORCE_REFRESH = function() {
        console.log('User Icon Fix: Force refresh triggered');
        attempts = 0;
        startUserIconFix();
    };
    
    // Start immediately
    startUserIconFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startUserIconFix);
    
    // Also start on window load
    window.addEventListener('load', startUserIconFix);
    
    // Also start on window focus
    window.addEventListener('focus', startUserIconFix);
    
    // Also start on any click
    document.addEventListener('click', startUserIconFix);
    
    // Also start on any scroll
    document.addEventListener('scroll', startUserIconFix);
    
    console.log('User Icon Fix: Loaded and running!');
})();
