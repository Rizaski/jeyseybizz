/**
 * Chat Modal Fix
 * Fixes close button functionality and modal positioning
 */

(function() {
    'use strict';
    
    console.log('Chat Modal Fix: Starting...');
    
    let isInitialized = false;
    
    function initialize() {
        if (isInitialized) return;
        
        console.log('Chat Modal Fix: Initializing...');
        isInitialized = true;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupChatModals);
        } else {
            setupChatModals();
        }
    }
    
    function setupChatModals() {
        console.log('Chat Modal Fix: Setting up chat modals...');
        
        // Find all chat modals
        const chatModals = document.querySelectorAll('#chat-modal, #customer-chat-modal');
        
        chatModals.forEach((modal, index) => {
            if (modal) {
                console.log(`Chat Modal Fix: Setting up modal ${index}`);
                
                // Fix modal positioning
                fixModalPosition(modal);
                
                // Set up close button functionality
                setupCloseButtons(modal);
                
                // Set up outside click to close
                setupOutsideClick(modal);
            }
        });
    }
    
    function fixModalPosition(modal) {
        console.log('Chat Modal Fix: Fixing modal position');
        
        // Add CSS to ensure modal is positioned higher
        const style = document.createElement('style');
        style.textContent = `
            #chat-modal, #customer-chat-modal {
                display: flex !important;
                align-items: flex-start !important;
                justify-content: center !important;
                padding-top: 5vh !important;
                padding-bottom: 5vh !important;
                overflow-y: auto !important;
            }
            
            #chat-modal .flex, #customer-chat-modal .flex {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    function setupCloseButtons(modal) {
        console.log('Chat Modal Fix: Setting up close buttons for modal');
        
        // Find all possible close button selectors
        const closeButtonSelectors = [
            '#close-chat',
            '#close-chat-modal', 
            '.close-chat',
            '[data-close-chat]',
            'button[aria-label="close"]',
            'button[aria-label="Close"]'
        ];
        
        closeButtonSelectors.forEach(selector => {
            const closeButtons = modal.querySelectorAll(selector);
            closeButtons.forEach(closeBtn => {
                if (closeBtn) {
                    console.log(`Chat Modal Fix: Found close button: ${selector}`);
                    
                    // Remove any existing listeners
                    const newCloseBtn = closeBtn.cloneNode(true);
                    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                    
                    // Add new event listener
                    newCloseBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Chat Modal Fix: Close button clicked');
                        closeModal(modal);
                    });
                }
            });
        });
        
        // Also add a global close button if none found
        if (modal.querySelectorAll('#close-chat, #close-chat-modal, .close-chat, [data-close-chat]').length === 0) {
            console.log('Chat Modal Fix: No close button found, adding one');
            addCloseButton(modal);
        }
    }
    
    function addCloseButton(modal) {
        // Find the modal header
        const header = modal.querySelector('.bg-rog-red, .bg-red-600, .bg-black, .bg-gray-800');
        if (header) {
            const closeBtn = document.createElement('button');
            closeBtn.id = 'close-chat-fix';
            closeBtn.className = 'text-white hover:text-gray-300 transition-colors p-2';
            closeBtn.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;
            closeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; z-index: 10;';
            
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Chat Modal Fix: Added close button clicked');
                closeModal(modal);
            });
            
            header.style.position = 'relative';
            header.appendChild(closeBtn);
        }
    }
    
    function setupOutsideClick(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('Chat Modal Fix: Modal clicked outside, closing');
                closeModal(modal);
            }
        });
    }
    
    function closeModal(modal) {
        console.log('Chat Modal Fix: Closing modal');
        
        // Hide the modal
        modal.classList.add('hidden');
        modal.style.display = 'none';
        
        // Remove from DOM temporarily to ensure it's closed
        setTimeout(() => {
            modal.style.display = '';
        }, 100);
        
        // Also try alternative close methods
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.visibility = '';
            modal.style.opacity = '';
        }, 200);
    }
    
    // Global function to close all chat modals
    window.closeAllChatModals = function() {
        console.log('Chat Modal Fix: Closing all chat modals');
        const chatModals = document.querySelectorAll('#chat-modal, #customer-chat-modal');
        chatModals.forEach(modal => {
            closeModal(modal);
        });
    };
    
    // Global function to open chat modal
    window.openChatModal = function() {
        console.log('Chat Modal Fix: Opening chat modal');
        const chatModal = document.querySelector('#chat-modal, #customer-chat-modal');
        if (chatModal) {
            chatModal.classList.remove('hidden');
            chatModal.style.display = 'flex';
            chatModal.style.visibility = 'visible';
            chatModal.style.opacity = '1';
        }
    };
    
    // Initialize immediately
    initialize();
    
    // Also initialize when DOM is ready as backup
    document.addEventListener('DOMContentLoaded', initialize);
    
    console.log('Chat Modal Fix: Loaded');
})();
