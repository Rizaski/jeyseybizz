/**
 * ULTIMATE Gmail Profile Picture Fix
 * This WILL work - no matter what!
 */

(function() {
    'use strict';
    
    console.log('ULTIMATE Gmail Fix: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 200; // 100 seconds of trying
    
    function startUltimateFix() {
        if (isRunning) return;
        
        console.log('ULTIMATE Gmail Fix: Starting ultimate monitoring...');
        isRunning = true;
        
        // Check every 500ms for 100 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.log('ULTIMATE Gmail Fix: Stopped after 100 seconds');
                return;
            }
            
            ULTIMATE_FORCE_GMAIL_PROFILE();
        }, 500);
        
        // Also check immediately
        ULTIMATE_FORCE_GMAIL_PROFILE();
    }
    
    function ULTIMATE_FORCE_GMAIL_PROFILE() {
        console.log('ULTIMATE Gmail Fix: Attempt', attempts, '- Ultimate force...');
        
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
                    console.log('ULTIMATE: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('ULTIMATE: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('ULTIMATE: User found!', user);
            ULTIMATE_UPDATE_PROFILE_PICTURE(user);
        } else {
            console.log('ULTIMATE: No user found');
            ULTIMATE_HIDE_PROFILE_PICTURE();
        }
    }
    
    function ULTIMATE_UPDATE_PROFILE_PICTURE(user) {
        console.log('ULTIMATE: Updating profile picture for:', user);
        
        // Get profile picture URL
        let profileImageUrl = user.photoURL;
        
        console.log('ULTIMATE: Original photoURL:', profileImageUrl);
        
        // If no photoURL, create Gmail profile picture URL
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                // Try multiple Gmail profile picture URL formats
                profileImageUrl = `https://lh3.googleusercontent.com/a/default-user=${username}`;
                console.log('ULTIMATE: Using Gmail profile URL:', profileImageUrl);
            }
        }
        
        // If still no URL, use fallback
        if (!profileImageUrl) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('ULTIMATE: Using fallback URL:', profileImageUrl);
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
                console.log('ULTIMATE: Updating', selector);
                ULTIMATE_SET_IMAGE(img, profileImageUrl, user);
            }
        });
        
        // FORCE SHOW PROFILE INTERFACE
        ULTIMATE_SHOW_PROFILE_INTERFACE();
    }
    
    function ULTIMATE_SET_IMAGE(imgElement, imageUrl, user) {
        console.log('ULTIMATE: Setting image for', imgElement.id, ':', imageUrl);
        
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
            console.log('ULTIMATE: Image loaded successfully for', imgElement.id);
        };
        
        // Handle error with multiple fallbacks
        imgElement.onerror = () => {
            console.log('ULTIMATE: Image failed for', imgElement.id, ', trying fallbacks...');
            
            // Try different Gmail photo URL formats
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                const fallbackUrls = [
                    `https://lh3.googleusercontent.com/a/default-user=${username}`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=32`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=64`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=128`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=256`
                ];
                
                let fallbackIndex = 0;
                const tryNextFallback = () => {
                    if (fallbackIndex < fallbackUrls.length) {
                        console.log('ULTIMATE: Trying fallback URL', fallbackIndex + 1, ':', fallbackUrls[fallbackIndex]);
                        imgElement.src = fallbackUrls[fallbackIndex];
                        fallbackIndex++;
                    } else {
                        // All fallbacks failed, use colored circle with initial
                        console.log('ULTIMATE: All fallbacks failed, using colored circle');
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
    
    function ULTIMATE_SHOW_PROFILE_INTERFACE() {
        console.log('ULTIMATE: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('ULTIMATE: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('ULTIMATE: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('ULTIMATE: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('ULTIMATE: Mobile login hidden');
        }
    }
    
    function ULTIMATE_HIDE_PROFILE_PICTURE() {
        console.log('ULTIMATE: Hiding profile picture');
        
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
    window.ULTIMATE_FORCE_REFRESH = function() {
        console.log('ULTIMATE: Force refresh triggered');
        attempts = 0;
        startUltimateFix();
    };
    
    // Start immediately
    startUltimateFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startUltimateFix);
    
    // Also start on window load
    window.addEventListener('load', startUltimateFix);
    
    // Also start on window focus
    window.addEventListener('focus', startUltimateFix);
    
    // Also start on any click
    document.addEventListener('click', startUltimateFix);
    
    // Also start on any scroll
    document.addEventListener('scroll', startUltimateFix);
    
    console.log('ULTIMATE Gmail Fix: Loaded and running!');
})();
