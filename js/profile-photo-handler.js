/**
 * Profile Photo Handler
 * Specifically handles Gmail profile photos and authentication state
 */

class ProfilePhotoHandler {
    constructor() {
        this.isInitialized = false;
        this.profileElements = {};
        this.authState = null;
    }

    async initialize() {
        if (this.isInitialized) {
            return true;
        }

        try {
            console.log('Profile Photo Handler: Initializing...');
            
            // Wait for authentication to be ready
            await this.waitForAuthentication();
            
            // Find profile elements
            this.findProfileElements();
            
            // Set up authentication listener
            this.setupAuthListener();
            
            // Check current authentication state
            await this.checkCurrentAuthState();
            
            this.isInitialized = true;
            console.log('Profile Photo Handler: Initialized successfully');
            return true;
        } catch (error) {
            console.error('Profile Photo Handler: Initialization failed:', error);
            return false;
        }
    }

    async waitForAuthentication() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        while (attempts < maxAttempts) {
            if (window.FirebaseAuth || window.ImprovedAuth) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        throw new Error('Authentication not available after waiting');
    }

    findProfileElements() {
        this.profileElements = {
            userProfileImage: document.getElementById('user-profile-image'),
            dropdownProfileImage: document.getElementById('dropdown-profile-image'),
            mobileUserProfileImage: document.getElementById('mobile-user-profile-image'),
            dropdownUserName: document.getElementById('dropdown-user-name'),
            dropdownUserEmail: document.getElementById('dropdown-user-email'),
            mobileUserName: document.getElementById('mobile-user-name'),
            mobileUserEmail: document.getElementById('mobile-user-email'),
            profileButton: document.getElementById('user-profile-btn'),
            loginButton: document.getElementById('login-btn'),
            mobileUserProfile: document.getElementById('mobile-user-profile-section'),
            mobileLogin: document.getElementById('mobile-login-section')
        };
        
        console.log('Profile Photo Handler: Found elements:', {
            userProfileImage: !!this.profileElements.userProfileImage,
            dropdownProfileImage: !!this.profileElements.dropdownProfileImage,
            mobileUserProfileImage: !!this.profileElements.mobileUserProfileImage,
            profileButton: !!this.profileElements.profileButton,
            loginButton: !!this.profileElements.loginButton
        });
    }

    setupAuthListener() {
        // Listen for authentication state changes
        if (window.FirebaseAuth) {
            window.FirebaseAuth.onAuthStateChanged((user) => {
                console.log('Profile Photo Handler: Auth state changed:', user);
                this.handleAuthStateChange(user);
            });
        }
        
        if (window.ImprovedAuth) {
            window.ImprovedAuth.onAuthStateChanged((user) => {
                console.log('Profile Photo Handler: Improved auth state changed:', user);
                this.handleAuthStateChange(user);
            });
        }
    }

    async checkCurrentAuthState() {
        try {
            let user = null;
            
            if (window.FirebaseAuth) {
                user = await window.FirebaseAuth.getCurrentUser();
            } else if (window.ImprovedAuth) {
                user = await window.ImprovedAuth.getCurrentUser();
            }
            
            console.log('Profile Photo Handler: Current user:', user);
            this.handleAuthStateChange(user);
        } catch (error) {
            console.error('Profile Photo Handler: Error checking auth state:', error);
            this.handleAuthStateChange(null);
        }
    }

    handleAuthStateChange(user) {
        this.authState = user;
        
        if (user) {
            console.log('Profile Photo Handler: User authenticated, updating profile');
            this.updateUserProfile(user);
            this.showUserInterface();
        } else {
            console.log('Profile Photo Handler: User not authenticated, hiding profile');
            this.hideUserInterface();
        }
    }

    updateUserProfile(user) {
        console.log('Profile Photo Handler: Updating user profile with:', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        });

        // Update profile images
        this.updateProfileImages(user);
        
