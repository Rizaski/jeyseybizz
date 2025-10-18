/**
 * Chat Modal CSS Fix
 * Fixes modal positioning to prevent cutoff
 */

(function() {
    'use strict';
    
    console.log('Chat Modal CSS Fix: Starting...');
    
    // Add CSS fixes for modal positioning
    const style = document.createElement('style');
    style.textContent = `
        /* Chat Modal Positioning Fix */
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
            align-items: flex-start !important;
            justify-content: center !important;
        }
        
        /* Ensure modal content is visible */
        #chat-modal .bg-white,
        #chat-modal .bg-rog-dark,
        #chat-modal .bg-gray-800,
        #customer-chat-modal .bg-white,
        #customer-chat-modal .bg-rog-dark,
        #customer-chat-modal .bg-gray-800 {
            max-height: 85vh !important;
            overflow-y: auto !important;
            margin: 0 !important;
        }
        
        /* Fix for mobile devices */
        @media (max-height: 600px) {
            #chat-modal, #customer-chat-modal {
                padding-top: 2vh !important;
                padding-bottom: 2vh !important;
            }
            
            #chat-modal .flex, #customer-chat-modal .flex {
                max-height: 96vh !important;
            }
        }
        
        /* Ensure close button is always visible */
        #close-chat, #close-chat-modal, #close-chat-fix {
            position: relative !important;
            z-index: 1000 !important;
            cursor: pointer !important;
        }
        
        /* Fix for modal backdrop */
        #chat-modal, #customer-chat-modal {
            backdrop-filter: blur(4px) !important;
        }
    `;
    
    document.head.appendChild(style);
    
    console.log('Chat Modal CSS Fix: Applied');
})();
