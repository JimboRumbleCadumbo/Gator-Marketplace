export default {
  template: `
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
    `,
    data() {
        return {
            userIcon: window.__LOGIN_STATE__.user_icon || "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123", // Default icon
        };
    },
    setup() {
        //Example profile related data
        const username = Vue.ref("CoolUser123");
        const icon = Vue.ref(``);
        const description = Vue.ref("This is my profile description!");
        const usernameEdit = Vue.ref(username.value);
        const iconEdit = Vue.ref(icon.value);
        const newPassword = Vue.ref("");
        const activeTab = Vue.ref("about");
        
        const user = Vue.ref(null);
        const likedItems = Vue.ref([]);
      
        //Example Chat Data
        const users = Vue.ref([
          { id: 1, name: "Alice", messages: [{ id: 1, text: "Hi there!", from: "seller" }] },
          { id: 2, name: "Bob", messages: [{ id: 2, text: "Hello!", from: "user" }] }
        ]);
        const selectedUser = Vue.ref(null);
        const newMessage = Vue.ref("");
      
        const selectUser = (user) => {
            selectedUser.value = user;
        };
      
        const sendMessage = () => {
          if (newMessage.value.trim() && selectedUser.value) {
            selectedUser.value.messages.push({
                id: Date.now(),
                text: newMessage.value,
                from: "user"
            });
            newMessage.value = "";
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
      
        const soldItems = Vue.ref([
            { id: 1, name: "Example Sold" },
            { id: 2, name: "Calculator" },
        ]);
      
        //Profile Settings Handlers
        const saveSettings = async () => {
            const payload = {
                user_name: usernameEdit.value.trim(),
                description: description.value.trim(),
                password: newPassword.value.trim() || null,
            };

            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Settings updated successfully!");
            } else {
                alert("Error: " + data.error);
            }
        };
      
        const onIconChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                iconEdit.value = ev.target.result;
            };
            reader.readAsDataURL(file);
            }
        };

        // Fetch user data from the API
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
                    console.log("Session data", sessionData);
                    if (userResponse.ok) {
                        user.value = {
                            username: userData.user_name,
                            joinedDate: userData.joined_date,
                            icon: sessionData.user_icon || "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123",
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
                    console.error("User is not logged in.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
        fetchLikedItems();
      
        return {
          //Profile related data
          username,
          usernameEdit,
          icon,
          iconEdit,
          newPassword,
          description,
          activeTab,
          user,
      
          //Chat related data
          users,
          selectedUser,
          newMessage,
          selectUser,
          sendMessage,
      
          //Item related data
          likedItems,
          soldItems,
      
          //Profile settings functions
          saveSettings,
          onIconChange,
        };
    }
};
