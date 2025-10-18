/**
 * Gmail Profile Photo Fix
 * Specifically handles Gmail profile photo loading and display
 */

(function() {
    'use strict';
    
    console.log('Gmail Profile Photo Fix: Starting...');
    
    let isInitialized = false;
    let currentUser = null;
    let retryCount = 0;
    const maxRetries = 20;
    
    function initialize() {
        if (isInitialized) return;
        
        console.log('Gmail Profile Photo Fix: Initializing...');
        isInitialized = true;
        
        // Start aggressive profile photo monitoring
        startProfilePhotoMonitoring();
        
        // Also check on various events
        document.addEventListener('DOMContentLoaded', checkAndUpdateProfilePhotos);
        window.addEventListener('load', checkAndUpdateProfilePhotos);
        window.addEventListener('focus', checkAndUpdateProfilePhotos);
        
        // Check immediately
        setTimeout(checkAndUpdateProfilePhotos, 100);
        setTimeout(checkAndUpdateProfilePhotos, 500);
        setTimeout(checkAndUpdateProfilePhotos, 1000);
        setTimeout(checkAndUpdateProfilePhotos, 2000);
    }
    
    function startProfilePhotoMonitoring() {
        console.log('Gmail Profile Photo Fix: Starting profile photo monitoring...');
        
        const interval = setInterval(() => {
            checkAndUpdateProfilePhotos();
            retryCount++;
            
            if (retryCount >= maxRetries) {
                clearInterval(interval);
                console.log('Gmail Profile Photo Fix: Stopped monitoring after 20 attempts');
            }
        }, 1000);
    }
    
    async function checkAndUpdateProfilePhotos() {
        try {
            console.log('Gmail Profile Photo Fix: Checking for user authentication...');
            
            let user = null;
            
            // Try all possible authentication sources
            if (window.FirebaseAuth && typeof window.FirebaseAuth.getCurrentUser === 'function') {
                try {
                    user = await window.FirebaseAuth.getCurrentUser();
                    console.log('Gmail Profile Photo Fix: FirebaseAuth user:', user);
                } catch (e) {
                    console.log('Gmail Profile Photo Fix: FirebaseAuth error:', e);
                }
            }
            
            if (!user && window.ImprovedAuth && typeof window.ImprovedAuth.getCurrentUser === 'function') {
                try {
                    user = await window.ImprovedAuth.getCurrentUser();
                    console.log('Gmail Profile Photo Fix: ImprovedAuth user:', user);
                } catch (e) {
                    console.log('Gmail Profile Photo Fix: ImprovedAuth error:', e);
                }
            }
            
            if (!user && window.ProfilePhotoHandler && window.ProfilePhotoHandler.authState) {
                user = window.ProfilePhotoHandler.authState;
                console.log('Gmail Profile Photo Fix: ProfilePhotoHandler user:', user);
            }
            
            if (!user && window.DeployedAuthFix && window.DeployedAuthFix.getCurrentUser) {
                user = window.DeployedAuthFix.getCurrentUser();
                console.log('Gmail Profile Photo Fix: DeployedAuthFix user:', user);
            }
            
            // Check localStorage
            if (!user) {
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        user = JSON.parse(storedUser);
                        console.log('Gmail Profile Photo Fix: Stored user:', user);
                    }
                } catch (e) {
                    console.log('Gmail Profile Photo Fix: Invalid stored user:', e);
                }
            }
            
            if (user && user !== currentUser) {
                console.log('Gmail Profile Photo Fix: User found, updating profile photos:', user);
                currentUser = user;
                updateProfilePhotos(user);
            } else if (!user && currentUser) {
                console.log('Gmail Profile Photo Fix: User logged out, hiding profile');
                currentUser = null;
                hideProfilePhotos();
            }
            
        } catch (error) {
            console.error('Gmail Profile Photo Fix: Error checking profile photos:', error);
        }
    }
    
    function updateProfilePhotos(user) {
        console.log('Gmail Profile Photo Fix: Updating profile photos for user:', user);
        
        // Get the actual Gmail profile photo URL
        let profileImageUrl = user.photoURL;
        
        console.log('Gmail Profile Photo Fix: Original photoURL:', profileImageUrl);
        
        // If no photoURL, create a fallback
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('Gmail Profile Photo Fix: Using fallback image:', profileImageUrl);
        } else {
            console.log('Gmail Profile Photo Fix: Using Gmail profile image:', profileImageUrl);
        }
        
        // Update all profile images
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image', 
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log(`Gmail Profile Photo Fix: Updating ${selector}`);
                setProfileImage(img, profileImageUrl, user);
            }
        });
        
        // Show profile button, hide login button
        showProfileInterface();
    }
    
    function setProfileImage(imgElement, imageUrl, user) {
        console.log(`Gmail Profile Photo Fix: Setting profile image for ${imgElement.id}:`, imageUrl);
        
        // Clear any existing error handlers
        imgElement.onerror = null;
        imgElement.onload = null;
        
        // Set the image source
        imgElement.src = imageUrl;
        imgElement.style.display = 'block';
        imgElement.style.visibility = 'visible';
        
        // Handle successful load
        imgElement.onload = () => {
            console.log(`Gmail Profile Photo Fix: Profile image loaded successfully for ${imgElement.id}`);
        };
        
        // Handle load error with fallback
        imgElement.onerror = () => {
            console.log(`Gmail Profile Photo Fix: Profile image failed for ${imgElement.id}, using fallback`);
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            const fallbackUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            imgElement.src = fallbackUrl;
            
            // If fallback also fails, use a simple colored circle
            imgElement.onerror = () => {
                console.log(`Gmail Profile Photo Fix: Fallback also failed for ${imgElement.id}, using colored circle`);
                imgElement.style.backgroundColor = '#ff0040';
                imgElement.style.color = 'white';
                imgElement.style.display = 'flex';
                imgElement.style.alignItems = 'center';
                imgElement.style.justifyContent = 'center';
                imgElement.style.fontWeight = 'bold';
                imgElement.textContent = initial;
                imgElement.src = '';
            };
        };
    }
    
    function showProfileInterface() {
        console.log('Gmail Profile Photo Fix: Showing profile interface');
        
        // Show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
        }
        
        // Hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
        }
        
        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
        }
    }
    
    function hideProfilePhotos() {
        console.log('Gmail Profile Photo Fix: Hiding profile photos');
        
        // Hide profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.remove('show');
            profileButton.classList.add('hidden');
            profileButton.style.display = 'none';
        }
        
        // Show login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.remove('hidden');
            loginButton.classList.add('show');
            loginButton.style.display = 'flex';
        }
        
        // Hide mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'none';
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'block';
        }
    }
    
    // Global function to force refresh profile photos
    window.refreshGmailProfilePhotos = function() {
        console.log('Gmail Profile Photo Fix: Force refreshing profile photos...');
        retryCount = 0;
        startProfilePhotoMonitoring();
        checkAndUpdateProfilePhotos();
    };
    
    // Initialize immediately
    initialize();
    
    // Also initialize when DOM is ready as backup
    document.addEventListener('DOMContentLoaded', initialize);
    
    console.log('Gmail Profile Photo Fix: Loaded');
})();
