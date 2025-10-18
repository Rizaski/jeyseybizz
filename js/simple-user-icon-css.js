/**
 * Simple User Icon CSS
 * Ensures user icons are always styled correctly
 */

(function() {
    'use strict';
    
    console.log('Simple User Icon CSS: Starting...');
    
    // Add CSS to ensure user icons are always styled correctly
    const style = document.createElement('style');
    style.textContent = `
        /* Simple User Icon Styles */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            background-color: #ff0040 !important;
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: bold !important;
            font-size: 16px !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            border: 2px solid #ff0040 !important;
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
        
        /* Ensure no external image loading */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            src: '' !important;
            background-image: none !important;
        }
        
        /* Force user icon display */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            object-fit: none !important;
            background-size: auto !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
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
                img.style.backgroundColor = '#ff0040';
                img.style.color = 'white';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.style.fontWeight = 'bold';
                img.style.fontSize = '16px';
                img.style.width = '32px';
                img.style.height = '32px';
                img.style.borderRadius = '50%';
                img.style.border = '2px solid #ff0040';
                img.style.animation = 'none';
                img.style.transition = 'none';
                img.style.transform = 'none';
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.src = '';
            }
        });
    }
    
    // Apply styles immediately
    forceApplyStyles();
    
    // Also apply on DOM ready
    document.addEventListener('DOMContentLoaded', forceApplyStyles);
    
    // Also apply on window load
    window.addEventListener('load', forceApplyStyles);
    
    console.log('Simple User Icon CSS: Applied');
})();
