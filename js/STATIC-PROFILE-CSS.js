/**
 * STATIC PROFILE CSS
 * Forces profile images to be static and never loading
 */

(function() {
    'use strict';
    
    console.log('STATIC PROFILE CSS: Starting static profile CSS...');
    
    // Add CSS to force profile images to be static and never loading
    const style = document.createElement('style');
    style.textContent = `
        /* STATIC PROFILE CSS - Forces profile images to be static */
        
        /* Force all profile images to be static and never loading */
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
            position: relative !important;
            z-index: 10 !important;
            /* Force static state */
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
        
        /* Remove ALL loading states - static */
        .loading, .spinner, .loading-spinner, .loading-state, .loading::after, .spinner::after {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Remove ALL animations - static */
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
        
        /* Force profile button to be static */
        #user-profile-btn {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 8px 12px !important;
            border-radius: 8px !important;
            border: 1px solid #ff0040 !important;
            background-color: rgba(255, 0, 64, 0.1) !important;
            color: white !important;
            transition: none !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 10 !important;
            /* Force static state */
            animation: none !important;
            transform: none !important;
        }
        
        #user-profile-btn:hover {
            background-color: rgba(255, 0, 64, 0.2) !important;
            border-color: #ff0040 !important;
            transform: none !important;
        }
        
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
        
        /* Force login button to be static */
        #login-btn {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 8px 16px !important;
            border-radius: 8px !important;
            background-color: #ff0040 !important;
            color: white !important;
            border: none !important;
            transition: none !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            position: relative !important;
            z-index: 10 !important;
            /* Force static state */
            animation: none !important;
            transform: none !important;
        }
        
        #login-btn:hover {
            background-color: #dc143c !important;
            transform: none !important;
        }
        
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
        
        /* Force dropdown to be static */
        #user-profile-dropdown {
            position: absolute !important;
            top: 100% !important;
            right: 0 !important;
            margin-top: 8px !important;
            width: 240px !important;
            background-color: #1f2937 !important;
            border: 1px solid #374151 !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            z-index: 1000 !important;
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            transform: translateY(-10px) !important;
            transition: none !important;
            /* Force static state */
            animation: none !important;
        }
        
        #user-profile-dropdown.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Force all text elements to be static */
        #dropdown-user-name, #dropdown-user-email, #mobile-user-name, #mobile-user-email {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Force all buttons to be static */
        #sign-out-btn {
            width: 100% !important;
            text-align: left !important;
            padding: 12px 16px !important;
            color: #ff0040 !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            transition: none !important;
            display: flex !important;
            align-items: center !important;
            /* Force static state */
            animation: none !important;
            transform: none !important;
        }
        
        #sign-out-btn:hover {
            background-color: rgba(255, 0, 64, 0.1) !important;
            transform: none !important;
        }
        
        /* Force mobile elements to be static */
        #mobile-user-profile-section {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            /* Force static state */
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        #mobile-user-profile-section.hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        #mobile-login-section {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            /* Force static state */
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        #mobile-login-section.hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Force all elements to be static - no animations */
        * {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Force all critical elements to be visible and static */
        #user-profile-btn, #login-btn, #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            min-width: 32px !important;
            min-height: 32px !important;
            /* Force static state */
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Force all text elements to be visible and static */
        #dropdown-user-name, #dropdown-user-email, #mobile-user-name, #mobile-user-email {
            min-height: 16px !important;
            line-height: 1.2 !important;
            /* Force static state */
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Force all buttons to be clickable and static */
        #user-profile-btn, #login-btn, #sign-out-btn {
            pointer-events: auto !important;
            user-select: none !important;
            /* Force static state */
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Force all dropdowns to be properly positioned and static */
        #user-profile-dropdown {
            position: absolute !important;
            top: 100% !important;
            right: 0 !important;
            z-index: 1000 !important;
            /* Force static state */
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Force all mobile elements to be responsive and static */
        @media (max-width: 640px) {
            #user-profile-btn, #login-btn {
                padding: 4px 8px !important;
                font-size: 12px !important;
                /* Force static state */
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            
            #user-profile-dropdown {
                width: 180px !important;
                right: -20px !important;
                /* Force static state */
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
        }
        
        /* Emergency static state - force everything to be static */
        .emergency-static {
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
        
        /* Force all profile images to be static - emergency */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            /* Force static state */
            animation: none !important;
            transition: none !important;
            transform: none !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Also force apply static styles to existing elements
    function forceApplyStaticStyles() {
        try {
            const profileImages = [
                document.getElementById('user-profile-image'),
                document.getElementById('dropdown-profile-image'),
                document.getElementById('mobile-user-profile-image')
            ];
            
            profileImages.forEach(img => {
                if (img) {
                    // Force static state
                    img.style.animation = 'none';
                    img.style.transition = 'none';
                    img.style.transform = 'none';
                    img.style.width = '32px';
                    img.style.height = '32px';
                    img.style.borderRadius = '50%';
                    img.style.objectFit = 'cover';
                    img.style.border = '2px solid #ff0040';
                    img.style.display = 'block';
                    img.style.visibility = 'visible';
                    img.style.opacity = '1';
                    img.classList.remove('loading', 'spinner', 'loading-spinner', 'loading-state');
                    img.classList.add('emergency-static');
                }
            });
            
            // Force profile button to be static
            const profileButton = document.getElementById('user-profile-btn');
            if (profileButton) {
                profileButton.style.animation = 'none';
                profileButton.style.transition = 'none';
                profileButton.style.transform = 'none';
                profileButton.classList.add('emergency-static');
            }
            
            // Force login button to be static
            const loginButton = document.getElementById('login-btn');
            if (loginButton) {
                loginButton.style.animation = 'none';
                loginButton.style.transition = 'none';
                loginButton.style.transform = 'none';
                loginButton.classList.add('emergency-static');
            }
            
            // Force dropdown to be static
            const dropdown = document.getElementById('user-profile-dropdown');
            if (dropdown) {
                dropdown.style.animation = 'none';
                dropdown.style.transition = 'none';
                dropdown.style.transform = 'none';
                dropdown.classList.add('emergency-static');
            }
            
            // Force all elements to be static
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                element.style.animation = 'none';
                element.style.transition = 'none';
                element.style.transform = 'none';
                element.classList.add('emergency-static');
            });
        } catch (error) {
            console.log('STATIC PROFILE CSS: Error applying static styles:', error);
        }
    }
    
    // Apply static styles immediately
    forceApplyStaticStyles();
    
    // Also apply on DOM ready
    document.addEventListener('DOMContentLoaded', forceApplyStaticStyles);
    
    // Also apply on window load
    window.addEventListener('load', forceApplyStaticStyles);
    
    // Also apply every 1 second to ensure static state
    setInterval(forceApplyStaticStyles, 1000);
    
    // Also apply on any change
    document.addEventListener('click', forceApplyStaticStyles);
    document.addEventListener('scroll', forceApplyStaticStyles);
    document.addEventListener('resize', forceApplyStaticStyles);
    
    console.log('STATIC PROFILE CSS: Static profile CSS applied - no more loading!');
})();
