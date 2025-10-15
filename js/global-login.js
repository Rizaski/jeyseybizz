// Global Login Handler - Works on all pages
(function() {
    'use strict';
    
    console.log('Global Login Handler loaded');
    
    // Force login redirect function
    function forceLoginRedirect() {
        console.log('Force login redirect triggered');
        window.location.href = 'login.html';
    }
    
    // Add event listeners to all login buttons
    function attachLoginListeners() {
        console.log('Attaching login listeners...');
        
        // Desktop login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            console.log('Desktop login button found');
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Desktop login button clicked');
                forceLoginRedirect();
            });
        } else {
            console.log('Desktop login button not found');
        }
        
        // Mobile login button
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        if (mobileLoginBtn) {
            console.log('Mobile login button found');
            mobileLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile login button clicked');
                forceLoginRedirect();
            });
        } else {
            console.log('Mobile login button not found');
        }
        
        // Profile button (if exists)
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            console.log('Profile button found');
            profileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Profile button clicked');
                forceLoginRedirect();
            });
        }
        
        // Any button with class 'login-button'
        const loginButtons = document.querySelectorAll('.login-button');
        loginButtons.forEach((btn, index) => {
            console.log(`Login button ${index} found`);
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Login button ${index} clicked`);
                forceLoginRedirect();
            });
        });
    }
    
    // Wait for DOM to be ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachLoginListeners);
        } else {
            attachLoginListeners();
        }
    }
    
    // Initialize immediately
    init();
    
    // Also try again after a short delay to catch dynamically loaded content
    setTimeout(attachLoginListeners, 1000);
    
    // Expose global function for manual triggering
    window.forceLoginRedirect = forceLoginRedirect;
    
})();
