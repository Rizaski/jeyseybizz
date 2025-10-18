/**
 * STOP CONSTANT LOADING
 * Stops the depressing constant loading of user profile icon
 */

(function() {
    'use strict';
    
    console.log('STOP CONSTANT LOADING: Starting to stop constant loading...');
    
    let hasStoppedLoading = false;
    let loadingAttempts = 0;
    const maxLoadingAttempts = 10;
    
    // Stop constant loading immediately
    function stopConstantLoading() {
        if (hasStoppedLoading) return;
        
        console.log('STOP CONSTANT LOADING: Stopping constant loading...');
        hasStoppedLoading = true;
        
        // Stop all loading animations and states
        stopAllLoadingAnimations();
        
        // Force set profile images to static state
        forceSetProfileImagesStatic();
        
        // Remove all loading classes and states
        removeAllLoadingStates();
        
        // Set profile images to user icon immediately
        setUserIconsImmediately();
        
        console.log('STOP CONSTANT LOADING: Constant loading stopped');
    }
    
    // Stop all loading animations
    function stopAllLoadingAnimations() {
        console.log('STOP CONSTANT LOADING: Stopping all loading animations...');
        
        // Remove all loading classes
        const loadingClasses = [
            'loading', 'spinner', 'loading-spinner', 'loading-state',
            'animate-spin', 'animate-pulse', 'animate-bounce',
            'loading::after', 'spinner::after', 'loading-spinner::after'
        ];
        
        loadingClasses.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                element.classList.remove(className);
                element.style.animation = 'none';
                element.style.transition = 'none';
                element.style.transform = 'none';
            });
        });
        
        // Stop all CSS animations
        const style = document.createElement('style');
        style.textContent = `
            .loading, .spinner, .loading-spinner, .loading-state {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            
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
    }
    
    // Force set profile images to static state
    function forceSetProfileImagesStatic() {
        console.log('STOP CONSTANT LOADING: Setting profile images to static state...');
        
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('STOP CONSTANT LOADING: Setting', selector, 'to static state');
                
                // Clear all loading states
                img.classList.remove('loading', 'spinner', 'loading-spinner', 'loading-state');
                img.style.animation = 'none';
                img.style.transition = 'none';
                img.style.transform = 'none';
                img.style.opacity = '1';
                
                // Set static dimensions
                img.style.width = '32px';
                img.style.height = '32px';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                img.style.border = '2px solid #ff0040';
                img.style.display = 'block';
                img.style.visibility = 'visible';
                
                // Remove any loading handlers
                img.onload = null;
                img.onerror = null;
                
                console.log('STOP CONSTANT LOADING: Static state set for', selector);
            }
        });
    }
    
    // Remove all loading states
    function removeAllLoadingStates() {
        console.log('STOP CONSTANT LOADING: Removing all loading states...');
        
        // Remove loading classes from all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            element.classList.remove('loading', 'spinner', 'loading-spinner', 'loading-state');
            element.style.animation = 'none';
            element.style.transition = 'none';
            element.style.transform = 'none';
        });
        
        // Remove loading spinners
        const spinners = document.querySelectorAll('.spinner, .loading-spinner, .loading');
        spinners.forEach(spinner => {
            spinner.style.display = 'none';
            spinner.style.visibility = 'hidden';
            spinner.style.opacity = '0';
        });
    }
    
    // Set user icons immediately
    function setUserIconsImmediately() {
        console.log('STOP CONSTANT LOADING: Setting user icons immediately...');
        
        // Get current user
        let user = null;
        try {
            user = window.BulletproofGmailLogin?.getCurrentUser?.() || 
                   window.RedesignedGmailLogin?.getCurrentUser?.() || 
                   window.FirebaseAuth?.getCurrentUser?.() || 
                   window.firebase?.auth()?.currentUser;
        } catch (error) {
            console.log('STOP CONSTANT LOADING: Error getting user:', error);
        }
        
        if (user && user.email) {
            console.log('STOP CONSTANT LOADING: User found, setting profile images');
            setProfileImagesForUser(user);
        } else {
            console.log('STOP CONSTANT LOADING: No user found, setting default icons');
            setDefaultUserIcons();
        }
    }
    
    // Set profile images for user
    function setProfileImagesForUser(user) {
        const displayName = user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'User');
        const photoURL = user.photoURL || user.avatar || '';
        
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log('STOP CONSTANT LOADING: Setting profile image for', selector);
                
                if (photoURL && photoURL !== '') {
                    // Set the image immediately without loading handlers
                    img.src = photoURL;
                    img.style.display = 'block';
                    img.style.visibility = 'visible';
                    img.style.width = '32px';
                    img.style.height = '32px';
                    img.style.borderRadius = '50%';
                    img.style.objectFit = 'cover';
                    img.style.border = '2px solid #ff0040';
                    
                    // Handle error with fallback
                    img.onerror = () => {
                        console.log('STOP CONSTANT LOADING: Image failed for', selector, ', using fallback');
                        setFallbackIcon(img, displayName);
                    };
                } else {
                    setFallbackIcon(img, displayName);
                }
            }
        });
    }
    
    // Set default user icons
    function setDefaultUserIcons() {
        console.log('STOP CONSTANT LOADING: Setting default user icons');
        
        const profileImageSelectors = [
            '#user-profile-image',
            '#dropdown-profile-image',
            '#mobile-user-profile-image'
        ];
        
        profileImageSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                setFallbackIcon(img, 'U');
            }
        });
    }
    
    // Set fallback icon
    function setFallbackIcon(imgElement, displayName) {
        const initial = displayName.charAt(0).toUpperCase();
        
        imgElement.style.backgroundColor = '#ff0040';
        imgElement.style.color = 'white';
        imgElement.style.display = 'flex';
        imgElement.style.alignItems = 'center';
        imgElement.style.justifyContent = 'center';
        imgElement.style.fontWeight = 'bold';
        imgElement.style.fontSize = '16px';
        imgElement.style.width = '32px';
        imgElement.style.height = '32px';
        imgElement.style.borderRadius = '50%';
        imgElement.style.border = '2px solid #ff0040';
        imgElement.textContent = initial;
        imgElement.src = '';
        
        console.log('STOP CONSTANT LOADING: Fallback icon set for', imgElement.id);
    }
    
    // Stop all monitoring and loading attempts
    function stopAllMonitoring() {
        console.log('STOP CONSTANT LOADING: Stopping all monitoring...');
        
        // Clear all intervals
        for (let i = 1; i < 10000; i++) {
            clearInterval(i);
        }
        
        // Clear all timeouts
        for (let i = 1; i < 10000; i++) {
            clearTimeout(i);
        }
        
        // Remove all event listeners that might cause loading
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            element.onload = null;
            element.onerror = null;
        });
    }
    
    // Force stop all authentication monitoring
    function forceStopAuthMonitoring() {
        console.log('STOP CONSTANT LOADING: Force stopping auth monitoring...');
        
        // Stop all authentication handlers
        if (window.BulletproofGmailLogin) {
            window.BulletproofGmailLogin.forceRefresh = () => {};
        }
        if (window.RedesignedGmailLogin) {
            window.RedesignedGmailLogin.forceRefresh = () => {};
        }
        if (window.FirebaseAuth) {
            window.FirebaseAuth.forceRefresh = () => {};
        }
        
        // Stop all monitoring functions
        const monitoringFunctions = [
            'startBulletproofAuthenticationMonitoring',
            'startRedesignedAuthenticationMonitoring',
            'startAuthenticationMonitoring',
            'checkAuthenticationState',
            'bulletproofCheckAuthenticationState'
        ];
        
        monitoringFunctions.forEach(funcName => {
            if (window[funcName]) {
                window[funcName] = () => {};
            }
        });
    }
    
    // Main function to stop constant loading
    function stopConstantLoadingMain() {
        console.log('STOP CONSTANT LOADING: Main function to stop constant loading...');
        
        loadingAttempts++;
        
        if (loadingAttempts >= maxLoadingAttempts) {
            console.log('STOP CONSTANT LOADING: Max attempts reached, forcing stop');
            return;
        }
        
        // Stop constant loading
        stopConstantLoading();
        
        // Stop all monitoring
        stopAllMonitoring();
        
        // Force stop auth monitoring
        forceStopAuthMonitoring();
        
        // Set user icons immediately
        setUserIconsImmediately();
        
        console.log('STOP CONSTANT LOADING: Constant loading stopped successfully');
    }
    
    // Start stopping constant loading immediately
    stopConstantLoadingMain();
    
    // Also stop on DOM ready
    document.addEventListener('DOMContentLoaded', stopConstantLoadingMain);
    
    // Also stop on window load
    window.addEventListener('load', stopConstantLoadingMain);
    
    // Also stop on any click
    document.addEventListener('click', stopConstantLoadingMain);
    
    // Also stop on any scroll
    document.addEventListener('scroll', stopConstantLoadingMain);
    
    // Also stop every 2 seconds
    setInterval(stopConstantLoadingMain, 2000);
    
    // Global function to force stop
    window.STOP_CONSTANT_LOADING = stopConstantLoadingMain;
    
    console.log('STOP CONSTANT LOADING: Loaded and running - constant loading will be stopped!');
})();
