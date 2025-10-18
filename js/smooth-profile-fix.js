/**
 * Smooth Profile Fix
 * Stops loading loops and makes profile pictures work smoothly
 */

(function() {
    'use strict';
    
    console.log('Smooth Profile Fix: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds of trying
    let hasSetProfile = false;
    
    function startSmoothProfileFix() {
        if (isRunning) return;
        
        console.log('Smooth Profile Fix: Starting smooth monitoring...');
        isRunning = true;
        
        // Check every 500ms for 10 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts || hasSetProfile) {
                clearInterval(interval);
                console.log('Smooth Profile Fix: Stopped after 10 seconds or profile set');
                return;
            }
            
            SMOOTH_PROFILE_CHECK();
        }, 500);
        
        // Also check immediately
        SMOOTH_PROFILE_CHECK();
    }
    
    function SMOOTH_PROFILE_CHECK() {
        console.log('Smooth Profile Fix: Attempt', attempts, '- Checking profile...');
        
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
                    console.log('Smooth Profile Fix: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('Smooth Profile Fix: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('Smooth Profile Fix: User found!', user);
            SMOOTH_SET_PROFILE(user);
        } else {
            console.log('Smooth Profile Fix: No user found');
            SMOOTH_HIDE_PROFILE();
        }
    }
    
    function SMOOTH_SET_PROFILE(user) {
        if (hasSetProfile) {
            console.log('Smooth Profile Fix: Profile already set, skipping');
            return;
        }
        
        console.log('Smooth Profile Fix: Setting profile for user:', user);
        
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
                console.log('Smooth Profile Fix: Setting', selector, 'with user icon');
                SMOOTH_SET_IMAGE(img, initial, user);
            }
        });
        
        // FORCE SHOW PROFILE INTERFACE
        SMOOTH_SHOW_PROFILE_INTERFACE();
        
        // Mark as set to prevent loops
        hasSetProfile = true;
    }
    
    function SMOOTH_SET_IMAGE(imgElement, initial, user) {
        console.log('Smooth Profile Fix: Setting image for', imgElement.id, ':', initial);
        
        // Stop any loading loops by clearing all handlers
        imgElement.onerror = null;
        imgElement.onload = null;
        
        // Set user icon immediately - no loading
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
        
        // Remove any loading indicators
        imgElement.classList.remove('loading', 'spinner');
        
        console.log('Smooth Profile Fix: User icon set for', imgElement.id);
    }
    
    function SMOOTH_SHOW_PROFILE_INTERFACE() {
        console.log('Smooth Profile Fix: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('Smooth Profile Fix: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('Smooth Profile Fix: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('Smooth Profile Fix: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('Smooth Profile Fix: Mobile login hidden');
        }
    }
    
    function SMOOTH_HIDE_PROFILE() {
        console.log('Smooth Profile Fix: Hiding profile');
        
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
    window.SMOOTH_PROFILE_FORCE_REFRESH = function() {
        console.log('Smooth Profile Fix: Force refresh triggered');
        hasSetProfile = false;
        attempts = 0;
        startSmoothProfileFix();
    };
    
    // Start immediately
    startSmoothProfileFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startSmoothProfileFix);
    
    // Also start on window load
    window.addEventListener('load', startSmoothProfileFix);
    
    // Also start on window focus
    window.addEventListener('focus', startSmoothProfileFix);
    
    console.log('Smooth Profile Fix: Loaded and running!');
})();
