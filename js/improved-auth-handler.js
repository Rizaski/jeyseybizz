/**
 * Improved Authentication Handler
 * Handles user authentication and profile display with better error handling
 */

class ImprovedAuthHandler {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.authStateListeners = [];
    }

    async initialize() {
        if (this.isInitialized) {
            return true;
        }

        try {
            console.log('Improved Auth: Initializing...');

            // Wait for Firebase to be available
            await this.waitForFirebase();

            if (window.FirebaseAuth) {
                // Set up auth state listener
                window.FirebaseAuth.onAuthStateChanged((user) => {
                    console.log('Improved Auth: Auth state changed:', user);
                    this.currentUser = user;
                    this.authStateListeners.forEach(callback => callback(user));

                    if (user) {
                        this.updateUserInterface(user);
                    } else {
                        this.hideUserInterface();
                    }
                });

                this.isInitialized = true;
                console.log('Improved Auth: Initialized successfully');
                return true;
            } else {
                console.error('Improved Auth: FirebaseAuth not available');
                return false;
            }
        } catch (error) {
            console.error('Improved Auth: Initialization failed:', error);
            return false;
        }
    }

    async waitForFirebase() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait

        while (attempts < maxAttempts) {
            if (window.FirebaseAuth) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        throw new Error('FirebaseAuth not available after waiting');
    }

    onAuthStateChanged(callback) {
        this.authStateListeners.push(callback);

        // If already initialized and have a current user, call immediately
        if (this.isInitialized && this.currentUser) {
            callback(this.currentUser);
        }
    }

    updateUserInterface(user) {
        console.log('Improved Auth: Updating user interface for:', user);

        // Get all profile elements
        const elements = this.getProfileElements();

        // Update profile images
        this.updateProfileImages(user, elements);

        // Update user information
        this.updateUserInformation(user, elements);

        // Show/hide appropriate UI elements
        this.showUserInterface();
    }

    hideUserInterface() {
        console.log('Improved Auth: Hiding user interface');

        // Hide profile button, show login button
        const profileButton = document.getElementById('user-profile-btn');
        const loginButton = document.getElementById('login-btn');

        if (profileButton) {
            profileButton.classList.remove('show');
            profileButton.classList.add('hidden');
        }

        if (loginButton) {
            loginButton.classList.remove('hidden');
            loginButton.classList.add('show');
        }

        // Hide mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        const mobileLogin = document.getElementById('mobile-login-section');

        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'none';
        }
        if (mobileLogin) {
            mobileLogin.style.display = 'block';
        }
    }

    showUserInterface() {
        console.log('Improved Auth: Showing user interface');

        // Show profile button, hide login button
        const profileButton = document.getElementById('user-profile-btn');
        const loginButton = document.getElementById('login-btn');

        if (profileButton) {
            profileButton.classList.add('show');
            profileButton.classList.remove('hidden');
        }

        if (loginButton) {
            loginButton.classList.add('hidden');
            loginButton.classList.remove('show');
        }

        // Show mobile user profile
        const mobileUserProfile = document.getElementById('mobile-user-profile-section');
        const mobileLogin = document.getElementById('mobile-login-section');

        if (mobileUserProfile) {
            mobileUserProfile.style.display = 'block';
        }
        if (mobileLogin) {
            mobileLogin.style.display = 'none';
        }
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
        console.log('Improved Auth: Updating profile images');

        // Get profile image URL
        let profileImage = user.photoURL;
        if (!profileImage || profileImage === '') {
            // Create a fallback image with user's initial
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            profileImage = `https://via.placeholder.com/32/ff0040/ffffff?text=${initial}`;
        }

        console.log('Improved Auth: Profile image URL:', profileImage);

        // Update desktop profile image
        if (elements.userProfileImage) {
            this.setImageWithFallback(elements.userProfileImage, profileImage, user, 32);
        }

        // Update dropdown profile image
        if (elements.dropdownProfileImage) {
            this.setImageWithFallback(elements.dropdownProfileImage, profileImage, user, 40);
        }

        // Update mobile profile image
        if (elements.mobileUserProfileImage) {
            this.setImageWithFallback(elements.mobileUserProfileImage, profileImage, user, 40);
        }
    }

    setImageWithFallback(imgElement, imageUrl, user, size) {
        imgElement.src = imageUrl;
        imgElement.onerror = () => {
            console.log('Improved Auth: Profile image failed to load, using fallback');
            const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            imgElement.src = `https://via.placeholder.com/${size}/ff0040/ffffff?text=${initial}`;
        };
        imgElement.onload = () => {
            console.log('Improved Auth: Profile image loaded successfully');
        };
    }

    updateUserInformation(user, elements) {
        console.log('Improved Auth: Updating user information');

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

    async getCurrentUser() {
        if (window.FirebaseAuth) {
            return await window.FirebaseAuth.getCurrentUser();
        }
        return null;
    }

    async signOut() {
        if (window.FirebaseAuth) {
            await window.FirebaseAuth.signOut();
            this.currentUser = null;
            this.hideUserInterface();
        }
    }
}

// Create global instance
window.ImprovedAuth = new ImprovedAuthHandler();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.ImprovedAuth.initialize();
        console.log('Improved Auth: Auto-initialized');
    } catch (error) {
        console.error('Improved Auth: Auto-initialization failed:', error);
    }
});

console.log('Improved Auth Handler loaded');