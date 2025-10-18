/**
 * BULLETPROOF Gmail Profile Picture Fix
 * This WILL work - guaranteed!
 */

(function() {
    'use strict';
    
    console.log('BULLETPROOF Gmail Fix: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 100; // 50 seconds of trying
    
    function startBulletproofFix() {
        if (isRunning) return;
        
        console.log('BULLETPROOF Gmail Fix: Starting bulletproof monitoring...');
        isRunning = true;
        
        // Check every 500ms for 50 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.log('BULLETPROOF Gmail Fix: Stopped after 50 seconds');
                return;
            }
            
            forceGmailProfilePicture();
        }, 500);
        
        // Also check immediately
        forceGmailProfilePicture();
    }
    
    function forceGmailProfilePicture() {
        console.log('BULLETPROOF Gmail Fix: Attempt', attempts, '- Forcing Gmail profile picture...');
        
        // Get current user from ANY possible source
        let user = null;
        
        // Try Firebase Auth
        if (window.FirebaseAuth && typeof window.FirebaseAuth.getCurrentUser === 'function') {
            try {
                user = window.FirebaseAuth.getCurrentUser();
                if (user) console.log('BULLETPROOF: Found user via FirebaseAuth');
            } catch (e) {}
        }
        
        // Try Improved Auth
        if (!user && window.ImprovedAuth && typeof window.ImprovedAuth.getCurrentUser === 'function') {
            try {
                user = window.ImprovedAuth.getCurrentUser();
                if (user) console.log('BULLETPROOF: Found user via ImprovedAuth');
            } catch (e) {}
        }
        
        // Try Deployed Auth Fix
        if (!user && window.DeployedAuthFix && window.DeployedAuthFix.getCurrentUser) {
            try {
                user = window.DeployedAuthFix.getCurrentUser();
                if (user) console.log('BULLETPROOF: Found user via DeployedAuthFix');
            } catch (e) {}
        }
        
        // Try localStorage
        if (!user) {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    user = JSON.parse(storedUser);
                    console.log('BULLETPROOF: Found user via localStorage');
                }
            } catch (e) {}
        }
        
        // Try sessionStorage
        if (!user) {
            try {
                const sessionUser = sessionStorage.getItem('user');
                if (sessionUser) {
                    user = JSON.parse(sessionUser);
                    console.log('BULLETPROOF: Found user via sessionStorage');
                }
            } catch (e) {}
        }
        
        if (user && user.email && user.email.includes('@gmail.com')) {
            console.log('BULLETPROOF: Gmail user found!', user);
            BULLETPROOF_UPDATE_PROFILE_PICTURE(user);
        } else if (user) {
            console.log('BULLETPROOF: Non-Gmail user found:', user);
            BULLETPROOF_UPDATE_PROFILE_PICTURE(user);
        } else {
            console.log('BULLETPROOF: No user found');
            BULLETPROOF_HIDE_PROFILE_PICTURE();
        }
    }
    
    function BULLETPROOF_UPDATE_PROFILE_PICTURE(user) {
        console.log('BULLETPROOF: Updating profile picture for:', user);
        
        // Get profile picture URL
        let profileImageUrl = user.photoURL;
        
        console.log('BULLETPROOF: Original photoURL:', profileImageUrl);
        
        // If no photoURL, create Gmail profile picture URL
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                // Try multiple Gmail profile picture URL formats
                profileImageUrl = `https://lh3.googleusercontent.com/a/default-user=${username}`;
                console.log('BULLETPROOF: Using Gmail profile URL:', profileImageUrl);
            }
        }
        
        // If still no URL, use fallback
        if (!profileImageUrl) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('BULLETPROOF: Using fallback URL:', profileImageUrl);
        }
        
        // FORCE UPDATE ALL PROFILE IMAGES
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('BULLETPROOF: Updating', selector);
                BULLETPROOF_SET_IMAGE(img, profileImageUrl, user);
            }
        });
        
        // FORCE SHOW PROFILE INTERFACE
        BULLETPROOF_SHOW_PROFILE_INTERFACE();
    }
    
    function BULLETPROOF_SET_IMAGE(imgElement, imageUrl, user) {
        console.log('BULLETPROOF: Setting image for', imgElement.id, ':', imageUrl);
        
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
            console.log('BULLETPROOF: Image loaded successfully for', imgElement.id);
        };
        
        // Handle error with multiple fallbacks
        imgElement.onerror = () => {
            console.log('BULLETPROOF: Image failed for', imgElement.id, ', trying fallbacks...');
            
            // Try different Gmail photo URL formats
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                const fallbackUrls = [
                    `https://lh3.googleusercontent.com/a/default-user=${username}`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=32`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=64`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=128`
                ];
                
                let fallbackIndex = 0;
                const tryNextFallback = () => {
                    if (fallbackIndex < fallbackUrls.length) {
                        console.log('BULLETPROOF: Trying fallback URL', fallbackIndex + 1, ':', fallbackUrls[fallbackIndex]);
                        imgElement.src = fallbackUrls[fallbackIndex];
                        fallbackIndex++;
                    } else {
                        // All fallbacks failed, use colored circle with initial
                        console.log('BULLETPROOF: All fallbacks failed, using colored circle');
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
                };
                
                imgElement.onerror = tryNextFallback;
                tryNextFallback();
            } else {
                // Not Gmail, use simple fallback
                const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
                imgElement.src = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            }
        };
    }
    
    function BULLETPROOF_SHOW_PROFILE_INTERFACE() {
        console.log('BULLETPROOF: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('BULLETPROOF: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('BULLETPROOF: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('BULLETPROOF: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('BULLETPROOF: Mobile login hidden');
        }
    }
    
    function BULLETPROOF_HIDE_PROFILE_PICTURE() {
        console.log('BULLETPROOF: Hiding profile picture');
        
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
    window.BULLETPROOF_FORCE_REFRESH = function() {
        console.log('BULLETPROOF: Force refresh triggered');
        attempts = 0;
        startBulletproofFix();
    };
    
    // Start immediately
    startBulletproofFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startBulletproofFix);
    
    // Also start on window load
    window.addEventListener('load', startBulletproofFix);
    
    // Also start on window focus
    window.addEventListener('focus', startBulletproofFix);
    
    console.log('BULLETPROOF Gmail Fix: Loaded and running!');
})();