        // Update user information
        this.updateUserInformation(user);
    }

    updateProfileImages(user) {
        // Get the actual profile image URL from Gmail
        let profileImageUrl = user.photoURL;
        
        console.log('Profile Photo Handler: Original photoURL:', profileImageUrl);
        
        // If no photoURL, create a fallback
        if (!profileImageUrl || profileImageUrl === '') {
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImageUrl = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
            console.log('Profile Photo Handler: Using fallback image:', profileImageUrl);
        } else {
            console.log('Profile Photo Handler: Using Gmail profile image:', profileImageUrl);
        }

        // Update desktop profile image
        if (this.profileElements.userProfileImage) {
            this.setProfileImage(this.profileElements.userProfileImage, profileImageUrl, user, 32);
        }

        // Update dropdown profile image
        if (this.profileElements.dropdownProfileImage) {
            this.setProfileImage(this.profileElements.dropdownProfileImage, profileImageUrl, user, 40);
        }

        // Update mobile profile image
        if (this.profileElements.mobileUserProfileImage) {
            this.setProfileImage(this.profileElements.mobileUserProfileImage, profileImageUrl, user, 40);
        }
    }

    setProfileImage(imgElement, imageUrl, user, size) {
        console.log(`Profile Photo Handler: Setting profile image for ${imgElement.id}:`, imageUrl);
        
        // Set the image source
        imgElement.src = imageUrl;
        
        // Handle image load success
        imgElement.onload = () => {
            console.log(`Profile Photo Handler: Profile image loaded successfully for ${imgElement.id}`);
        };
        
        // Handle image load error
        imgElement.onerror = () => {
            console.log(`Profile Photo Handler: Profile image failed to load for ${imgElement.id}, using fallback`);
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            const fallbackUrl = `https://via.placeholder.com/${size}/ff0040/ffffff?text=${initial}`;
            imgElement.src = fallbackUrl;
        };
        
        // Ensure the image is visible
        imgElement.style.display = 'block';
        imgElement.style.visibility = 'visible';
    }

    updateUserInformation(user) {
        const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
        const email = user.email || 'user@example.com';

        // Update dropdown user info
        if (this.profileElements.dropdownUserName) {
            this.profileElements.dropdownUserName.textContent = displayName;
        }
        if (this.profileElements.dropdownUserEmail) {
            this.profileElements.dropdownUserEmail.textContent = email;
        }

        // Update mobile user info
        if (this.profileElements.mobileUserName) {
            this.profileElements.mobileUserName.textContent = displayName;
        }
        if (this.profileElements.mobileUserEmail) {
            this.profileElements.mobileUserEmail.textContent = email;
        }
    }

    showUserInterface() {
        console.log('Profile Photo Handler: Showing user interface');
        
        // Show profile button, hide login button
        if (this.profileElements.profileButton) {
            this.profileElements.profileButton.classList.add('show');
            this.profileElements.profileButton.classList.remove('hidden');
            this.profileElements.profileButton.style.display = 'flex';
        }
        
        if (this.profileElements.loginButton) {
            this.profileElements.loginButton.classList.add('hidden');
            this.profileElements.loginButton.classList.remove('show');
            this.profileElements.loginButton.style.display = 'none';
        }
        
        // Show mobile user profile
        if (this.profileElements.mobileUserProfile) {
            this.profileElements.mobileUserProfile.style.display = 'block';
        }
        if (this.profileElements.mobileLogin) {
            this.profileElements.mobileLogin.style.display = 'none';
        }
    }

    hideUserInterface() {
        console.log('Profile Photo Handler: Hiding user interface');
        
        // Hide profile button, show login button
        if (this.profileElements.profileButton) {
            this.profileElements.profileButton.classList.remove('show');
            this.profileElements.profileButton.classList.add('hidden');
            this.profileElements.profileButton.style.display = 'none';
        }
        
        if (this.profileElements.loginButton) {
            this.profileElements.loginButton.classList.remove('hidden');
            this.profileElements.loginButton.classList.add('show');
            this.profileElements.loginButton.style.display = 'flex';
        }
        
        // Hide mobile user profile
        if (this.profileElements.mobileUserProfile) {
            this.profileElements.mobileUserProfile.style.display = 'none';
        }
        if (this.profileElements.mobileLogin) {
            this.profileElements.mobileLogin.style.display = 'block';
        }
    }

    // Force refresh profile photos
    async refreshProfilePhotos() {
        console.log('Profile Photo Handler: Refreshing profile photos...');
        
        if (this.authState) {
            this.updateUserProfile(this.authState);
        } else {
            console.log('Profile Photo Handler: No authenticated user to refresh');
        }
    }
}

// Create global instance
window.ProfilePhotoHandler = new ProfilePhotoHandler();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.ProfilePhotoHandler.initialize();
        console.log('Profile Photo Handler: Auto-initialized');
    } catch (error) {
        console.error('Profile Photo Handler: Auto-initialization failed:', error);
    }
});

console.log('Profile Photo Handler loaded');
