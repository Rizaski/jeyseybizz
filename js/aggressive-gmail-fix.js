/**
 * Aggressive Gmail Profile Photo Fix
 * Ensures Gmail profile photos are loaded and displayed correctly
 */

(function() {
    'use strict';
    
    console.log('Aggressive Gmail Fix: Starting...');
    
    let isRunning = false;
    let userFound = false;
    
    function startAggressiveGmailFix() {
        if (isRunning) return;
        
        console.log('Aggressive Gmail Fix: Starting aggressive monitoring...');
        isRunning = true;
        
        // Check every 500ms for 30 seconds
        let attempts = 0;
        const maxAttempts = 60;
        
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts || userFound) {
                clearInterval(interval);
                console.log('Aggressive Gmail Fix: Stopped monitoring');
                return;
            }
            
            checkForGmailUser();
        }, 500);
        
        // Also check immediately
        checkForGmailUser();
    }
    
    async function checkForGmailUser() {
        try {
            console.log('Aggressive Gmail Fix: Checking for Gmail user...');
            
            let user = null;
            
            // Try all authentication methods
            const authMethods = [
                () => window.FirebaseAuth?.getCurrentUser?.(),
                () => window.ImprovedAuth?.getCurrentUser?.(),
                () => window.ProfilePhotoHandler?.authState,
                () => window.DeployedAuthFix?.getCurrentUser?.(),
                () => window.UniversalAuthFix?.currentUser
            ];
            
            for (const method of authMethods) {
                try {
                    const result = await method();
                    if (result) {
                        user = result;
                        console.log('Aggressive Gmail Fix: Found user via method:', method.name);
                        break;
                    }
                } catch (e) {
                    console.log('Aggressive Gmail Fix: Method failed:', method.name, e);
                }
            }
            
            // Check localStorage as fallback
            if (!user) {
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        user = JSON.parse(storedUser);
                        console.log('Aggressive Gmail Fix: Found stored user');
                    }
                } catch (e) {
                    console.log('Aggressive Gmail Fix: Invalid stored user');
                }
            }
            
            if (user && user.email && user.email.includes('@gmail.com')) {
                console.log('Aggressive Gmail Fix: Gmail user found:', user);
                userFound = true;
                forceUpdateGmailProfile(user);
            }
            
        } catch (error) {
            console.error('Aggressive Gmail Fix: Error checking for Gmail user:', error);
        }
    }
    
    function forceUpdateGmailProfile(user) {
        console.log('Aggressive Gmail Fix: Force updating Gmail profile for:', user);
        
        // Get Gmail profile photo URL
        let profileImageUrl = user.photoURL;
        
        console.log('Aggressive Gmail Fix: Gmail photoURL:', profileImageUrl);
        
        // If no photoURL, try to construct one from Gmail
        if (!profileImageUrl || profileImageUrl === '' || profileImageUrl === null) {
            // Try to get Gmail profile photo using email
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                profileImageUrl = `https://lh3.googleusercontent.com/a/default-user=${username}`;
                console.log('Aggressive Gmail Fix: Constructed Gmail photo URL:', profileImageUrl);
            }
        }
        
        // If still no URL, use fallback
        if (!profileImageUrl) {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('Aggressive Gmail Fix: Using fallback image:', profileImageUrl);
        }
        
        // Force update all profile images
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log(`Aggressive Gmail Fix: Force updating ${selector}`);
                forceSetProfileImage(img, profileImageUrl, user);
            }
        });
        
        // Force show profile interface
        forceShowProfileInterface();
    }
    
    function forceSetProfileImage(imgElement, imageUrl, user) {
        console.log(`Aggressive Gmail Fix: Force setting profile image for ${imgElement.id}:`, imageUrl);
        
        // Remove all existing event handlers
        const newImg = imgElement.cloneNode(true);
        imgElement.parentNode.replaceChild(newImg, imgElement);
        
        // Set the image source
        newImg.src = imageUrl;
        newImg.style.display = 'block';
        newImg.style.visibility = 'visible';
        newImg.style.width = '32px';
        newImg.style.height = '32px';
        newImg.style.borderRadius = '50%';
        newImg.style.objectFit = 'cover';
        
        // Handle successful load
        newImg.onload = () => {
            console.log(`Aggressive Gmail Fix: Gmail profile image loaded for ${newImg.id}`);
        };
        
        // Handle load error with multiple fallbacks
        newImg.onerror = () => {
            console.log(`Aggressive Gmail Fix: Gmail profile image failed for ${newImg.id}, trying fallbacks`);
            
            // Try different Gmail photo URL formats
            const email = user.email;
            if (email && email.includes('@gmail.com')) {
                const username = email.split('@')[0];
                const fallbackUrls = [
                    `https://lh3.googleusercontent.com/a/default-user=${username}`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=32`,
                    `https://lh3.googleusercontent.com/a/ACg8ocK${username}?sz=64`
                ];
                
                let fallbackIndex = 0;
                const tryNextFallback = () => {
                    if (fallbackIndex < fallbackUrls.length) {
                        newImg.src = fallbackUrls[fallbackIndex];
                        fallbackIndex++;
                    } else {
                        // All fallbacks failed, use placeholder
                        const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
                        newImg.src = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
                        newImg.onerror = () => {
                            // Final fallback - colored circle with initial
                            newImg.style.backgroundColor = '#ff0040';
                            newImg.style.color = 'white';
                            newImg.style.display = 'flex';
                            newImg.style.alignItems = 'center';
                            newImg.style.justifyContent = 'center';
                            newImg.style.fontWeight = 'bold';
                            newImg.textContent = initial;
                            newImg.src = '';
                        };
                    }
                };
                
                newImg.onerror = tryNextFallback;
                tryNextFallback();
            } else {
                // Not a Gmail user, use simple fallback
                const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
                newImg.src = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            }
        };
    }
    
    function forceShowProfileInterface() {
        console.log('Aggressive Gmail Fix: Force showing profile interface');
        
        // Force show profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
            profileButton.style.display = 'flex';
            profileButton.style.visibility = 'visible';
        }
        
        // Force hide login button
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
            loginButton.style.display = 'none';
            loginButton.style.visibility = 'hidden';
        }
        
        // Force show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
            mobileUserProfile.style.visibility = 'visible';
        }
        
        const mobileLogin = document.getElementById('mobile-login-section');
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
            mobileLogin.style.visibility = 'hidden';
        }
    }
    
    // Global function to force Gmail profile refresh
    window.forceGmailProfileRefresh = function() {
        console.log('Aggressive Gmail Fix: Force refreshing Gmail profile...');
        userFound = false;
        startAggressiveGmailFix();
    };
    
    // Start immediately
    startAggressiveGmailFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startAggressiveGmailFix);
    
    console.log('Aggressive Gmail Fix: Loaded');
})();
