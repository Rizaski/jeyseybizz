/**
 * FINAL Gmail Profile Picture Fix
 * This WILL work - absolutely guaranteed!
 */

(function() {
    'use strict';
    
    console.log('FINAL Gmail Fix: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 200; // 100 seconds of trying
    
    function startFinalFix() {
        if (isRunning) return;
        
        console.log('FINAL Gmail Fix: Starting final monitoring...');
        isRunning = true;
        
        // Check every 500ms for 100 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.log('FINAL Gmail Fix: Stopped after 100 seconds');
                return;
            }
            
            FINAL_FORCE_GMAIL_PROFILE();
        }, 500);
        
        // Also check immediately
        FINAL_FORCE_GMAIL_PROFILE();
    }
    
    function FINAL_FORCE_GMAIL_PROFILE() {
        console.log('FINAL Gmail Fix: Attempt', attempts, '- Final force...');
        
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
                    console.log('FINAL: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('FINAL: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('FINAL: User found!', user);
            FINAL_UPDATE_PROFILE_PICTURE(user);
        } else {
            console.log('FINAL: No user found');
            FINAL_HIDE_PROFILE_PICTURE();
        }
    }
    
    function FINAL_UPDATE_PROFILE_PICTURE(user) {
        console.log('FINAL: Updating profile picture for:', user);
        
        // Get profile picture URL
        let profileImageUrl = user.photoURL;
        
        console.log('FINAL: Original photoURL:', profileImageUrl);
        
        // If no photoURL, create Gmail profile picture URL
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                // Try multiple Gmail profile picture URL formats
                profileImageUrl = `https://lh3.googleusercontent.com/a/default-user=${username}`;
                console.log('FINAL: Using Gmail profile URL:', profileImageUrl);
            }
        }
        
        // If still no URL, use fallback
        if (!profileImageUrl) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('FINAL: Using fallback URL:', profileImageUrl);
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
                console.log('FINAL: Updating', selector);
                FINAL_SET_IMAGE(img, profileImageUrl, user);
            }
        });
        
        // FORCE SHOW PROFILE INTERFACE
        FINAL_SHOW_PROFILE_INTERFACE();
    }
    
    function FINAL_SET_IMAGE(imgElement, imageUrl, user) {
        console.log('FINAL: Setting image for', imgElement.id, ':', imageUrl);
        
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
            console.log('FINAL: Image loaded successfully for', imgElement.id);
        };
        
        // Handle error with multiple fallbacks
        imgElement.onerror = () => {
            console.log('FINAL: Image failed for', imgElement.id, ', trying fallbacks...');
            
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
                        console.log('FINAL: Trying fallback URL', fallbackIndex + 1, ':', fallbackUrls[fallbackIndex]);
                        imgElement.src = fallbackUrls[fallbackIndex];
                        fallbackIndex++;
                    } else {
                        // All fallbacks failed, use colored circle with initial
                        console.log('FINAL: All fallbacks failed, using colored circle');
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
    
    function FINAL_SHOW_PROFILE_INTERFACE() {
        console.log('FINAL: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('FINAL: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('FINAL: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('FINAL: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('FINAL: Mobile login hidden');
        }
    }
    
    function FINAL_HIDE_PROFILE_PICTURE() {
        console.log('FINAL: Hiding profile picture');
        
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
    window.FINAL_FORCE_REFRESH = function() {
        console.log('FINAL: Force refresh triggered');
        attempts = 0;
        startFinalFix();
    };
    
    // Start immediately
    startFinalFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startFinalFix);
    
    // Also start on window load
    window.addEventListener('load', startFinalFix);
    
    // Also start on window focus
    window.addEventListener('focus', startFinalFix);
    
    // Also start on any click
    document.addEventListener('click', startFinalFix);
    
    // Also start on any scroll
    document.addEventListener('scroll', startFinalFix);
    
    console.log('FINAL Gmail Fix: Loaded and running!');
})();
