/**
 * Chat Modal Behavior Fix
 * Prevents modal from being forced on top and ensures proper behavior
 */

(function() {
    'use strict';
    
    console.log('Chat Modal Behavior Fix: Starting...');
    
    let isInitialized = false;
    
    function initialize() {
        if (isInitialized) return;
        
        console.log('Chat Modal Behavior Fix: Initializing...');
        isInitialized = true;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixModalBehavior);
        } else {
            fixModalBehavior();
        }
    }
    
    function fixModalBehavior() {
        console.log('Chat Modal Behavior Fix: Fixing modal behavior...');
        
        // Find all chat modals
        const chatModals = document.querySelectorAll('#chat-modal, #customer-chat-modal');
        
        chatModals.forEach((modal, index) => {
            if (modal) {
                console.log(`Chat Modal Behavior Fix: Fixing modal ${index}`);
                
                // Ensure modal is hidden by default
                hideModal(modal);
                
                // Fix z-index to prevent forced overlay
                fixModalZIndex(modal);
                
                // Set up proper show/hide behavior
                setupModalBehavior(modal);
            }
        });
        
        // Set up chat button behavior
        setupChatButtonBehavior();
    }
    
    function hideModal(modal) {
        console.log('Chat Modal Behavior Fix: Hiding modal');
        
        // Multiple ways to hide the modal
        modal.classList.add('hidden');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.style.zIndex = '-1';
    }
    
    function showModal(modal) {
        console.log('Chat Modal Behavior Fix: Showing modal');
        
        // Multiple ways to show the modal
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        modal.style.zIndex = '50';
    }
    
    function fixModalZIndex(modal) {
        console.log('Chat Modal Behavior Fix: Fixing z-index');
        
        // Set reasonable z-index that doesn't force overlay
        modal.style.zIndex = '50';
        
        // Add CSS to prevent forced overlay
        const style = document.createElement('style');
        style.textContent = `
            #chat-modal, #customer-chat-modal {
                z-index: 50 !important;
                position: fixed !important;
                display: none !important;
            }
            
            #chat-modal:not(.hidden), #customer-chat-modal:not(.hidden) {
                display: flex !important;
            }
            
            /* Prevent modal from being forced on top */
            #chat-modal, #customer-chat-modal {
                pointer-events: none !important;
            }
            
            #chat-modal:not(.hidden), #customer-chat-modal:not(.hidden) {
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    function setupModalBehavior(modal) {
        console.log('Chat Modal Behavior Fix: Setting up modal behavior');
        
        // Set up close button behavior
        const closeButtons = modal.querySelectorAll('#close-chat, #close-chat-modal, #close-chat-fix, .close-chat, [data-close-chat]');
        closeButtons.forEach(closeBtn => {
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Chat Modal Behavior Fix: Close button clicked');
                    hideModal(modal);
                });
            }
        });
        
        // Set up outside click to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('Chat Modal Behavior Fix: Modal clicked outside, closing');
                hideModal(modal);
            }
        });
        
        // Set up ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                console.log('Chat Modal Behavior Fix: ESC key pressed, closing modal');
                hideModal(modal);
            }
        });
    }
    
    function setupChatButtonBehavior() {
        console.log('Chat Modal Behavior Fix: Setting up chat button behavior');
        
        // Find all chat buttons
        const chatButtons = document.querySelectorAll('#chat-btn, #mobile-chat-btn, #floating-chat-btn');
        
        chatButtons.forEach((button, index) => {
            if (button) {
                // Remove any existing listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add new event listener
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Chat Modal Behavior Fix: Chat button ${index} clicked`);
                    openChatModal();
                });
            }
        });
    }
    
    function openChatModal() {
        console.log('Chat Modal Behavior Fix: Opening chat modal');
        
        // Find the first available chat modal
        const chatModal = document.querySelector('#chat-modal, #customer-chat-modal');
        if (chatModal) {
            showModal(chatModal);
        } else {
            console.error('Chat Modal Behavior Fix: No chat modal found');
        }
    }
    
    function closeChatModal() {
        console.log('Chat Modal Behavior Fix: Closing chat modal');
        
        // Close all chat modals
        const chatModals = document.querySelectorAll('#chat-modal, #customer-chat-modal');
        chatModals.forEach(modal => {
            hideModal(modal);
        });
    }
    
    // Global functions
    window.openChatModal = openChatModal;
    window.closeChatModal = closeChatModal;
    
    // Initialize immediately
    initialize();
    
    // Also initialize when DOM is ready as backup
    document.addEventListener('DOMContentLoaded', initialize);
    
    console.log('Chat Modal Behavior Fix: Loaded');
})();
