/**
 * Clean Profile CSS
 * Ensures clean Gmail profile picture loading
 */

(function() {
    'use strict';
    
    console.log('Clean Profile CSS: Starting...');
    
    // Add CSS to ensure clean profile picture loading
    const style = document.createElement('style');
    style.textContent = `
        /* Clean Profile Picture Styles */
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
        }
        
        /* Remove any loading states */
        .loading, .spinner, .loading-spinner, .loading-state {
            display: none !important;
        }
        
        /* Ensure profile images are visible */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            background-color: transparent !important;
            background-image: none !important;
        }
        
        /* Force profile image display */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            object-fit: cover !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
        
        /* Remove any loading animations */
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
    `;
    
    document.head.appendChild(style);
    
    // Also force apply styles to existing elements
    function forceApplyStyles() {
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
    }
    
    // Apply styles immediately
    forceApplyStyles();
    
    // Also apply on DOM ready
    document.addEventListener('DOMContentLoaded', forceApplyStyles);
    
    // Also apply on window load
    window.addEventListener('load', forceApplyStyles);
    
    console.log('Clean Profile CSS: Applied');
})();
