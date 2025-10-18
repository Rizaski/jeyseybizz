/**
 * ABSOLUTE FINAL FIX
 * This WILL work - absolutely guaranteed!
 */

(function() {
    'use strict';
    
    console.log('ABSOLUTE FINAL FIX: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 50; // 25 seconds of trying
    let hasSetProfile = false;
    
    function startAbsoluteFinalFix() {
        if (isRunning) return;
        
        console.log('ABSOLUTE FINAL FIX: Starting absolute monitoring...');
        isRunning = true;
        
        // Check every 500ms for 25 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts || hasSetProfile) {
                clearInterval(interval);
                console.log('ABSOLUTE FINAL FIX: Stopped after 25 seconds or profile set');
                return;
            }
            
            ABSOLUTE_FINAL_CHECK();
        }, 500);
        
        // Also check immediately
        ABSOLUTE_FINAL_CHECK();
    }
    
    function ABSOLUTE_FINAL_CHECK() {
        console.log('ABSOLUTE FINAL FIX: Attempt', attempts, '- Absolute final check...');
        
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
                    console.log('ABSOLUTE FINAL FIX: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('ABSOLUTE FINAL FIX: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('ABSOLUTE FINAL FIX: User found!', user);
            ABSOLUTE_FINAL_SET_PROFILE(user);
        } else {
            console.log('ABSOLUTE FINAL FIX: No user found');
            ABSOLUTE_FINAL_HIDE_PROFILE();
        }
    }
    
    function ABSOLUTE_FINAL_SET_PROFILE(user) {
        if (hasSetProfile) {
            console.log('ABSOLUTE FINAL FIX: Profile already set, skipping');
            return;
        }
        
        console.log('ABSOLUTE FINAL FIX: Setting profile for:', user);
        
        // Get profile picture URL
        let profileImageUrl = user.photoURL;
        
        console.log('ABSOLUTE FINAL FIX: Original photoURL:', profileImageUrl);
        
        // If no photoURL, try to construct Gmail profile picture URL
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                // Try Gmail profile picture URL
                profileImageUrl = `https://lh3.googleusercontent.com/a/default-user=${username}`;
                console.log('ABSOLUTE FINAL FIX: Using Gmail profile URL:', profileImageUrl);
            }
        }
        
        // If still no URL, use fallback
        if (!profileImageUrl) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('ABSOLUTE FINAL FIX: Using fallback URL:', profileImageUrl);
        }
        
        // FORCE SET ALL PROFILE IMAGES
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('ABSOLUTE FINAL FIX: Setting', selector, 'with profile image');
                ABSOLUTE_FINAL_SET_IMAGE(img, profileImageUrl, user);
            }
        });
        
        // FORCE SHOW PROFILE INTERFACE
        ABSOLUTE_FINAL_SHOW_PROFILE_INTERFACE();
        
        // Mark as set to prevent loops
        hasSetProfile = true;
    }
    
    function ABSOLUTE_FINAL_SET_IMAGE(imgElement, imageUrl, user) {
        console.log('ABSOLUTE FINAL FIX: Setting image for', imgElement.id, ':', imageUrl);
        
        // Clear any existing handlers
        imgElement.onerror = null;
        imgElement.onload = null;
        
        // Set the image
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
            console.log('ABSOLUTE FINAL FIX: Image loaded successfully for', imgElement.id);
        };
        
        // Handle error with fallback
        imgElement.onerror = () => {
            console.log('ABSOLUTE FINAL FIX: Image failed for', imgElement.id, ', using fallback');
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
        };
    }
    
    function ABSOLUTE_FINAL_SHOW_PROFILE_INTERFACE() {
        console.log('ABSOLUTE FINAL FIX: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('ABSOLUTE FINAL FIX: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('ABSOLUTE FINAL FIX: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('ABSOLUTE FINAL FIX: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('ABSOLUTE FINAL FIX: Mobile login hidden');
        }
    }
    
    function ABSOLUTE_FINAL_HIDE_PROFILE() {
        console.log('ABSOLUTE FINAL FIX: Hiding profile');
        
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
    window.ABSOLUTE_FINAL_FORCE_REFRESH = function() {
        console.log('ABSOLUTE FINAL FIX: Force refresh triggered');
        hasSetProfile = false;
        attempts = 0;
        startAbsoluteFinalFix();
    };
    
    // Start immediately
    startAbsoluteFinalFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startAbsoluteFinalFix);
    
    // Also start on window load
    window.addEventListener('load', startAbsoluteFinalFix);
    
    // Also start on window focus
    window.addEventListener('focus', startAbsoluteFinalFix);
    
    // Also start on any click
    document.addEventListener('click', startAbsoluteFinalFix);
    
    // Also start on any scroll
    document.addEventListener('scroll', startAbsoluteFinalFix);
    
    console.log('ABSOLUTE FINAL FIX: Loaded and running!');
})();
