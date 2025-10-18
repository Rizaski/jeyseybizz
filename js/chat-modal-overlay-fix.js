/**
 * Chat Modal Overlay Fix
 * Prevents modal from interfering with other content
 */

(function() {
    'use strict';
    
    console.log('Chat Modal Overlay Fix: Starting...');
    
    // Add CSS to prevent modal from being forced on top
    const style = document.createElement('style');
    style.textContent = `
        /* Chat Modal Overlay Fix */
        #chat-modal, #customer-chat-modal {
            /* Ensure modal is hidden by default */
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: 50 !important;
        }
        
        /* Only show when not hidden */
        #chat-modal:not(.hidden), #customer-chat-modal:not(.hidden) {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        /* Prevent modal from covering other important elements */
        #chat-modal, #customer-chat-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.75) !important;
            backdrop-filter: blur(4px) !important;
        }
        
        /* Ensure modal content doesn't interfere */
        #chat-modal .flex, #customer-chat-modal .flex {
            position: relative !important;
            z-index: 51 !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
        }
        
        /* Hide modal when page is not focused */
        body:not(:focus-within) #chat-modal,
        body:not(:focus-within) #customer-chat-modal {
            display: none !important;
        }
        
        /* Ensure modal doesn't block navigation */
        #chat-modal, #customer-chat-modal {
            will-change: auto !important;
            transform: none !important;
        }
        
        /* Mobile specific fixes */
        @media (max-width: 768px) {
            #chat-modal, #customer-chat-modal {
                padding: 10px !important;
            }
            
            #chat-modal .flex, #customer-chat-modal .flex {
                max-height: 95vh !important;
                margin: 0 !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Force hide all chat modals on page load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Chat Modal Overlay Fix: Hiding all chat modals on page load');
        
        const chatModals = document.querySelectorAll('#chat-modal, #customer-chat-modal');
        chatModals.forEach(modal => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.style.pointerEvents = 'none';
        });
    });
    
    // Also hide on window load
    window.addEventListener('load', function() {
        console.log('Chat Modal Overlay Fix: Hiding all chat modals on window load');
        
        const chatModals = document.querySelectorAll('#chat-modal, #customer-chat-modal');
        chatModals.forEach(modal => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            modal.style.opacity = '0';
            modal.style.pointerEvents = 'none';
        });
    });
    
    console.log('Chat Modal Overlay Fix: Applied');
})();
