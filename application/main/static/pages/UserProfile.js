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
                    <div class="user-content">
                        <div class="user-header">
                            <img :src="icon" alt="User Icon" class="user-icon" />
                        </div>
                        <div class="user-details">
                            <div class="username-section">
                                <span class="username">{{ username }}</span>
                            </div>
                            <div class="joined-date">Joined: {{ joinedDate }}</div>
                            <div class="rating">
                                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= rating }">&#9733;</span>
                                <span class="rating-score">({{ rating }}/5)</span>
                            </div>
                            <div class="description">
                                <label>Description:</label>
                                <p class="description-text">{{ description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'liked'" class="tab-content">
                <h3>Liked Items</h3>
                <div class="card">
                    <img src="https://placehold.co/600x400" alt="Item Image" />
                    <h3> Sample Item</h3>
                    <p>$10</p>
                    <p>Sample description Sample description</p>
                </div>

                <div class="card">
                    <img src="https://placehold.co/600x400" alt="Item Image" />
                    <h3> Sample Item</h3>
                    <p>$10</p>
                    <p>Sample description Sample description</p>
                </div>                   
            </div>

            <div v-if="activeTab === 'sold'" class="tab-content">
                <h3>Sold Items</h3>
                <p>This tab is for sold items.</p>
            </div>

            <div v-if="activeTab === 'rented'" class="tab-content">
                <h3>Rented Items</h3>
                <p>This tab is for rented items.</p>
            </div>

            <div v-if="activeTab === 'messages'" class="tab-content">
                <h3>Messages</h3>
                <p>This tab is for messages.</p>
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
    const activeTab = Vue.ref("about");
    const username = Vue.ref("CoolUser123");
    const usernameEdit = Vue.ref(username.value);

    const joinedDate = Vue.ref("2023-12-01");
    const rating = Vue.ref(4);
    const description = Vue.ref("This is my profile description!");
    const icon = Vue.ref(
      "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123"
    );
    const iconEdit = Vue.ref(icon.value);
    const newPassword = Vue.ref("");

    // Simulate liked items
    const likedItems = Vue.ref([
      {
        id: 1,
        name: "Vintage Camera",
        image: "https://placehold.co/40x40?text=Cam",
      },
      {
        id: 2,
        name: "Classic Book",
        image: "https://placehold.co/40x40?text=Book",
      },
    ]);

    function saveSettings() {
        if (usernameEdit.value.trim() !== "") {
          username.value = usernameEdit.value.trim();
        }
        if (iconEdit.value) {
          icon.value = iconEdit.value;
        }
        if (newPassword.value.trim() !== "") {
          console.log("Password changed:", newPassword.value);
        }
      }

    function onIconChange(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            iconEdit.value = ev.target.result; // Preview image only
          };
          reader.readAsDataURL(file);
        }
      }

    // Username change logic
    function saveUsername() {
      if (usernameEdit.value.trim() !== "") {
        username.value = usernameEdit.value.trim();
      }
      editingUsername.value = false;
    }

    return {
      username,
      usernameEdit,
      joinedDate,
      rating,
      description,
      icon,
      likedItems,
      onIconChange,
      saveUsername,
      saveSettings,
      activeTab,
      iconEdit
    };
  },
};
