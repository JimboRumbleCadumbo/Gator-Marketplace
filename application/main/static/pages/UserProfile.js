export default {
    template: `
    <div>
        <Navbar></Navbar>    
        <div class="page-wrapper">

            <!-- Tabs at the top -->
            <div class="tab-container">
                <div class="tab">
                    <button @click="activeTab = 'about'" :class="{ active: activeTab === 'about' }">About</button>
                    <button @click="activeTab = 'liked'" :class="{ active: activeTab === 'liked' }">Liked Items</button>
                    <button @click="activeTab = 'sold'" :class="{ active: activeTab === 'sold' }">Sold Items</button>
                    <button @click="activeTab = 'rented'" :class="{ active: activeTab === 'rented' }">Rented Items</button>
                    <button @click="activeTab = 'messages'" :class="{ active: activeTab === 'messages' }"> Messages </button>
                    <button @click="activeTab = 'settings'" :class="{ active: activeTab === 'settings' }"> Settings </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div v-if="activeTab === 'about'" class="tab-content">
                <div class="user-container">
                    <div class="user-content" v-if="user">
                        <div class="user-header">
                            <img :src="user.icon" alt="User Icon" class="user-icon" />
                        </div>
                        <div class="user-details">
                            <div class="username-section">
                                <span class="username">{{ user.username }}</span>
                            </div>
                            <div class="joined-date">Joined: {{ user.joinedDate }}</div>
                            <div class="rating">
                                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= user.rating }">&#9733;</span>
                                <span class="rating-score">({{ user.rating }}/5)</span>
                            </div>
                            <div class="description">
                                <label>Description:</label>
                                <p class="description-text">{{ description }}</p>
                            </div>
                        </div>
                    </div>
                    <p v-else>Loading user information...</p>
                </div>
            </div>

            <div v-if="activeTab === 'liked'" class="tab-content">
                <h3>Liked Items</h3>
                <div class="dashboard-product-grid">
                    <router-link 
                        v-for="item in likedItems" 
                        :key="item.item_id" 
                        :to="'/item?id=' + item.item_id" 
                        class="card-link"
                    >
                        <div class="result-card">
                            <img :src="item.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
                            <h3>{{ item.name }}</h3>
                            <p>{{ item.price }}</p>
                        </div>
                    </router-link>
                </div>
            </div>

            <div v-if="activeTab === 'sold'" class="tab-content">
                <h3>Sold Items</h3>
                <div class="dashboard-product-grid">
                    <div class="result-card sold-card" v-for="item in soldItems" :key="item.id">
                        <div class="sold-banner">SOLD</div>
                        <img :src="item.image || 'https://placehold.co/600x400'" alt="Item Image" />
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.price }}</p>
                        <p>{{ item.description }}</p>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'rented'" class="tab-content">
                <h3>Rented Items</h3>
                <div class="dashboard-product-grid">
                    <div class="result-card rented-card" v-for="item in likedItems" :key="item.id">
                        <div class="return-banner">
                            Return by: {{ item.return_date || 'TBD' }}
                        </div>
                        <img :src="item.image || 'https://placehold.co/600x400'" alt="Item Image" />
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.price }}</p>
                        <p>{{ item.description }}</p>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'messages'" class="tab-content">
                <h3>Messages</h3>
                <div class="messages-container">
                    
                    <!-- User list on the left -->
                    <div class="user-list">
                        <div 
                            v-for="user in users" 
                            :key="user.id" 
                            class="user-list-item" 
                            :class="{ active: selectedUser && selectedUser.id === user.id }"
                            @click="selectUser(user)"
                        >
                            {{ user.name }}
                        </div>
                    </div>

                    <!-- Chat area on the right -->
                    <div class="chat-panel" v-if="selectedUser">
                        <div class="chat-header">
                            <span>{{ selectedUser.name }}</span>
                        </div>
                        <div class="chat-messages">
                            <div 
                            v-for="msg in selectedUser.messages" 
                            :key="msg.id" 
                            class="message" 
                            :class="msg.from === 'user' ? 'user' : 'seller'"
                            >
                            {{ msg.text }}
                            </div>
                        </div>
                        <div class="chat-input">
                            <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
                            <button @click="sendMessage">Send</button>
                        </div>
                    </div>

                    <!-- Optional placeholder if no user selected -->
                    <div class="chat-panel" v-else>
                        <p class="no-user-selected">Select a user to start chatting</p>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'settings'" class="tab-content">
                <h3>Settings</h3>

                <div class="user-settings-form">
                    <!-- Display Name -->
                    <div class="user-settings-group">
                        <label for="displayName">Display Name</label>
                        <input type="text" id="displayName" v-model="usernameEdit" placeholder="Enter new display name" />
                    </div>

                    <!-- Profile Icon Upload -->
                    <div class="user-settings-group">
                    <label>Profile Icon</label>
                        <div class="user-settings-icon-upload">
                            <img :src="user.icon" alt="Profile Preview" class="user-settings-icon-preview" />
                            <input type="file" accept="image/*" @change="onIconChange" />
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="user-settings-group">
                        <label for="description">Description</label>
                        <textarea id="description" v-model="description" placeholder="Write something about yourself..."></textarea>
                    </div>

                    <!-- Password -->
                    <div class="user-settings-group">
                        <label for="password">New Password</label>
                        <input type="password" id="password" v-model="newPassword" placeholder="Enter new password" />
                    </div>

                    <!-- Save Button -->
                    <div class="user-settings-actions">
                        <button @click="saveSettings">Save Changes</button>
                    </div>
                </div>
            </div>

            <footer class="footer">
                <p>&copy; 2025 CSC 648 Team 05. All rights reserved.</p>
                <router-link to="/about" class="footer-link">About</router-link>
            </footer>
        </div>
    </div>
    `,
    data() {
        return {
            userIcon: window.__LOGIN_STATE__.user_icon || "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123", // Default icon
        };
    },
    setup() {
        const { ref, onMounted } = Vue;
        
        // User data
        const currentUserId = ref(null);
        const user = ref(null);
        const defaultIcon = "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123";
        
        // Tabs and settings
        const activeTab = ref("about");
        const usernameEdit = ref("");
        const iconEdit = ref(defaultIcon);
        const newPassword = ref("");
        const description = ref("");

        // Messages
        const users = ref([]);
        const selectedUser = ref(null);
        const newMessage = ref("");
        
        // Items
        const likedItems = ref([]);
        const soldItems = ref([]);

        // Message functions
        const selectUser = async (user) => {
            selectedUser.value = user;
            try {
                const response = await fetch(`/api/messages/${user.id}`);
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                selectedUser.value.messages = data.messages.map(msg => ({
                    ...msg,
                    from: msg.sender_id === currentUserId.value ? 'user' : 'seller'
                }));
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const sendMessage = async () => {
            if (!newMessage.value.trim() || !selectedUser.value) return;

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        receiver_id: selectedUser.value.id,
                        text: newMessage.value
                    })
                });

                if (!response.ok) throw new Error('Failed to send message');
                
                const result = await response.json();
                selectedUser.value.messages.push({
                    id: result.message_id,
                    text: newMessage.value,
                    sender_id: currentUserId.value,
                    timestamp: result.timestamp,
                    from: 'user'
                });
                newMessage.value = "";
            } catch (error) {
                console.error('Error sending message:', error);
            }
        };

        // User data fetching
        const fetchUserData = async () => {
            try {
                const sessionResponse = await fetch('/api/session');
                const sessionData = await sessionResponse.json();
                
                if (sessionData.logged_in) {
                    currentUserId.value = sessionData.user_id;
                    const userResponse = await fetch(`/api/user/${sessionData.user_id}`);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        user.value = {
                            username: userData.user_name,
                            icon: defaultIcon,
                            joinedDate: new Date(userData.joined_date).toLocaleDateString(),
                            rating: userData.rating
                        };
                        usernameEdit.value = userData.user_name;
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        onMounted(fetchUserData);

        return {
            // User data
            user,
            defaultIcon,
            currentUserId,
            
            // Tabs and state
            activeTab,
            usernameEdit,
            iconEdit,
            newPassword,
            description,
            
            // Messages
            users,
            selectedUser,
            newMessage,
            selectUser,
            sendMessage,
            
            // Items
            likedItems,
            soldItems,
            
            // Settings functions
            saveSettings: async () => {
                try {
                    const response = await fetch('/api/user', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: usernameEdit.value,
                            password: newPassword.value
                        })
                    });
                    if (response.ok) fetchUserData();
                } catch (error) {
                    console.error('Error saving settings:', error);
                }
            },
            
            onIconChange: (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        iconEdit.value = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            }
        };
    }
};
