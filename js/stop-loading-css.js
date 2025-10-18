/**
 * Stop Loading CSS Fix
 * Stops all loading animations and loops
 */

(function() {
    'use strict';
    
    console.log('Stop Loading CSS Fix: Starting...');
    
    // Add CSS to stop all loading animations
    const style = document.createElement('style');
    style.textContent = `
        /* Stop all loading animations */
        .loading, .spinner, .loading-spinner {
            animation: none !important;
            background: none !important;
            border: none !important;
        }
        
        /* Stop profile image loading loops */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            animation: none !important;
            transition: none !important;
        }
        
        /* Remove any loading indicators */
        .loading::after, .spinner::after {
            display: none !important;
        }
        
        /* Stop any rotating animations */
        @keyframes spin {
            0% { transform: none !important; }
            100% { transform: none !important; }
        }
        
        /* Stop any pulsing animations */
        @keyframes pulse {
            0% { opacity: 1 !important; }
            100% { opacity: 1 !important; }
        }
        
        /* Stop any bouncing animations */
        @keyframes bounce {
            0% { transform: none !important; }
            100% { transform: none !important; }
        }
        
        /* Force profile images to be static */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        /* Remove any loading states */
        .loading, .spinner, .loading-spinner, .loading-state {
            display: none !important;
        }
        
        /* Force profile images to show immediately */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: #ff0040 !important;
            color: white !important;
            font-weight: bold !important;
            font-size: 16px !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            border: 2px solid #ff0040 !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Also remove any loading classes from profile images
    function removeLoadingClasses() {
        const profileImages = [
            document.getElementById('user-profile-image'),
            document.getElementById('dropdown-profile-image'),
            document.getElementById('mobile-user-profile-image')
        ];
        
        profileImages.forEach(img => {
            if (img) {
                img.classList.remove('loading', 'spinner', 'loading-spinner', 'loading-state');
                img.style.animation = 'none';
                img.style.transition = 'none';
                img.style.transform = 'none';
            }
        });
    }
    
    // Remove loading classes immediately
    removeLoadingClasses();
    
    // Also remove on DOM ready
    document.addEventListener('DOMContentLoaded', removeLoadingClasses);
    
    // Also remove on window load
    window.addEventListener('load', removeLoadingClasses);
    
    console.log('Stop Loading CSS Fix: Applied');
})();
