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
                            <img :src="user.icon || defaultIcon" alt="User Icon" class="user-icon" />
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
                    <div class="result-card liked-card" v-for="item in likedItems" :key="item.id">
                        <img :src="item.image || 'https://placehold.co/600x400'" alt="Item Image" />
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.price }}</p>
                        <p>{{ item.description }}</p>
                    </div>
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
                            <img :src="iconEdit" alt="Profile Preview" class="user-settings-icon-preview" />
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
    setup() {
        //Example profile related data
        const username = Vue.ref("CoolUser123");
        const icon = Vue.ref(`https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123`);
        const description = Vue.ref("This is my profile description!");
        const usernameEdit = Vue.ref(username.value);
        const iconEdit = Vue.ref(icon.value);
        const newPassword = Vue.ref("");
        const activeTab = Vue.ref("about");

        const user = Vue.ref(null);
        const defaultIcon = "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123";
      
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
      
        //Example items
        const likedItems = Vue.ref([
            { id: 1, name: "Vintage Camera" },
            { id: 2, name: "Classic Book" },
        ]);
      
        const soldItems = Vue.ref([
            { id: 1, name: "Example Sold" },
            { id: 2, name: "Calculator" },
        ]);
      
        //Profile Settings Handlers
        const saveSettings = () => {
            if (usernameEdit.value.trim()) {
                username.value = usernameEdit.value.trim();
            }
            if (iconEdit.value) {
                icon.value = iconEdit.value;
            }
            if (newPassword.value.trim()) {
                console.log("Password changed:", newPassword.value);
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
                if (userResponse.ok) {
                user.value = {
                    username: userData.user_name,
                    icon: "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123",
                    joinedDate: userData.joined_date,
                    rating: userData.rating,
                    // description: userData.description,
                };
                } else {
                console.error("Failed to fetch user data:", userData.error);
                }
            }
            } catch (error) {
            console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
      
        return {
          //Profile related data
          username,
          usernameEdit,
          icon,
          iconEdit,
          newPassword,
          description,
          activeTab,
          defaultIcon,
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
