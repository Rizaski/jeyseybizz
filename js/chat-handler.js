/**
 * Chat Handler
 * Manages all chat functionality across the website
 */

class ChatHandler {
    constructor() {
        this.isInitialized = false;
        this.chatModals = [];
        this.chatButtons = [];
        this.floatingChatButtons = [];
    }

    async initialize() {
        if (this.isInitialized) {
            return true;
        }

        try {
            console.log('Chat Handler: Initializing...');
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Find all chat elements
            this.findChatElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('Chat Handler: Initialized successfully');
            return true;
        } catch (error) {
            console.error('Chat Handler: Initialization failed:', error);
            return false;
        }
    }

    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    findChatElements() {
        // Find all chat modals
        this.chatModals = document.querySelectorAll('#chat-modal, #customer-chat-modal');
        
        // Find all chat buttons
        this.chatButtons = document.querySelectorAll('#chat-btn, #mobile-chat-btn');
        
        // Find all floating chat buttons
        this.floatingChatButtons = document.querySelectorAll('#floating-chat-btn');
        
        console.log('Chat Handler: Found elements:', {
            chatModals: this.chatModals.length,
            chatButtons: this.chatButtons.length,
            floatingChatButtons: this.floatingChatButtons.length
        });
    }

    setupEventListeners() {
        // Set up chat button listeners
        this.chatButtons.forEach((button, index) => {
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Chat Handler: Chat button ${index} clicked`);
                    this.openChat();
                });
            }
        });

        // Set up floating chat button listeners
        this.floatingChatButtons.forEach((button, index) => {
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Chat Handler: Floating chat button ${index} clicked`);
                    this.openChat();
                });
            }
        });

        // Set up close button listeners
        this.chatModals.forEach((modal, index) => {
            if (modal) {
                // Find close buttons within each modal
                const closeButtons = modal.querySelectorAll('#close-chat, .close-chat, [data-close-chat]');
                closeButtons.forEach(closeBtn => {
                    closeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`Chat Handler: Close button clicked for modal ${index}`);
                        this.closeChat();
                    });
                });

                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        console.log(`Chat Handler: Modal ${index} clicked outside, closing`);
                        this.closeChat();
                    }
                });
            }
        });

        // Set up chat functionality
        this.setupChatFunctionality();
    }

    openChat() {
        console.log('Chat Handler: Opening chat...');
        
        // Find the first available chat modal
        const chatModal = this.chatModals[0];
        if (chatModal) {
            chatModal.classList.remove('hidden');
            console.log('Chat Handler: Chat modal opened');
            
            // Focus on message input if available
            const messageInput = chatModal.querySelector('#chat-message-input, input[type="text"]');
            if (messageInput) {
                setTimeout(() => messageInput.focus(), 100);
            }
        } else {
            console.error('Chat Handler: No chat modal found');
        }
    }

    closeChat() {
        console.log('Chat Handler: Closing chat...');
        
        // Close all chat modals
        this.chatModals.forEach((modal, index) => {
            if (modal) {
                modal.classList.add('hidden');
                console.log(`Chat Handler: Chat modal ${index} closed`);
            }
        });
    }

    setupChatFunctionality() {
        this.chatModals.forEach((modal, index) => {
            if (modal) {
                console.log(`Chat Handler: Setting up chat functionality for modal ${index}`);
                
                // Find chat elements within this modal
                const startChatBtn = modal.querySelector('#start-chat-btn');
                const messageInput = modal.querySelector('#chat-message-input, input[type="text"]');
                const sendBtn = modal.querySelector('#send-message-btn, button[type="submit"]');
                const messagesContainer = modal.querySelector('#chat-messages, .chat-messages');
                
                if (startChatBtn) {
                    startChatBtn.addEventListener('click', () => {
                        console.log(`Chat Handler: Start chat clicked for modal ${index}`);
                        this.startChat(modal);
                    });
                }
                
                if (sendBtn && messageInput) {
                    sendBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`Chat Handler: Send message clicked for modal ${index}`);
                        this.sendMessage(modal, messageInput, messagesContainer);
                    });
                }
                
                if (messageInput) {
                    messageInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            console.log(`Chat Handler: Enter pressed for modal ${index}`);
                            this.sendMessage(modal, messageInput, messagesContainer);
                        }
                    });
                }
            }
        });
    }

    startChat(modal) {
        console.log('Chat Handler: Starting chat...');
        
        // Hide start chat button and show chat interface
        const startChatBtn = modal.querySelector('#start-chat-btn');
        const chatInterface = modal.querySelector('#chat-interface');
        
        if (startChatBtn) {
            startChatBtn.style.display = 'none';
        }
        
        if (chatInterface) {
            chatInterface.style.display = 'block';
        }
        
        // Add welcome message
        const messagesContainer = modal.querySelector('#chat-messages, .chat-messages');
        if (messagesContainer) {
            this.addMessage(messagesContainer, 'Welcome! How can I help you today?', 'bot');
        }
    }

    sendMessage(modal, input, messagesContainer) {
        const message = input.value.trim();
        if (!message) return;
        
        console.log('Chat Handler: Sending message:', message);
        
        // Add user message
        this.addMessage(messagesContainer, message, 'user');
        
        // Clear input
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "Thank you for your message! Our team will get back to you soon.",
                "I understand your concern. Let me help you with that.",
                "That's a great question! Here's what I can tell you...",
                "I'm here to help! Can you provide more details?",
                "Thank you for contacting us. We'll respond within 24 hours."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage(messagesContainer, randomResponse, 'bot');
        }, 1000);
    }

    addMessage(container, message, sender) {
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `inline-block max-w-xs px-4 py-2 rounded-lg ${
            sender === 'user' 
                ? 'bg-rog-red text-white' 
                : 'bg-gray-200 text-gray-800'
        }`;
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        container.appendChild(messageDiv);
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }
}

// Create global instance
window.ChatHandler = new ChatHandler();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.ChatHandler.initialize();
        console.log('Chat Handler: Auto-initialized');
    } catch (error) {
        console.error('Chat Handler: Auto-initialization failed:', error);
    }
});

console.log('Chat Handler loaded');
