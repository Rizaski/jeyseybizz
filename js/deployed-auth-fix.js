/**
 * Deployed Authentication Fix
 * Aggressive authentication handling for deployed site
 */

(function() {
    'use strict';
    
    console.log('Deployed Auth Fix: Starting...');
    
    let isInitialized = false;
    let currentUser = null;
    let checkInterval = null;
    let retryCount = 0;
    const maxRetries = 100; // 50 seconds of checking
    
    // Force initialization
    function forceInit() {
        if (isInitialized) return;
        
        console.log('Deployed Auth Fix: Force initializing...');
        isInitialized = true;
        
        // Start aggressive checking
        startAggressiveCheck();
        
        // Also check on various events
        document.addEventListener('DOMContentLoaded', checkAuth);
        window.addEventListener('load', checkAuth);
        window.addEventListener('focus', checkAuth);
        
        // Check immediately
        setTimeout(checkAuth, 100);
        setTimeout(checkAuth, 500);
        setTimeout(checkAuth, 1000);
        setTimeout(checkAuth, 2000);
    }
    
    function startAggressiveCheck() {
        console.log('Deployed Auth Fix: Starting aggressive authentication check...');
        
        checkInterval = setInterval(() => {
            checkAuth();
            retryCount++;
            
            if (retryCount >= maxRetries) {
                clearInterval(checkInterval);
                console.log('Deployed Auth Fix: Stopped aggressive checking after 50 seconds');
            }
        }, 500);
    }
    
    async function checkAuth() {
        try {
            console.log('Deployed Auth Fix: Checking authentication...');
            
            let user = null;
            
            // Try all possible authentication sources
            if (window.FirebaseAuth && typeof window.FirebaseAuth.getCurrentUser === 'function') {
                try {
                    user = await window.FirebaseAuth.getCurrentUser();
                    console.log('Deployed Auth Fix: FirebaseAuth user:', user);
                } catch (e) {
                    console.log('Deployed Auth Fix: FirebaseAuth error:', e);
                }
            }
            
            if (!user && window.ImprovedAuth && typeof window.ImprovedAuth.getCurrentUser === 'function') {
                try {
                    user = await window.ImprovedAuth.getCurrentUser();
                    console.log('Deployed Auth Fix: ImprovedAuth user:', user);
                } catch (e) {
                    console.log('Deployed Auth Fix: ImprovedAuth error:', e);
                }
            }
            
            if (!user && window.ProfilePhotoHandler && window.ProfilePhotoHandler.authState) {
                user = window.ProfilePhotoHandler.authState;
                console.log('Deployed Auth Fix: ProfilePhotoHandler user:', user);
            }
            
            // Check localStorage
            if (!user) {
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        user = JSON.parse(storedUser);
                        console.log('Deployed Auth Fix: Stored user:', user);
                    }
                } catch (e) {
                    console.log('Deployed Auth Fix: Invalid stored user:', e);
                }
            }
            
            // Check sessionStorage
            if (!user) {
                try {
                    const sessionUser = sessionStorage.getItem('user');
                    if (sessionUser) {
                        user = JSON.parse(sessionUser);
                        console.log('Deployed Auth Fix: Session user:', user);
                    }
                } catch (e) {
                    console.log('Deployed Auth Fix: Invalid session user:', e);
                }
            }
            
            // Update UI if user state changed
            if (user !== currentUser) {
                console.log('Deployed Auth Fix: User state changed:', user);
                currentUser = user;
                updateUI(user);
            }
            
        } catch (error) {
            console.error('Deployed Auth Fix: Error checking auth:', error);
        }
    }
    
    function updateUI(user) {
        console.log('Deployed Auth Fix: Updating UI for user:', user);
        
        if (user) {
            showUserInterface(user);
        } else {
            hideUserInterface();
        }
    }
    
    function showUserInterface(user) {
        console.log('Deployed Auth Fix: Showing user interface');
        
        // Update profile images
        updateProfileImages(user);
        
        // Update user information
        updateUserInformation(user);
        
        // Show/hide buttons
        toggleButtons(true);
        
        // Show/hide mobile profile
        toggleMobileProfile(true);
    }
    
    function hideUserInterface() {
        console.log('Deployed Auth Fix: Hiding user interface');
        
        toggleButtons(false);
        toggleMobileProfile(false);
    }
    
    function updateProfileImages(user) {
        console.log('Deployed Auth Fix: Updating profile images');
        
        let profileImageUrl = user.photoURL;
        
        if (!profileImageUrl || profileImageUrl === '') {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
        }
        
        console.log('Deployed Auth Fix: Profile image URL:', profileImageUrl);
        
        // Update all profile images
        const profileImages = [
            document.getElementById('user-profile-image'),
            document.getElementById('dropdown-profile-image'),
            document.getElementById('mobile-user-profile-image')
        ];
        
        profileImages.forEach((img, index) => {
            if (img) {
                setProfileImage(img, profileImageUrl, user, index === 0 ? 32 : 40);
            }
        });
    }
    
    function setProfileImage(imgElement, imageUrl, user, size) {
        console.log(`Deployed Auth Fix: Setting profile image for ${imgElement.id}:`, imageUrl);
        
        imgElement.src = imageUrl;
        imgElement.style.display = 'block';
        imgElement.style.visibility = 'visible';
        
        imgElement.onload = () => {
            console.log(`Deployed Auth Fix: Profile image loaded for ${imgElement.id}`);
        };
        
        imgElement.onerror = () => {
            console.log(`Deployed Auth Fix: Profile image failed for ${imgElement.id}, using fallback`);
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            imgElement.src = `https://via.placeholder.com/${size}/ff0040/ffffff?text=${initial}`;
        };
    }
    
    function updateUserInformation(user) {
        const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
        const email = user.email || 'user@example.com';
        
        // Update dropdown user info
        const dropdownUserName = document.getElementById('dropdown-user-name');
        const dropdownUserEmail = document.getElementById('dropdown-user-email');
        
        if (dropdownUserName) {
            dropdownUserName.textContent = displayName;
        }
        if (dropdownUserEmail) {
            dropdownUserEmail.textContent = email;
        }
        
        // Update mobile user info
        const mobileUserName = document.getElementById('mobile-user-name');
        const mobileUserEmail = document.getElementById('mobile-user-email');
        
        if (mobileUserName) {
            mobileUserName.textContent = displayName;
        }
        if (mobileUserEmail) {
            mobileUserEmail.textContent = email;
        }
    }
    
    function toggleButtons(showProfile) {
        const profileButton = document.getElementById('user-profile-btn');
        const loginButton = document.getElementById('login-btn');
        
        if (profileButton) {
            if (showProfile) {
                profileButton.classList.add('show');
                profileButton.classList.remove('hidden');
                profileButton.style.display = 'flex';
            } else {
                profileButton.classList.remove('show');
                profileButton.classList.add('hidden');
                profileButton.style.display = 'none';
            }
        }
        
        if (loginButton) {
            if (showProfile) {
                loginButton.classList.add('hidden');
                loginButton.classList.remove('show');
                loginButton.style.display = 'none';
            } else {
                loginButton.classList.remove('hidden');
                loginButton.classList.add('show');
                loginButton.style.display = 'flex';
            }
        }
    }
    
    function toggleMobileProfile(showProfile) {
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        const mobileLogin = document.getElementById('mobile-login-section');
        
        if (mobileUserProfile) {
            mobileUserProfile.style.display = showProfile ? 'block' : 'none';
        }
        if (mobileLogin) {
            mobileLogin.style.display = showProfile ? 'none' : 'block';
        }
    }
    
    // Force initialization immediately
    forceInit();
    
    // Also initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceInit);
    } else {
        forceInit();
    }
    
    // Expose global functions
    window.DeployedAuthFix = {
        forceRefresh: () => {
            retryCount = 0;
            startAggressiveCheck();
            checkAuth();
        },
        getCurrentUser: () => currentUser,
        checkAuth: checkAuth
    };
    
    console.log('Deployed Auth Fix: Loaded and initialized');
})();
