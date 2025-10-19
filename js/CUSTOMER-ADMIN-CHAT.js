/**
 * CUSTOMER ADMIN CHAT
 * Real working chat system between customers and admin
 */

(function() {
    'use strict';
    
    console.log('CUSTOMER ADMIN CHAT: Starting customer admin chat system...');
    
    let currentCustomer = null;
    let chatMessages = [];
    let isAdminLoggedIn = false;
    let adminUser = null;
    
    // Initialize customer admin chat
    function initializeCustomerAdminChat() {
        console.log('CUSTOMER ADMIN CHAT: Initializing customer admin chat system...');
        
        // Setup chat event listeners
        setupChatEventListeners();
        
        // Check if admin is logged in
        checkAdminStatus();
        
        // Start real-time chat monitoring
        startRealTimeChatMonitoring();
        
        console.log('CUSTOMER ADMIN CHAT: Customer admin chat system initialized');
    }
    
    // Setup chat event listeners
    function setupChatEventListeners() {
        console.log('CUSTOMER ADMIN CHAT: Setting up chat event listeners...');
        
        // Start chat button
        const startChatBtn = document.getElementById('start-chat-btn');
        if (startChatBtn) {
            startChatBtn.addEventListener('click', handleStartChat);
        }
        
        // Send message button
        const sendMessageBtn = document.getElementById('send-message-btn');
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', handleSendMessage);
        }
        
        // Chat message input
        const chatMessageInput = document.getElementById('chat-message-input');
        if (chatMessageInput) {
            chatMessageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSendMessage();
                }
            });
        }
        
        // Chat button in header
        const chatBtn = document.getElementById('chat-btn');
        if (chatBtn) {
            chatBtn.addEventListener('click', openCustomerChat);
        }
        
        // Mobile chat button
        const mobileChatBtn = document.getElementById('mobile-chat-btn');
        if (mobileChatBtn) {
            mobileChatBtn.addEventListener('click', openCustomerChat);
        }
        
        // Close chat modal
        const closeChatModal = document.getElementById('close-chat-modal');
        if (closeChatModal) {
            closeChatModal.addEventListener('click', closeCustomerChat);
        }
    }
    
    // Handle start chat
    function handleStartChat() {
        console.log('CUSTOMER ADMIN CHAT: Starting chat...');
        
        const name = document.getElementById('customer-name').value.trim();
        const email = document.getElementById('customer-email').value.trim();
        const phone = document.getElementById('customer-phone').value.trim();
        
        if (!name || !email || !phone) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create customer object
        currentCustomer = {
            id: generateCustomerId(),
            name: name,
            email: email,
            phone: phone,
            timestamp: new Date().toISOString(),
            status: 'active'
        };
        
        console.log('CUSTOMER ADMIN CHAT: Customer created:', currentCustomer);
        
        // Hide customer info form and show chat interface
        const customerInfoForm = document.getElementById('customer-info-form');
        const chatInterface = document.getElementById('chat-interface');
        
        if (customerInfoForm) {
            customerInfoForm.classList.add('hidden');
        }
        
        if (chatInterface) {
            chatInterface.classList.remove('hidden');
        }
        
        // Add welcome message
        addChatMessage(`Hello! I'm ${name}. I need help with my order.`, 'customer');
        
        // Save customer to Firebase
        saveCustomerToFirebase(currentCustomer);
        
        // Notify admin if logged in
        if (isAdminLoggedIn) {
            notifyAdminNewCustomer(currentCustomer);
        }
        
        console.log('CUSTOMER ADMIN CHAT: Chat started successfully');
    }
    
    // Handle send message
    function handleSendMessage() {
        console.log('CUSTOMER ADMIN CHAT: Sending message...');
        
        const chatMessageInput = document.getElementById('chat-message-input');
        const message = chatMessageInput.value.trim();
        
        if (!message || !currentCustomer) {
            return;
        }
        
        // Add message to chat
        addChatMessage(message, 'customer');
        
        // Clear input
        chatMessageInput.value = '';
        
        // Save message to Firebase
        saveMessageToFirebase({
            customerId: currentCustomer.id,
            message: message,
            sender: 'customer',
            timestamp: new Date().toISOString()
        });
        
        // Notify admin if logged in
        if (isAdminLoggedIn) {
            notifyAdminNewMessage(currentCustomer, message);
        }
        
        console.log('CUSTOMER ADMIN CHAT: Message sent successfully');
    }
    
    // Add chat message
    function addChatMessage(message, sender) {
        console.log('CUSTOMER ADMIN CHAT: Adding chat message:', { message, sender });
        
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'customer' ? 'justify-end' : 'justify-start'} mb-2`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `max-w-xs px-3 py-2 rounded-lg ${
            sender === 'customer' 
                ? 'bg-rog-red text-white' 
                : 'bg-gray-700 text-white'
        }`;
        
        messageContent.innerHTML = `
            <p class="text-sm">${message}</p>
            <p class="text-xs opacity-70 mt-1">${new Date().toLocaleTimeString()}</p>
        `;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Store message
        chatMessages.push({
            message: message,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        
        console.log('CUSTOMER ADMIN CHAT: Message added successfully');
    }
    
    // Open customer chat
    function openCustomerChat() {
        console.log('CUSTOMER ADMIN CHAT: Opening customer chat...');
        
        const customerChatModal = document.getElementById('customer-chat-modal');
        if (customerChatModal) {
            customerChatModal.classList.remove('hidden');
            console.log('CUSTOMER ADMIN CHAT: Customer chat opened');
        }
    }
    
    // Close customer chat
    function closeCustomerChat() {
        console.log('CUSTOMER ADMIN CHAT: Closing customer chat...');
        
        const customerChatModal = document.getElementById('customer-chat-modal');
        if (customerChatModal) {
            customerChatModal.classList.add('hidden');
            console.log('CUSTOMER ADMIN CHAT: Customer chat closed');
        }
    }
    
    // Check admin status
    function checkAdminStatus() {
        console.log('CUSTOMER ADMIN CHAT: Checking admin status...');
        
        try {
            // Check if current user is admin
            const currentUser = window.FirebaseAuth?.getCurrentUser?.() || 
                              window.firebase?.auth()?.currentUser;
            
            if (currentUser && currentUser.email) {
                // Check if user is admin (you can modify this logic)
                const adminEmails = [
                    'admin@otomono.com',
                    'support@otomono.com',
                    'admin@jeyseybizz.com'
                ];
                
                if (adminEmails.includes(currentUser.email.toLowerCase())) {
                    isAdminLoggedIn = true;
                    adminUser = currentUser;
                    console.log('CUSTOMER ADMIN CHAT: Admin is logged in:', adminUser.email);
                    
                    // Show admin interface
                    showAdminInterface();
                } else {
                    console.log('CUSTOMER ADMIN CHAT: User is not admin:', currentUser.email);
                }
            } else {
                console.log('CUSTOMER ADMIN CHAT: No user logged in');
            }
        } catch (error) {
            console.log('CUSTOMER ADMIN CHAT: Error checking admin status:', error);
        }
    }
    
    // Show admin interface
    function showAdminInterface() {
        console.log('CUSTOMER ADMIN CHAT: Showing admin interface...');
        
        // Add admin notification
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const adminNotification = document.createElement('div');
            adminNotification.className = 'text-center text-green-400 text-sm mb-2';
            adminNotification.innerHTML = `
                <p>🔔 Admin is online and ready to help!</p>
            `;
            chatMessages.appendChild(adminNotification);
        }
    }
    
    // Save customer to Firebase
    async function saveCustomerToFirebase(customer) {
        console.log('CUSTOMER ADMIN CHAT: Saving customer to Firebase...');
        
        try {
            if (window.FirebaseDB) {
                await window.FirebaseDB.saveCustomerChat(customer);
                console.log('CUSTOMER ADMIN CHAT: Customer saved to Firebase');
            } else {
                console.log('CUSTOMER ADMIN CHAT: FirebaseDB not available, storing locally');
                localStorage.setItem('customer_chat_' + customer.id, JSON.stringify(customer));
            }
        } catch (error) {
            console.error('CUSTOMER ADMIN CHAT: Error saving customer:', error);
        }
    }
    
    // Save message to Firebase
    async function saveMessageToFirebase(messageData) {
        console.log('CUSTOMER ADMIN CHAT: Saving message to Firebase...');
        
        try {
            if (window.FirebaseDB) {
                await window.FirebaseDB.saveChatMessage(messageData);
                console.log('CUSTOMER ADMIN CHAT: Message saved to Firebase');
            } else {
                console.log('CUSTOMER ADMIN CHAT: FirebaseDB not available, storing locally');
                const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
                messages.push(messageData);
                localStorage.setItem('chat_messages', JSON.stringify(messages));
            }
        } catch (error) {
            console.error('CUSTOMER ADMIN CHAT: Error saving message:', error);
        }
    }
    
    // Notify admin new customer
    function notifyAdminNewCustomer(customer) {
        console.log('CUSTOMER ADMIN CHAT: Notifying admin of new customer:', customer);
        
        // Show notification to admin
        if (isAdminLoggedIn) {
            showAdminNotification(`New customer ${customer.name} started a chat!`);
        }
    }
    
    // Notify admin new message
    function notifyAdminNewMessage(customer, message) {
        console.log('CUSTOMER ADMIN CHAT: Notifying admin of new message:', { customer, message });
        
        // Show notification to admin
        if (isAdminLoggedIn) {
            showAdminNotification(`New message from ${customer.name}: ${message.substring(0, 50)}...`);
        }
    }
    
    // Show admin notification
    function showAdminNotification(message) {
        console.log('CUSTOMER ADMIN CHAT: Showing admin notification:', message);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>🔔</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    // Start real-time chat monitoring
    function startRealTimeChatMonitoring() {
        console.log('CUSTOMER ADMIN CHAT: Starting real-time chat monitoring...');
        
        // Check for new messages every 2 seconds
        setInterval(() => {
            if (currentCustomer) {
                checkForNewMessages();
            }
        }, 2000);
    }
    
    // Check for new messages
    function checkForNewMessages() {
        console.log('CUSTOMER ADMIN CHAT: Checking for new messages...');
        
        try {
            // Check localStorage for new messages
            const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
            const customerMessages = messages.filter(msg => 
                msg.customerId === currentCustomer.id && 
                msg.sender === 'admin' &&
                !chatMessages.some(existing => existing.timestamp === msg.timestamp)
            );
            
            // Add new admin messages
            customerMessages.forEach(msg => {
                addChatMessage(msg.message, 'admin');
            });
        } catch (error) {
            console.log('CUSTOMER ADMIN CHAT: Error checking for new messages:', error);
        }
    }
    
    // Generate customer ID
    function generateCustomerId() {
        return 'customer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Public API
    window.CustomerAdminChat = {
        // Initialize
        init: initializeCustomerAdminChat,
        
        // Open chat
        openChat: openCustomerChat,
        
        // Close chat
        closeChat: closeCustomerChat,
        
        // Add message
        addMessage: addChatMessage,
        
        // Check admin status
        checkAdminStatus: checkAdminStatus,
        
        // Get current customer
        getCurrentCustomer: () => currentCustomer,
        
        // Get chat messages
        getChatMessages: () => chatMessages,
        
        // Is admin logged in
        isAdminLoggedIn: () => isAdminLoggedIn
    };
    
    // Start immediately
    initializeCustomerAdminChat();
    
    console.log('CUSTOMER ADMIN CHAT: Customer admin chat system loaded and running!');
})();
