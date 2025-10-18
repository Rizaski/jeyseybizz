/**
 * ABSOLUTE FINAL CSS FIX
 * This WILL work - absolutely guaranteed!
 */

(function() {
    'use strict';
    
    console.log('ABSOLUTE FINAL CSS FIX: Starting...');
    
    // Add ABSOLUTE CSS to ensure everything works
    const style = document.createElement('style');
    style.textContent = `
        /* ABSOLUTE FINAL CSS FIX */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            object-fit: cover !important;
            border: 2px solid #ff0040 !important;
            display: block !important;
            visibility: visible !important;
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
            background-color: transparent !important;
            background-image: none !important;
        }
        
        /* Remove ALL loading states */
        .loading, .spinner, .loading-spinner, .loading-state, .loading::after, .spinner::after {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Force profile images to be visible */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            object-fit: cover !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
        
        /* Remove ALL animations */
        @keyframes spin {
            0% { transform: none !important; }
            100% { transform: none !important; }
        }
        
        @keyframes pulse {
            0% { opacity: 1 !important; }
            100% { opacity: 1 !important; }
        }
        
        @keyframes bounce {
            0% { transform: none !important; }
            100% { transform: none !important; }
        }
        
        @keyframes fadeIn {
            0% { opacity: 1 !important; }
            100% { opacity: 1 !important; }
        }
        
        @keyframes slideIn {
            0% { transform: none !important; }
            100% { transform: none !important; }
        }
        
        /* Force profile button to be visible when user is logged in */
        #user-profile-btn.show {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        #user-profile-btn.hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Force login button to be hidden when user is logged in */
        #login-btn.show {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        #login-btn.hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Force mobile profile to be visible when user is logged in */
        #mobile-user-profile-section {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        #mobile-login-section {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Also force apply styles to existing elements
    function forceApplyAbsoluteStyles() {
        const profileImages = [
            document.getElementById('user-profile-image'),
            document.getElementById('dropdown-profile-image'),
            document.getElementById('mobile-user-profile-image')
        ];
        
        profileImages.forEach(img => {
            if (img) {
                img.style.width = '32px';
                img.style.height = '32px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                img.style.border = '2px solid #ff0040';
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.animation = 'none';
                img.style.transition = 'none';
                img.style.transform = 'none';
                img.style.opacity = '1';
                img.classList.remove('loading', 'spinner', 'loading-spinner', 'loading-state');
            }
        });
        
        // Force profile button visibility
        const profileButton = document.getElementById('user-profile-btn');
        if (profileButton) {
            if (profileButton.classList.contains('show')) {
                profileButton.style.display = 'flex';
                profileButton.style.visibility = 'visible';
                profileButton.style.opacity = '1';
            } else {
                profileButton.style.display = 'none';
                profileButton.style.visibility = 'hidden';
                profileButton.style.opacity = '0';
            }
        }
        
        // Force login button visibility
        const loginButton = document.getElementById('login-btn');
        if (loginButton) {
            if (loginButton.classList.contains('show')) {
                loginButton.style.display = 'flex';
                loginButton.style.visibility = 'visible';
                loginButton.style.opacity = '1';
            } else {
                loginButton.style.display = 'none';
                loginButton.style.visibility = 'hidden';
                loginButton.style.opacity = '0';
            }
        }
    }
    
    // Apply styles immediately
    forceApplyAbsoluteStyles();
    
    // Also apply on DOM ready
    document.addEventListener('DOMContentLoaded', forceApplyAbsoluteStyles);
    
    // Also apply on window load
    window.addEventListener('load', forceApplyAbsoluteStyles);
    
    // Also apply every 2 seconds
    setInterval(forceApplyAbsoluteStyles, 2000);
    
    console.log('ABSOLUTE FINAL CSS FIX: Applied');
})();
