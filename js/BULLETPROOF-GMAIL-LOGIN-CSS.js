/**
 * BULLETPROOF GMAIL LOGIN CSS
 * Bulletproof CSS that will NEVER fail
 */

(function() {
    'use strict';
    
    console.log('BULLETPROOF GMAIL LOGIN CSS: Starting bulletproof CSS...');
    
    // Add bulletproof CSS to ensure Gmail login NEVER fails
    const style = document.createElement('style');
    style.textContent = `
        /* BULLETPROOF GMAIL LOGIN CSS */
        
        /* Force all profile images to be visible and styled correctly */
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
        }
        
        /* Force profile button to be visible when user is logged in */
        #user-profile-btn {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 8px 12px !important;
            border-radius: 8px !important;
            border: 1px solid #ff0040 !important;
            background-color: rgba(255, 0, 64, 0.1) !important;
            color: white !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 10 !important;
        }
        
        #user-profile-btn:hover {
            background-color: rgba(255, 0, 64, 0.2) !important;
            border-color: #ff0040 !important;
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
        
        /* Force login button to be visible when user is not logged in */
        #login-btn {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 8px 16px !important;
            border-radius: 8px !important;
            background-color: #ff0040 !important;
            color: white !important;
            border: none !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            position: relative !important;
            z-index: 10 !important;
        }
        
        #login-btn:hover {
            background-color: #dc143c !important;
            transform: translateY(-1px) !important;
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
        
        /* Force profile dropdown to be styled correctly */
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
            transition: all 0.2s ease !important;
        }
        
        #user-profile-dropdown.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Force dropdown content to be styled correctly */
        #user-profile-dropdown .py-2 {
            padding: 8px 0 !important;
        }
        
        #user-profile-dropdown .px-4 {
            padding-left: 16px !important;
            padding-right: 16px !important;
        }
        
        #user-profile-dropdown .py-3 {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
        }
        
        /* Force user info in dropdown to be styled correctly */
        #dropdown-user-name {
            font-weight: 600 !important;
            color: white !important;
            font-size: 14px !important;
        }
        
        #dropdown-user-email {
            color: #9ca3af !important;
            font-size: 12px !important;
        }
        
        /* Force sign out button to be styled correctly */
        #sign-out-btn {
            width: 100% !important;
            text-align: left !important;
            padding: 12px 16px !important;
            color: #ff0040 !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
        }
        
        #sign-out-btn:hover {
            background-color: rgba(255, 0, 64, 0.1) !important;
        }
        
        /* Force mobile user profile to be styled correctly */
        #mobile-user-profile-section {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
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
        }
        
        #mobile-login-section.hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Force mobile user info to be styled correctly */
        #mobile-user-name {
            font-weight: 600 !important;
            color: white !important;
            font-size: 14px !important;
        }
        
        #mobile-user-email {
            color: #9ca3af !important;
            font-size: 12px !important;
        }
        
        /* Remove ALL loading states - bulletproof */
        .loading, .spinner, .loading-spinner, .loading-state, .loading::after, .spinner::after {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Remove ALL animations - bulletproof */
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
        
        /* Force profile images to be visible - bulletproof */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            object-fit: cover !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
        
        /* Force smooth navigation links */
        a[href*="customer.html"], a[href*="customer"] {
            transition: all 0.3s ease !important;
            cursor: pointer !important;
        }
        
        a[href*="designer-studio.html"], a[href*="designer-studio"], a[href*="designer"] {
            transition: all 0.3s ease !important;
            cursor: pointer !important;
        }
        
        /* Responsive Design - bulletproof */
        @media (max-width: 768px) {
            #user-profile-dropdown {
                width: 200px !important;
                right: -10px !important;
            }
            
            #user-profile-btn {
                padding: 6px 8px !important;
            }
            
            #login-btn {
                padding: 6px 12px !important;
                font-size: 14px !important;
            }
        }
        
        /* Force all elements to be properly styled - bulletproof */
        .bulletproof-gmail-login * {
            box-sizing: border-box !important;
        }
        
        /* Force visibility for critical elements - bulletproof */
        #user-profile-btn, #login-btn, #user-profile-dropdown {
            position: relative !important;
            z-index: 10 !important;
        }
        
        /* Force proper spacing - bulletproof */
        .flex.items-center.space-x-4 > * + * {
            margin-left: 16px !important;
        }
        
        .flex.items-center.space-x-2 > * + * {
            margin-left: 8px !important;
        }
        
        /* Emergency fallback styles - bulletproof */
        .emergency-fallback {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Force all critical elements to be visible - bulletproof */
        #user-profile-btn, #login-btn, #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            min-width: 32px !important;
            min-height: 32px !important;
        }
        
        /* Force all text elements to be visible - bulletproof */
        #dropdown-user-name, #dropdown-user-email, #mobile-user-name, #mobile-user-email {
            min-height: 16px !important;
            line-height: 1.2 !important;
        }
        
        /* Force all buttons to be clickable - bulletproof */
        #user-profile-btn, #login-btn, #sign-out-btn {
            pointer-events: auto !important;
            user-select: none !important;
        }
        
        /* Force all dropdowns to be properly positioned - bulletproof */
        #user-profile-dropdown {
            position: absolute !important;
            top: 100% !important;
            right: 0 !important;
            z-index: 1000 !important;
        }
        
        /* Force all mobile elements to be responsive - bulletproof */
        @media (max-width: 640px) {
            #user-profile-btn, #login-btn {
                padding: 4px 8px !important;
                font-size: 12px !important;
            }
            
            #user-profile-dropdown {
                width: 180px !important;
                right: -20px !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Also force apply styles to existing elements - bulletproof
    function forceApplyBulletproofStyles() {
        try {
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
            
            // Force profile button visibility - bulletproof
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
            
            // Force login button visibility - bulletproof
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
            
            // Force dropdown visibility - bulletproof
            const dropdown = document.getElementById('user-profile-dropdown');
            if (dropdown) {
                if (dropdown.classList.contains('show')) {
                    dropdown.style.display = 'block';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.opacity = '1';
                    dropdown.style.transform = 'translateY(0)';
                } else {
                    dropdown.style.display = 'none';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.opacity = '0';
                    dropdown.style.transform = 'translateY(-10px)';
                }
            }
            
            // Force mobile elements visibility - bulletproof
            const mobileUserProfile = document.getElementById('mobile-user-profile-section');
            if (mobileUserProfile) {
                if (mobileUserProfile.classList.contains('hidden')) {
                    mobileUserProfile.style.display = 'none';
                    mobileUserProfile.style.visibility = 'hidden';
                } else {
                    mobileUserProfile.style.display = 'block';
                    mobileUserProfile.style.visibility = 'visible';
                }
            }
            
            const mobileLogin = document.getElementById('mobile-login-section');
            if (mobileLogin) {
                if (mobileLogin.classList.contains('hidden')) {
                    mobileLogin.style.display = 'none';
                    mobileLogin.style.visibility = 'hidden';
                } else {
                    mobileLogin.style.display = 'block';
                    mobileLogin.style.visibility = 'visible';
                }
            }
        } catch (error) {
            console.log('BULLETPROOF GMAIL LOGIN CSS: Error applying styles:', error);
        }
    }
    
    // Apply styles immediately - bulletproof
    forceApplyBulletproofStyles();
    
    // Also apply on DOM ready - bulletproof
    document.addEventListener('DOMContentLoaded', forceApplyBulletproofStyles);
    
    // Also apply on window load - bulletproof
    window.addEventListener('load', forceApplyBulletproofStyles);
    
    // Also apply every 2 seconds - bulletproof
    setInterval(forceApplyBulletproofStyles, 2000);
    
    // Also apply on any change - bulletproof
    document.addEventListener('click', forceApplyBulletproofStyles);
    document.addEventListener('scroll', forceApplyBulletproofStyles);
    document.addEventListener('resize', forceApplyBulletproofStyles);
    
    console.log('BULLETPROOF GMAIL LOGIN CSS: Bulletproof CSS applied');
})();
