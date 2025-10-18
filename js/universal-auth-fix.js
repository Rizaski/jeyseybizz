/**
 * Universal Authentication Fix
 * Guaranteed authentication state management across all pages
 */

class UniversalAuthFix {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.authCheckInterval = null;
        this.maxRetries = 50;
        this.retryCount = 0;
    }

    async initialize() {
        if (this.isInitialized) {
            return true;
        }

        console.log('Universal Auth Fix: Starting initialization...');
        
        try {
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Start authentication monitoring
            this.startAuthMonitoring();
            
            // Initial authentication check
            await this.checkAuthentication();
            
            this.isInitialized = true;
            console.log('Universal Auth Fix: Initialized successfully');
            return true;
        } catch (error) {
            console.error('Universal Auth Fix: Initialization failed:', error);
            return false;
        }
    }

    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    startAuthMonitoring() {
        console.log('Universal Auth Fix: Starting authentication monitoring...');
        
        // Check authentication every 500ms for the first 10 seconds
        this.authCheckInterval = setInterval(async () => {
            await this.checkAuthentication();
            
            // Stop checking after 10 seconds
            if (this.retryCount >= 20) {
                clearInterval(this.authCheckInterval);
                console.log('Universal Auth Fix: Stopped monitoring after 10 seconds');
            }
        }, 500);
    }

    async checkAuthentication() {
        this.retryCount++;
        
        try {
            let user = null;
            
            // Try multiple authentication sources
            if (window.FirebaseAuth && window.FirebaseAuth.getCurrentUser) {
                user = await window.FirebaseAuth.getCurrentUser();
                console.log('Universal Auth Fix: FirebaseAuth user:', user);
            }
            
            if (!user && window.ImprovedAuth && window.ImprovedAuth.getCurrentUser) {
                user = await window.ImprovedAuth.getCurrentUser();
                console.log('Universal Auth Fix: ImprovedAuth user:', user);
            }
            
            if (!user && window.ProfilePhotoHandler && window.ProfilePhotoHandler.authState) {
                user = window.ProfilePhotoHandler.authState;
                console.log('Universal Auth Fix: ProfilePhotoHandler user:', user);
            }
            
            // Check localStorage for user data
            if (!user) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        user = JSON.parse(storedUser);
                        console.log('Universal Auth Fix: Stored user:', user);
                    } catch (e) {
                        console.log('Universal Auth Fix: Invalid stored user data');
                    }
                }
            }
            
            // Check if user state has changed
            if (user !== this.currentUser) {
                console.log('Universal Auth Fix: User state changed:', user);
                this.currentUser = user;
                this.updateUI(user);
            }
            
        } catch (error) {
            console.error('Universal Auth Fix: Error checking authentication:', error);
        }
    }

    updateUI(user) {
        console.log('Universal Auth Fix: Updating UI for user:', user);
        
        if (user) {
            this.showUserInterface(user);
        } else {
            this.hideUserInterface();
        }
    }

    showUserInterface(user) {
        console.log('Universal Auth Fix: Showing user interface');
        
        // Get all profile elements
        const elements = this.getProfileElements();
        
        // Update profile images
        this.updateProfileImages(user, elements);
        
        // Update user information
        this.updateUserInformation(user, elements);
        
        // Show profile button, hide login button
        this.toggleButtons(true);
        
        // Show mobile user profile
        this.toggleMobileProfile(true);
    }

    hideUserInterface() {
        console.log('Universal Auth Fix: Hiding user interface');
        
        // Hide profile button, show login button
        this.toggleButtons(false);
        
        // Hide mobile user profile
        this.toggleMobileProfile(false);
    }

    getProfileElements() {
        return {
            userProfileImage: document.getElementById('user-profile-image'),
            dropdownProfileImage: document.getElementById('dropdown-profile-image'),
            mobileUserProfileImage: document.getElementById('mobile-user-profile-image'),
            dropdownUserName: document.getElementById('dropdown-user-name'),
            dropdownUserEmail: document.getElementById('dropdown-user-email'),
            mobileUserName: document.getElementById('mobile-user-name'),
            mobileUserEmail: document.getElementById('mobile-user-email')
        };
    }

    updateProfileImages(user, elements) {
        console.log('Universal Auth Fix: Updating profile images');
        
        // Get profile image URL
        let profileImageUrl = user.photoURL;
        
        if (!profileImageUrl || profileImageUrl === '') {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
        }

        console.log('Universal Auth Fix: Profile image URL:', profileImageUrl);

        // Update all profile images
        [elements.userProfileImage, elements.dropdownProfileImage, elements.mobileUserProfileImage].forEach((img, index) => {
            if (img) {
                this.setProfileImage(img, profileImageUrl, user, index === 0 ? 32 : 40);
            }
        });
    }

    setProfileImage(imgElement, imageUrl, user, size) {
        console.log(`Universal Auth Fix: Setting profile image for ${imgElement.id}:`, imageUrl);
        
        imgElement.src = imageUrl;
        imgElement.style.display = 'block';
        imgElement.style.visibility = 'visible';
        
        imgElement.onload = () => {
            console.log(`Universal Auth Fix: Profile image loaded for ${imgElement.id}`);
        };
        
        imgElement.onerror = () => {
            console.log(`Universal Auth Fix: Profile image failed for ${imgElement.id}, using fallback`);
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            imgElement.src = `https://via.placeholder.com/${size}/ff0040/ffffff?text=${initial}`;
        };
    }

    updateUserInformation(user, elements) {
        const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
        const email = user.email || 'user@example.com';

        // Update dropdown user info
        if (elements.dropdownUserName) {
            elements.dropdownUserName.textContent = displayName;
        }
        if (elements.dropdownUserEmail) {
            elements.dropdownUserEmail.textContent = email;
        }

        // Update mobile user info
        if (elements.mobileUserName) {
            elements.mobileUserName.textContent = displayName;
        }
        if (elements.mobileUserEmail) {
            elements.mobileUserEmail.textContent = email;
        }
    }

    toggleButtons(showProfile) {
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

    toggleMobileProfile(showProfile) {
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        const mobileLogin = document.getElementById('mobile-login-section');
        
        if (mobileUserProfile) {
            mobileUserProfile.style.display = showProfile ? 'block' : 'none';
        }
        if (mobileLogin) {
            mobileLogin.style.display = showProfile ? 'none' : 'block';
        }
    }

    // Force refresh authentication
    async forceRefresh() {
        console.log('Universal Auth Fix: Force refreshing authentication...');
        this.retryCount = 0;
        this.startAuthMonitoring();
        await this.checkAuthentication();
    }
}

// Create global instance
window.UniversalAuthFix = new UniversalAuthFix();

// Auto-initialize immediately
(async () => {
    try {
        await window.UniversalAuthFix.initialize();
        console.log('Universal Auth Fix: Auto-initialized');
    } catch (error) {
        console.error('Universal Auth Fix: Auto-initialization failed:', error);
    }
})();

// Also initialize when DOM is ready as backup
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.UniversalAuthFix.initialize();
        console.log('Universal Auth Fix: DOM ready initialization');
    } catch (error) {
        console.error('Universal Auth Fix: DOM ready initialization failed:', error);
    }
});

console.log('Universal Auth Fix loaded');
