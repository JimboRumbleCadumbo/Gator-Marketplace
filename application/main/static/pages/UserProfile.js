export default {
    template: `
    <div>
        <Navbar></Navbar>    
        <div class="page-wrapper">

            <!-- Tabs at the top -->
            <div class="tab-container">
                <div class="tab">
                    <button @click="activeTab = 'about'" :class="{ active: activeTab === 'about' }">About</button>
                    <button @click="activeTab = 'my_items'" :class="{ active: activeTab === 'my_items' }">My Items</button>
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

            <div v-if="activeTab === 'my_items'" class="tab-content">
                <h3>My Items</h3>
                <div class="dashboard-product-grid">
                    <div v-for="item in myItems" :key="item.item_id" class="card-item">
                        <router-link :to="'/item?id=' + item.item_id" class="card-link">
                            <div class="result-card">
                                <img :src="item.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
                                <h3>{{ item.name }}</h3>
                                <p>{{ item.price }}</p>
                            </div>
                        </router-link>
                        <button @click.stop="deleteUserItem(item.item_id)" class="delete-btn">Delete</button>
                        
                        <button @click="markAsSold(item.item_id)" class="sold-btn">Sold</button>
                    </div>
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

            <!-- Sold Items -->
            <div v-if="activeTab === 'sold'" class="tab-content">
                <h3>Sold Items</h3>
                <div class="dashboard-product-grid">
                    <div v-for="item in soldItems" :key="item.item_id" class="card-item">
                        <div class="result-card sold-card">
                            <div class="sold-banner">SOLD</div>
                            <img :src="item.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
                            <h3>{{ item.name }}</h3>
                            <p>{{ item.price }}</p>
                            <p>{{ item.description }}</p>
                        </div>
                        <button @click.stop="deleteUserItem(item.item_id, 'sold')" class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'rented'" class="tab-content">
                <h3>Rented Items</h3>
                <div class="dashboard-product-grid">
                    <div class="result-card rented-card" v-for="item in soldItems" :key="item.id">
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
        const { ref, onMounted, onUnmounted, watch } = Vue;
        
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
        let poller = null;
        
        // Items
        const likedItems = ref([]);
        const myItems = ref([]);
        const soldItems = Vue.ref([]);

        // ----------------- Message functions -----------------
        async function safeJson(res) {
            if (!res.ok) {
              console.error('Fetch failed', res.status, await res.text());
              return null;
            }
            const ct = res.headers.get('Content-Type') || '';
            if (!ct.includes('application/json')) {
              console.error('Expected JSON, got:', ct, await res.text());
              return null;
            }
            return res.json();
          }
        
          const fetchContacts = async () => {
            const res  = await fetch('/api/messages/fetchAllContact', { credentials: 'include' });
            const data = await safeJson(res);
            if (data?.success) {
              users.value = data.messages.map(m => ({
                id:   m.contact_id,
                name: m.user_name
              }));
            }
          };
        
          const loadHistory = async (userId) => {
            const res  = await fetch(`/api/messages/${userId}`, { credentials: 'include' });
            const data = await res.json();
            if (data.success) {
              selectedUser.value.messages = data.messages.map(msg => ({
                id:   msg.id,
                text: msg.text,
                from: msg.sender_id === userId ? 'seller' : 'user'
              }));
            }
          };
        
          const selectUser = async (u) => {
            selectedUser.value = { ...u, messages: [] };
            await loadHistory(u.id);
          };
        
          const sendMessage = async () => {
            if (!newMessage.value.trim() || !selectedUser.value) return;
        
            const res = await fetch('/api/messages', {
                method:      'POST',
                credentials: 'include',
                headers:     { 'Content-Type': 'application/json' },
                body:        JSON.stringify({
                receiver_id: selectedUser.value.id,
                text:        newMessage.value
                })
            });
            const data = await safeJson(res);
            if (data) {
              // push & refresh
              newMessage.value = '';
              await loadHistory(selectedUser.value.id);
            }
          };
        
          

        // ----------------- Item functions -----------------

        const deleteUserItem = async (itemId) => {
            if (!confirm("Are you sure you want to delete this item?")) return;

            try {
                const response = await fetch(`/api/user-items/${itemId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error("Failed to delete item.");

                myItems.value = myItems.value.filter(item => item.item_id !== itemId);
                soldItems.value = soldItems.value.filter(item => item.item_id !== itemId);

                console.log("Item deleted:", itemId);
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        };

        const markAsSold = async (itemId) => {
            if (!confirm("Are you sure you want to mark this item as sold?")) return;

            try {
                const response = await fetch(`/api/user-items/${itemId}/sold`, {
                    method: 'POST',
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || "Failed to mark item as sold.");
                }
                
                // Find the item being marked as sold
                const soldItem = myItems.value.find(item => item.item_id === itemId);

                if (soldItem) {
                    myItems.value = myItems.value.filter(item => item.item_id !== itemId);
                    soldItems.value.push(soldItem);
                }
                
                alert("Item marked as sold successfully!");
            } catch (error) {
                console.error("Error marking item as sold:", error);
                alert(`Error: ${error.message}`);
            }
        };

        // ----------------- User Setting functions -----------------
        const saveSettings = async () => {
            try {
                const formData = new FormData();
                formData.append('user_name', usernameEdit.value.trim());
                formData.append('description', description.value.trim());
                if (newPassword.value.trim()) {
                    formData.append('password', newPassword.value.trim());
                }
                if (user.value.icon) {
                    const blob = await fetch(user.value.icon).then((res) => res.blob());
                    formData.append('icon', blob);
                }

                const response = await fetch('/api/user/update', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Settings updated successfully!");
                } else {
                    alert("Error: " + data.error);
                }
            } catch (error) {
                console.log("Error saving settings:", error);
            }
        };
      
        const onIconChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    user.value.icon = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        // User data fetching
        const fetchUserData = async () => {
            try {
                // First, check if user is logged in
                const sessionResponse = await fetch('/api/session');
                const sessionData = await sessionResponse.json();
                if (sessionData.logged_in) {
                // Fetch the full user data using user_id
                    const userId = sessionData.user_id;
                    const userResponse = await fetch(`/api/user/${userId}`);
                    const userData = await userResponse.json();
                    if (userResponse.ok) {
                        user.value = {
                            username: userData.user_name,
                            joinedDate: userData.joined_date,
                            icon: userData.user_icon || "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123",
                            rating: userData.rating,
                            description: userData.description,
                        };

                        // Update the settings form fields
                        usernameEdit.value = userData.user_name || "";
                        description.value = userData.description || "";
                    } else {
                        console.error("Failed to fetch user data:", userData.error);
                    }
                } else {
                    console.error("Please log in.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        //Get Users liked items
        const fetchLikedItems = async () => {
            try {
                const response = await fetch('/api/liked-items');
                if (!response.ok) throw new Error("Failed to fetch liked items");

                const data = await response.json();
                likedItems.value = data;
                console.log("Loaded liked items:", likedItems.value);
            } catch (error) {
                console.error("Error loading liked items:", error);
            }
        };

        //Get Users liked items
        const fetchUsersItems = async (status = 'active') => {
            try {
                const response = await fetch(`/api/user-items?status=${status}`);
                if (!response.ok) throw new Error(`Failed to fetch ${status} items`);

                const data = await response.json();
                if (status === 'active') {
                    myItems.value = data;
                } else {
                    soldItems.value = data;
                }
                console.log(`Loaded User's ${status} items:`, data);
            } catch (error) {
                console.error(`Error loading User's ${status} items:`, error);
            }
        };

        onMounted(() => {
            if (activeTab.value === 'messages') {
                fetchContacts();
            }
            fetchUserData();
            fetchLikedItems();
            fetchUsersItems('active');
            fetchUsersItems('sold');
        });

        onUnmounted(() => clearInterval(poller));    

        // polling when on the messages tab
        watch(activeTab, tab => {
            if (tab === 'messages') {
            fetchContacts();
            poller = setInterval(() => {
                if (selectedUser.value) {
                loadHistory(selectedUser.value.id);
                }
            }, 5000);
            } else {
            clearInterval(poller);
            poller = null;
            }
        });



        return {
            // User data
            user,
            defaultIcon,
            currentUserId,
            saveSettings,
            onIconChange,
            
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
            fetchContacts,
            sendMessage,
            
            // Items
            likedItems,
            myItems,
            soldItems,
            deleteUserItem,
            markAsSold,
        };
    }
};
