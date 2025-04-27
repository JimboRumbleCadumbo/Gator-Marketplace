export default {
  template: `
        <Navbar></Navbar>
        
        <div class="page-wrapper">
            <div class="user-container">
                    <div class="user-header">
                        <img :src="icon" alt="User Icon" class="user-icon" />
                        <input type="file" accept="image/*" @change="onIconChange" ref="iconInput" style="display:none" />
                        <button @click="triggerIconChange">Change Icon</button>
                    </div>
                    <div class="user-details">
                        <div class="username-section">
                            <span v-if="!editingUsername">{{ username }}</span>
                            <input v-else v-model="usernameEdit" @keyup.enter="saveUsername" @blur="saveUsername" />
                            <button v-if="!editingUsername" @click="editingUsername = true">Change Username</button>
                            <button v-else @click="saveUsername">Save</button>
                        </div>
                        <div class="joined-date">Joined: {{ joinedDate }}</div>
                        <div class="rating">
                            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= rating }">&#9733;</span>
                            <span>({{ rating }}/5)</span>
                        </div>
                        <div class="description">
                            <label>Description:</label>
                            <textarea v-model="description" rows="3"></textarea>
                        </div>
                    </div>
                            </div>

                    <!-- Tabs -->
                    <div class="tab">
                        <button @click="activeTab = 'liked'" :class="{ active: activeTab === 'liked' }">Liked Items</button>
                        <button @click="activeTab = 'sold'" :class="{ active: activeTab === 'sold' }">Sold Items</button>
                        <button @click="activeTab = 'rented'" :class="{ active: activeTab === 'rented' }">Rented Items</button>
                        <button @click="activeTab = 'messages'" :class="{ active: activeTab === 'messages' }"> Messages </button>
                    </div>

                    <!-- Tab Content -->
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


            <footer class="footer">
                <p>&copy; 2025 CSC 648 Team 05. All rights reserved.</p>
                <router-link to="/about" class="footer-link">About</router-link>
            </footer>
        </div>
    `,
  setup() {
    const username = Vue.ref("CoolUser123");
    const usernameEdit = Vue.ref(username.value);
    const editingUsername = Vue.ref(false);

    const joinedDate = Vue.ref("2023-12-01");
    const rating = Vue.ref(4);
    const description = Vue.ref("This is my profile description!");
    const icon = Vue.ref(
      "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123"
    );

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

    // Icon change logic
    const iconInput = Vue.ref(null);
    function triggerIconChange() {
      iconInput.value.click();
    }
    function onIconChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          icon.value = ev.target.result;
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

    const activeTab = Vue.ref("liked");

    return {
      username,
      usernameEdit,
      editingUsername,
      joinedDate,
      rating,
      description,
      icon,
      likedItems,
      iconInput,
      triggerIconChange,
      onIconChange,
      saveUsername,
      activeTab,
    };
  },
};
