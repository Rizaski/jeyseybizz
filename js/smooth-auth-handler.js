/**
 * Smooth Authentication Handler
 * Makes authentication work perfectly and smoothly
 */

(function() {
    'use strict';
    
    console.log('Smooth Auth Handler: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 100; // 50 seconds of trying
    
    function startSmoothAuth() {
        if (isRunning) return;
        
        console.log('Smooth Auth Handler: Starting smooth monitoring...');
        isRunning = true;
        
        // Check every 500ms for 50 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.log('Smooth Auth Handler: Stopped after 50 seconds');
                return;
            }
            
            SMOOTH_CHECK_AUTH();
        }, 500);
        
        // Also check immediately
        SMOOTH_CHECK_AUTH();
    }
    
    function SMOOTH_CHECK_AUTH() {
        console.log('Smooth Auth Handler: Attempt', attempts, '- Checking auth...');
        
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
                    console.log('Smooth Auth: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('Smooth Auth: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('Smooth Auth: User found!', user);
            SMOOTH_UPDATE_UI(user);
        } else {
            console.log('Smooth Auth: No user found');
            SMOOTH_HIDE_UI();
        }
    }
    
    function SMOOTH_UPDATE_UI(user) {
        console.log('Smooth Auth: Updating UI for user:', user);
        
        // Get profile picture URL
        let profileImageUrl = user.photoURL;
        
        console.log('Smooth Auth: Original photoURL:', profileImageUrl);
        
        // If no photoURL, create Gmail profile picture URL
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                // Try multiple Gmail profile picture URL formats
                profileImageUrl = `https://lh3.googleusercontent.com/a/default-user=${username}`;
                console.log('Smooth Auth: Using Gmail profile URL:', profileImageUrl);
            }
        }
        
        // If still no URL, use fallback
        if (!profileImageUrl) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('Smooth Auth: Using fallback URL:', profileImageUrl);
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
                console.log('Smooth Auth: Updating', selector);
                SMOOTH_SET_IMAGE(img, profileImageUrl, user);
            }
        });
        
        // FORCE SHOW PROFILE INTERFACE
        SMOOTH_SHOW_PROFILE_INTERFACE();
    }
    
    function SMOOTH_SET_IMAGE(imgElement, imageUrl, user) {
        console.log('Smooth Auth: Setting image for', imgElement.id, ':', imageUrl);
        
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
            console.log('Smooth Auth: Image loaded successfully for', imgElement.id);
        };
        
        // Handle error with multiple fallbacks
        imgElement.onerror = () => {
            console.log('Smooth Auth: Image failed for', imgElement.id, ', trying fallbacks...');
            
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
                        console.log('Smooth Auth: Trying fallback URL', fallbackIndex + 1, ':', fallbackUrls[fallbackIndex]);
                        imgElement.src = fallbackUrls[fallbackIndex];
                        fallbackIndex++;
                    } else {
                        // All fallbacks failed, use colored circle with initial
                        console.log('Smooth Auth: All fallbacks failed, using colored circle');
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
    
    function SMOOTH_SHOW_PROFILE_INTERFACE() {
        console.log('Smooth Auth: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('Smooth Auth: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('Smooth Auth: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('Smooth Auth: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('Smooth Auth: Mobile login hidden');
        }
    }
    
    function SMOOTH_HIDE_UI() {
        console.log('Smooth Auth: Hiding UI');
        
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
    window.SMOOTH_FORCE_REFRESH = function() {
        console.log('Smooth Auth: Force refresh triggered');
        attempts = 0;
        startSmoothAuth();
    };
    
    // Start immediately
    startSmoothAuth();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startSmoothAuth);
    
    // Also start on window load
    window.addEventListener('load', startSmoothAuth);
    
    // Also start on window focus
    window.addEventListener('focus', startSmoothAuth);
    
    // Also start on any click
    document.addEventListener('click', startSmoothAuth);
    
    // Also start on any scroll
    document.addEventListener('scroll', startSmoothAuth);
    
    console.log('Smooth Auth Handler: Loaded and running!');
})();
