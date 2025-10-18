/**
 * Clean Gmail Profile Picture Loader
 * Clean, focused solution for Gmail profile pictures
 */

(function() {
    'use strict';
    
    console.log('Clean Gmail Profile: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds of trying
    let hasSetProfile = false;
    
    function startCleanGmailProfile() {
        if (isRunning) return;
        
        console.log('Clean Gmail Profile: Starting clean monitoring...');
        isRunning = true;
        
        // Check every 500ms for 10 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts || hasSetProfile) {
                clearInterval(interval);
                console.log('Clean Gmail Profile: Stopped after 10 seconds or profile set');
                return;
            }
            
            CLEAN_CHECK_GMAIL_USER();
        }, 500);
        
        // Also check immediately
        CLEAN_CHECK_GMAIL_USER();
    }
    
    function CLEAN_CHECK_GMAIL_USER() {
        console.log('Clean Gmail Profile: Attempt', attempts, '- Checking Gmail user...');
        
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
                    console.log('Clean Gmail Profile: Found user via method:', method.name);
                    break;
                }
            } catch (e) {
                console.log('Clean Gmail Profile: Method failed:', method.name);
            }
        }
        
        if (user && user.email) {
            console.log('Clean Gmail Profile: User found!', user);
            CLEAN_SET_GMAIL_PROFILE(user);
        } else {
            console.log('Clean Gmail Profile: No user found');
            CLEAN_HIDE_PROFILE();
        }
    }
    
    function CLEAN_SET_GMAIL_PROFILE(user) {
        if (hasSetProfile) {
            console.log('Clean Gmail Profile: Profile already set, skipping');
            return;
        }
        
        console.log('Clean Gmail Profile: Setting Gmail profile for:', user);
        
        // Get Gmail profile picture URL
        let profileImageUrl = user.photoURL;
        
        console.log('Clean Gmail Profile: Original photoURL:', profileImageUrl);
        
        // If no photoURL, try to construct Gmail profile picture URL
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                // Try Gmail profile picture URL
                profileImageUrl = `https://lh3.googleusercontent.com/a/default-user=${username}`;
                console.log('Clean Gmail Profile: Using Gmail profile URL:', profileImageUrl);
            }
        }
        
        // If still no URL, use fallback
        if (!profileImageUrl) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('Clean Gmail Profile: Using fallback URL:', profileImageUrl);
        }
        
        // Set profile images
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('Clean Gmail Profile: Setting', selector, 'with profile image');
                CLEAN_SET_IMAGE(img, profileImageUrl, user);
            }
        });
        
        // Show profile interface
        CLEAN_SHOW_PROFILE_INTERFACE();
        
        // Mark as set to prevent loops
        hasSetProfile = true;
    }
    
    function CLEAN_SET_IMAGE(imgElement, imageUrl, user) {
        console.log('Clean Gmail Profile: Setting image for', imgElement.id, ':', imageUrl);
        
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
            console.log('Clean Gmail Profile: Image loaded successfully for', imgElement.id);
        };
        
        // Handle error with fallback
        imgElement.onerror = () => {
            console.log('Clean Gmail Profile: Image failed for', imgElement.id, ', using fallback');
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
    
    function CLEAN_SHOW_PROFILE_INTERFACE() {
        console.log('Clean Gmail Profile: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
            console.log('Clean Gmail Profile: Profile button shown');
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
            console.log('Clean Gmail Profile: Login button hidden');
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
            console.log('Clean Gmail Profile: Mobile user profile shown');
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
            console.log('Clean Gmail Profile: Mobile login hidden');
        }
    }
    
    function CLEAN_HIDE_PROFILE() {
        console.log('Clean Gmail Profile: Hiding profile');
        
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
    window.CLEAN_GMAIL_PROFILE_REFRESH = function() {
        console.log('Clean Gmail Profile: Force refresh triggered');
        hasSetProfile = false;
        attempts = 0;
        startCleanGmailProfile();
    };
    
    // Start immediately
    startCleanGmailProfile();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startCleanGmailProfile);
    
    // Also start on window load
    window.addEventListener('load', startCleanGmailProfile);
    
    // Also start on window focus
    window.addEventListener('focus', startCleanGmailProfile);
    
    console.log('Clean Gmail Profile: Loaded and running!');
})();
