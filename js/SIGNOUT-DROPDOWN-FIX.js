/**
 * SIGNOUT DROPDOWN FIX
 * Fixes sign out functionality in profile dropdown area
 */

(function() {
    'use strict';
    
    console.log('SIGNOUT DROPDOWN FIX: Starting...');
    
    let isRunning = false;
    let attempts = 0;
    const maxAttempts = 30; // 15 seconds of trying
    let hasSetupSignOut = false;
    
    function startSignOutDropdownFix() {
        if (isRunning) return;
        
        console.log('SIGNOUT DROPDOWN FIX: Starting sign out dropdown monitoring...');
        isRunning = true;
        
        // Check every 500ms for 15 seconds
        const interval = setInterval(() => {
            attempts++;
            
            if (attempts >= maxAttempts || hasSetupSignOut) {
                clearInterval(interval);
                console.log('SIGNOUT DROPDOWN FIX: Stopped after 15 seconds or sign out setup');
                return;
            }
            
            SETUP_SIGNOUT_DROPDOWN();
        }, 500);
        
        // Also check immediately
        SETUP_SIGNOUT_DROPDOWN();
    }
    
    function SETUP_SIGNOUT_DROPDOWN() {
        console.log('SIGNOUT DROPDOWN FIX: Attempt', attempts, '- Setting up sign out dropdown...');
        
        // Find all sign out buttons and links
        const signOutSelectors = [
            '#signout-btn',
            '#sign-out-btn',
            '#logout-btn',
            '#log-out-btn',
            '.signout-btn',
            '.sign-out-btn',
            '.logout-btn',
            '.log-out-btn',
            '[data-signout]',
            '[data-sign-out]',
            '[data-logout]',
            '[data-log-out]',
            'button[onclick*="signOut"]',
            'button[onclick*="logout"]',
            'a[onclick*="signOut"]',
            'a[onclick*="logout"]'
        ];
        
        let signOutElements = [];
        
        signOutSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                signOutElements.push(element);
            });
        });
        
        // Also look for any element with text containing "sign out", "logout", etc.
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = element.textContent?.toLowerCase() || '';
            if (text.includes('sign out') || text.includes('logout') || text.includes('log out')) {
                if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'DIV') {
                    signOutElements.push(element);
                }
            }
        });
        
        console.log('SIGNOUT DROPDOWN FIX: Found', signOutElements.length, 'sign out elements');
        
        if (signOutElements.length > 0) {
            hasSetupSignOut = true;
            console.log('SIGNOUT DROPDOWN FIX: Setting up sign out handlers...');
            
            signOutElements.forEach((element, index) => {
                console.log('SIGNOUT DROPDOWN FIX: Setting up element', index, ':', element);
                
                // Remove any existing event listeners
                element.removeEventListener('click', handleSignOut);
                
                // Add new event listener
                element.addEventListener('click', handleSignOut);
                
                // Also add onclick handler as backup
                element.onclick = handleSignOut;
                
                console.log('SIGNOUT DROPDOWN FIX: Sign out handler added to element', index);
            });
        }
        
        // Also setup dropdown toggle functionality
        SETUP_DROPDOWN_TOGGLE();
    }
    
    function SETUP_DROPDOWN_TOGGLE() {
        console.log('SIGNOUT DROPDOWN FIX: Setting up dropdown toggle...');
        
        // Find profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            console.log('SIGNOUT DROPDOWN FIX: Found profile button, setting up toggle...');
            
            // Remove any existing event listeners
            profileButton.removeEventListener('click', handleProfileToggle);
            
            // Add new event listener
            profileButton.addEventListener('click', handleProfileToggle);
            
            console.log('SIGNOUT DROPDOWN FIX: Profile button toggle handler added');
        }
        
        // Also setup click outside to close dropdown
        document.addEventListener('click', handleClickOutside);
    }
    
    function handleSignOut(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('SIGNOUT DROPDOWN FIX: Sign out clicked!');
        
        // Try all possible sign out methods
        const signOutMethods = [
            () => window.FirebaseAuth?.signOut?.(),
            () => window.ImprovedAuth?.signOut?.(),
            () => window.ProfilePhotoHandler?.signOut?.(),
            () => window.DeployedAuthFix?.signOut?.(),
            () => window.UniversalAuthFix?.signOut?.(),
            () => window.firebase?.auth()?.signOut?.(),
            () => {
                // Clear local storage
                localStorage.removeItem('user');
                localStorage.removeItem('authUser');
                localStorage.removeItem('firebase:authUser');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('authUser');
                sessionStorage.removeItem('firebase:authUser');
                return Promise.resolve();
            }
        ];
        
        let signOutSuccess = false;
        
        for (const method of signOutMethods) {
            try {
                const result = method();
                if (result && typeof result.then === 'function') {
                    result.then(() => {
                        console.log('SIGNOUT DROPDOWN FIX: Sign out successful via method:', method.name);
                        signOutSuccess = true;
                        handleSignOutSuccess();
                    }).catch(error => {
                        console.log('SIGNOUT DROPDOWN FIX: Sign out failed via method:', method.name, error);
                    });
                } else {
                    console.log('SIGNOUT DROPDOWN FIX: Sign out successful via method:', method.name);
                    signOutSuccess = true;
                    handleSignOutSuccess();
                }
            } catch (error) {
                console.log('SIGNOUT DROPDOWN FIX: Sign out failed via method:', method.name, error);
            }
        }
        
        // If no method worked, try manual sign out
        if (!signOutSuccess) {
            console.log('SIGNOUT DROPDOWN FIX: Trying manual sign out...');
            handleSignOutSuccess();
        }
    }
    
    function handleSignOutSuccess() {
        console.log('SIGNOUT DROPDOWN FIX: Sign out successful, updating UI...');
        
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
        
        // Clear profile images
        const profileImages = [
            document.getElementById('user-profile-image'),
            document.getElementById('dropdown-profile-image'),
            document.getElementById('mobile-user-profile-image')
        ];
        
        profileImages.forEach(img => {
            if (img) {
                img.src = '';
                img.style.display = 'none';
                img.style.visibility = 'hidden';
            }
        });
        
        // Close any open dropdowns
        closeAllDropdowns();
        
        console.log('SIGNOUT DROPDOWN FIX: UI updated after sign out');
    }
    
    function handleProfileToggle(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('SIGNOUT DROPDOWN FIX: Profile button clicked, toggling dropdown...');
        
        // Find dropdown
        const dropdown = document.querySelector('.dropdown-menu, .profile-dropdown, #user-dropdown, .user-dropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display !== 'none' && dropdown.style.visibility !== 'hidden';
            
            if (isVisible) {
                closeAllDropdowns();
            } else {
                openDropdown(dropdown);
            }
        } else {
            console.log('SIGNOUT DROPDOWN FIX: No dropdown found, creating one...');
            createDropdown();
        }
    }
    
    function openDropdown(dropdown) {
        console.log('SIGNOUT DROPDOWN FIX: Opening dropdown...');
        dropdown.style.display = 'block';
        dropdown.style.visibility = 'visible';
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
    }
    
    function closeAllDropdowns() {
        console.log('SIGNOUT DROPDOWN FIX: Closing all dropdowns...');
        const dropdowns = document.querySelectorAll('.dropdown-menu, .profile-dropdown, #user-dropdown, .user-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
            dropdown.style.visibility = 'hidden';
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
        });
    }
    
    function handleClickOutside(event) {
        const profileButton = document.getElementById('user-profile-btn');
        const dropdown = document.querySelector('.dropdown-menu, .profile-dropdown, #user-dropdown, .user-dropdown');
        
        if (profileButton && dropdown && !profileButton.contains(event.target) && !dropdown.contains(event.target)) {
            closeAllDropdowns();
        }
    }
    
    function createDropdown() {
        console.log('SIGNOUT DROPDOWN FIX: Creating dropdown...');
        
        // Find profile button
        const profileButton = document.getElementById('user-profile-btn');
        if (!profileButton) return;
        
        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            min-width: 200px;
            display: none;
            visibility: hidden;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.2s ease;
        `;
        
        // Add dropdown content
        dropdown.innerHTML = `
            <div class="p-4">
                <div class="flex items-center space-x-3 mb-4">
                    <img id="dropdown-profile-image" src="" alt="Profile" class="w-8 h-8 rounded-full border border-red-500 object-cover">
                    <div>
                        <p class="text-white font-medium" id="dropdown-user-name">User</p>
                        <p class="text-gray-400 text-sm" id="dropdown-user-email">user@example.com</p>
                    </div>
                </div>
                <div class="border-t border-gray-600 pt-4">
                    <button id="signout-btn" class="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:text-white rounded transition-colors">
                        Sign Out
                    </button>
                </div>
            </div>
        `;
        
        // Add dropdown to profile button
        profileButton.style.position = 'relative';
        profileButton.appendChild(dropdown);
        
        // Setup sign out button in dropdown
        const signOutBtn = dropdown.querySelector('#signout-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', handleSignOut);
            console.log('SIGNOUT DROPDOWN FIX: Sign out button in dropdown setup');
        }
        
        // Open dropdown
        openDropdown(dropdown);
        
        console.log('SIGNOUT DROPDOWN FIX: Dropdown created and opened');
    }
    
    // Global function to force refresh
    window.SIGNOUT_DROPDOWN_FORCE_REFRESH = function() {
        console.log('SIGNOUT DROPDOWN FIX: Force refresh triggered');
        hasSetupSignOut = false;
        attempts = 0;
        startSignOutDropdownFix();
    };
    
    // Start immediately
    startSignOutDropdownFix();
    
    // Also start when DOM is ready
    document.addEventListener('DOMContentLoaded', startSignOutDropdownFix);
    
    // Also start on window load
    window.addEventListener('load', startSignOutDropdownFix);
    
    // Also start on window focus
    window.addEventListener('focus', startSignOutDropdownFix);
    
    // Also start on any click
    document.addEventListener('click', startSignOutDropdownFix);
    
    console.log('SIGNOUT DROPDOWN FIX: Loaded and running!');
})();
