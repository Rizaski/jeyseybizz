/**
 * ADMIN CHAT INTERFACE
 * Admin interface to see and respond to customer chats
 */

(function() {
    'use strict';
    
    console.log('ADMIN CHAT INTERFACE: Starting admin chat interface...');
    
    let allCustomers = [];
    let selectedCustomer = null;
    let isAdminInterfaceVisible = false;
    
    // Initialize admin chat interface
    function initializeAdminChatInterface() {
        console.log('ADMIN CHAT INTERFACE: Initializing admin chat interface...');
        
        // Check if user is admin
        if (!isAdminUser()) {
            console.log('ADMIN CHAT INTERFACE: User is not admin, skipping admin interface');
            return;
        }
        
        // Create admin interface
        createAdminInterface();
        
        // Load all customers
        loadAllCustomers();
        
        // Start monitoring for new customers
        startCustomerMonitoring();
        
        console.log('ADMIN CHAT INTERFACE: Admin chat interface initialized');
    }
    
    // Check if user is admin
    function isAdminUser() {
        try {
            const currentUser = window.FirebaseAuth?.getCurrentUser?.() || 
                              window.firebase?.auth()?.currentUser;
            
            if (currentUser && currentUser.email) {
                const adminEmails = [
                    'admin@otomono.com',
                    'support@otomono.com',
                    'admin@jeyseybizz.com'
                ];
                
                return adminEmails.includes(currentUser.email.toLowerCase());
            }
        } catch (error) {
            console.log('ADMIN CHAT INTERFACE: Error checking admin status:', error);
        }
        
        return false;
    }
    
    // Create admin interface
    function createAdminInterface() {
        console.log('ADMIN CHAT INTERFACE: Creating admin interface...');
        
        // Create admin chat button
        const adminChatButton = document.createElement('button');
        adminChatButton.id = 'admin-chat-button';
        adminChatButton.className = 'fixed bottom-6 left-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-50';
        adminChatButton.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span class="text-sm font-semibold">Admin Chat</span>
                <span id="admin-chat-badge" class="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">0</span>
            </div>
        `;
        
        document.body.appendChild(adminChatButton);
        
        // Add click event
        adminChatButton.addEventListener('click', toggleAdminInterface);
        
        // Create admin interface modal
        createAdminInterfaceModal();
        
        console.log('ADMIN CHAT INTERFACE: Admin interface created');
    }
    
    // Create admin interface modal
    function createAdminInterfaceModal() {
        console.log('ADMIN CHAT INTERFACE: Creating admin interface modal...');
        
        const modal = document.createElement('div');
        modal.id = 'admin-chat-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 hidden';
        modal.innerHTML = `
            <div class="fixed top-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col">
                <!-- Admin Chat Header -->
                <div class="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="text-lg font-semibold">Admin Chat Interface</h3>
                    </div>
                    <button id="close-admin-chat" class="text-white hover:text-green-200 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Customer List -->
                <div id="admin-customer-list" class="flex-1 p-4 overflow-y-auto border-b">
                    <h4 class="font-semibold text-gray-800 mb-3">Active Customers</h4>
                    <div id="customer-list-container" class="space-y-2">
                        <p class="text-gray-500 text-sm">No customers yet...</p>
                    </div>
                </div>
                
                <!-- Chat Area -->
                <div id="admin-chat-area" class="flex-1 p-4 hidden">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold text-gray-800" id="selected-customer-name">Select a customer</h4>
                        <button id="close-chat-area" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Chat Messages -->
                    <div id="admin-chat-messages" class="h-48 overflow-y-auto border rounded-lg p-3 mb-3 bg-gray-50">
                        <p class="text-gray-500 text-sm">Select a customer to start chatting...</p>
                    </div>
                    
                    <!-- Chat Input -->
                    <div class="flex space-x-2">
                        <input type="text" id="admin-chat-input" placeholder="Type your message..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        <button id="admin-send-message" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        setupAdminInterfaceEventListeners();
        
        console.log('ADMIN CHAT INTERFACE: Admin interface modal created');
    }
    
    // Setup admin interface event listeners
    function setupAdminInterfaceEventListeners() {
        console.log('ADMIN CHAT INTERFACE: Setting up admin interface event listeners...');
        
        // Close admin chat
        const closeAdminChat = document.getElementById('close-admin-chat');
        if (closeAdminChat) {
            closeAdminChat.addEventListener('click', closeAdminInterface);
        }
        
        // Close chat area
        const closeChatArea = document.getElementById('close-chat-area');
        if (closeChatArea) {
            closeChatArea.addEventListener('click', closeChatArea);
        }
        
        // Admin send message
        const adminSendMessage = document.getElementById('admin-send-message');
        if (adminSendMessage) {
            adminSendMessage.addEventListener('click', sendAdminMessage);
        }
        
        // Admin chat input
        const adminChatInput = document.getElementById('admin-chat-input');
        if (adminChatInput) {
            adminChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendAdminMessage();
                }
            });
        }
    }
    
    // Toggle admin interface
    function toggleAdminInterface() {
        console.log('ADMIN CHAT INTERFACE: Toggling admin interface...');
        
        const modal = document.getElementById('admin-chat-modal');
        if (modal) {
            if (isAdminInterfaceVisible) {
                closeAdminInterface();
            } else {
                openAdminInterface();
            }
        }
    }
    
    // Open admin interface
    function openAdminInterface() {
        console.log('ADMIN CHAT INTERFACE: Opening admin interface...');
        
        const modal = document.getElementById('admin-chat-modal');
        if (modal) {
            modal.classList.remove('hidden');
            isAdminInterfaceVisible = true;
            
            // Load customers
            loadAllCustomers();
        }
    }
    
    // Close admin interface
    function closeAdminInterface() {
        console.log('ADMIN CHAT INTERFACE: Closing admin interface...');
        
        const modal = document.getElementById('admin-chat-modal');
        if (modal) {
            modal.classList.add('hidden');
            isAdminInterfaceVisible = false;
        }
    }
    
    // Load all customers
    function loadAllCustomers() {
        console.log('ADMIN CHAT INTERFACE: Loading all customers...');
        
        try {
            // Load from localStorage (in real app, this would be from Firebase)
            const customers = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('customer_chat_')) {
                    const customer = JSON.parse(localStorage.getItem(key));
                    customers.push(customer);
                }
            }
            
            allCustomers = customers;
            displayCustomers(customers);
            
            // Update badge
            updateAdminChatBadge(customers.length);
            
            console.log('ADMIN CHAT INTERFACE: Loaded', customers.length, 'customers');
        } catch (error) {
            console.error('ADMIN CHAT INTERFACE: Error loading customers:', error);
        }
    }
    
    // Display customers
    function displayCustomers(customers) {
        console.log('ADMIN CHAT INTERFACE: Displaying customers...');
        
        const container = document.getElementById('customer-list-container');
        if (!container) return;
        
        if (customers.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No customers yet...</p>';
            return;
        }
        
        container.innerHTML = customers.map(customer => `
            <div class="customer-item p-3 border rounded-lg cursor-pointer hover:bg-gray-50" data-customer-id="${customer.id}">
                <div class="flex items-center justify-between">
                    <div>
                        <h5 class="font-semibold text-gray-800">${customer.name}</h5>
                        <p class="text-sm text-gray-600">${customer.email}</p>
                        <p class="text-xs text-gray-500">${new Date(customer.timestamp).toLocaleString()}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-green-600 font-semibold">${customer.status}</span>
                        <div class="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click events to customer items
        container.querySelectorAll('.customer-item').forEach(item => {
            item.addEventListener('click', () => {
                const customerId = item.dataset.customerId;
                selectCustomer(customerId);
            });
        });
    }
    
    // Select customer
    function selectCustomer(customerId) {
        console.log('ADMIN CHAT INTERFACE: Selecting customer:', customerId);
        
        selectedCustomer = allCustomers.find(c => c.id === customerId);
        if (!selectedCustomer) return;
        
        // Show chat area
        const chatArea = document.getElementById('admin-chat-area');
        const customerList = document.getElementById('admin-customer-list');
        
        if (chatArea) {
            chatArea.classList.remove('hidden');
        }
        if (customerList) {
            customerList.classList.add('hidden');
        }
        
        // Update selected customer name
        const selectedCustomerName = document.getElementById('selected-customer-name');
        if (selectedCustomerName) {
            selectedCustomerName.textContent = `Chat with ${selectedCustomer.name}`;
        }
        
        // Load chat messages
        loadChatMessages(customerId);
    }
    
    // Load chat messages
    function loadChatMessages(customerId) {
        console.log('ADMIN CHAT INTERFACE: Loading chat messages for customer:', customerId);
        
        const chatMessages = document.getElementById('admin-chat-messages');
        if (!chatMessages) return;
        
        try {
            // Load messages from localStorage
            const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
            const customerMessages = messages.filter(msg => msg.customerId === customerId);
            
            if (customerMessages.length === 0) {
                chatMessages.innerHTML = '<p class="text-gray-500 text-sm">No messages yet...</p>';
                return;
            }
            
            chatMessages.innerHTML = customerMessages.map(msg => `
                <div class="flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} mb-2">
                    <div class="max-w-xs px-3 py-2 rounded-lg ${
                        msg.sender === 'admin' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-800'
                    }">
                        <p class="text-sm">${msg.message}</p>
                        <p class="text-xs opacity-70 mt-1">${new Date(msg.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
            `).join('');
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('ADMIN CHAT INTERFACE: Error loading chat messages:', error);
        }
    }
    
    // Send admin message
    function sendAdminMessage() {
        console.log('ADMIN CHAT INTERFACE: Sending admin message...');
        
        const adminChatInput = document.getElementById('admin-chat-input');
        const message = adminChatInput.value.trim();
        
        if (!message || !selectedCustomer) {
            return;
        }
        
        // Add message to chat
        addAdminMessage(message);
        
        // Clear input
        adminChatInput.value = '';
        
        // Save message to localStorage
        const messageData = {
            customerId: selectedCustomer.id,
            message: message,
            sender: 'admin',
            timestamp: new Date().toISOString()
        };
        
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        messages.push(messageData);
        localStorage.setItem('chat_messages', JSON.stringify(messages));
        
        console.log('ADMIN CHAT INTERFACE: Admin message sent successfully');
    }
    
    // Add admin message
    function addAdminMessage(message) {
        console.log('ADMIN CHAT INTERFACE: Adding admin message:', message);
        
        const chatMessages = document.getElementById('admin-chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-end mb-2';
        
        messageDiv.innerHTML = `
            <div class="max-w-xs px-3 py-2 rounded-lg bg-green-600 text-white">
                <p class="text-sm">${message}</p>
                <p class="text-xs opacity-70 mt-1">${new Date().toLocaleTimeString()}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Start customer monitoring
    function startCustomerMonitoring() {
        console.log('ADMIN CHAT INTERFACE: Starting customer monitoring...');
        
        // Check for new customers every 3 seconds
        setInterval(() => {
            if (isAdminInterfaceVisible) {
                loadAllCustomers();
            }
        }, 3000);
    }
    
    // Update admin chat badge
    function updateAdminChatBadge(count) {
        const badge = document.getElementById('admin-chat-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    // Public API
    window.AdminChatInterface = {
        // Initialize
        init: initializeAdminChatInterface,
        
        // Open interface
        openInterface: openAdminInterface,
        
        // Close interface
        closeInterface: closeAdminInterface,
        
        // Load customers
        loadCustomers: loadAllCustomers,
        
        // Select customer
        selectCustomer: selectCustomer,
        
        // Send message
        sendMessage: sendAdminMessage
    };
    
    // Start immediately
    initializeAdminChatInterface();
    
    console.log('ADMIN CHAT INTERFACE: Admin chat interface loaded and running!');
})();
