/**
 * REDESIGNED GMAIL LOGIN CSS
 * CSS for redesigned Gmail login - solid and working perfectly
 */

(function() {
    'use strict';
    
    console.log('REDESIGNED GMAIL LOGIN CSS: Starting...');
    
    // Add CSS to ensure redesigned Gmail login works perfectly
    const style = document.createElement('style');
    style.textContent = `
        /* REDESIGNED GMAIL LOGIN CSS */
        
        /* Profile Images */
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
        
        /* Profile Button */
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
        
        /* Login Button */
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
        
        /* Profile Dropdown */
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
        
        /* Dropdown Content */
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
        
        /* User Info in Dropdown */
        #dropdown-user-name {
            font-weight: 600 !important;
            color: white !important;
            font-size: 14px !important;
        }
        
        #dropdown-user-email {
            color: #9ca3af !important;
            font-size: 12px !important;
        }
        
        /* Sign Out Button */
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
        
        /* Mobile User Profile */
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
        
        /* Mobile User Info */
        #mobile-user-name {
            font-weight: 600 !important;
            color: white !important;
            font-size: 14px !important;
        }
        
        #mobile-user-email {
            color: #9ca3af !important;
            font-size: 12px !important;
        }
        
        /* Remove all loading states */
        .loading, .spinner, .loading-spinner, .loading-state, .loading::after, .spinner::after {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        
        /* Remove all animations */
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
        
        /* Force profile images to be visible */
        #user-profile-image, #dropdown-profile-image, #mobile-user-profile-image {
            object-fit: cover !important;
            background-size: cover !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }
        
        /* Responsive Design */
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
        
        /* Ensure all elements are properly styled */
        .redesigned-gmail-login * {
            box-sizing: border-box !important;
        }
        
        /* Force visibility for critical elements */
        #user-profile-btn, #login-btn, #user-profile-dropdown {
            position: relative !important;
            z-index: 10 !important;
        }
        
        /* Ensure proper spacing */
        .flex.items-center.space-x-4 > * + * {
            margin-left: 16px !important;
        }
        
        .flex.items-center.space-x-2 > * + * {
            margin-left: 8px !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Also force apply styles to existing elements
    function forceApplyRedesignedStyles() {
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
        
        // Force dropdown visibility
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
    }
    
    // Apply styles immediately
    forceApplyRedesignedStyles();
    
    // Also apply on DOM ready
    document.addEventListener('DOMContentLoaded', forceApplyRedesignedStyles);
    
    // Also apply on window load
    window.addEventListener('load', forceApplyRedesignedStyles);
    
    // Also apply every 2 seconds
    setInterval(forceApplyRedesignedStyles, 2000);
    
    console.log('REDESIGNED GMAIL LOGIN CSS: Applied');
})();
