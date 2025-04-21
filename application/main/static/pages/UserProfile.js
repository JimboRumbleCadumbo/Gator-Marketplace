export default {
    template: `
        <Navbar></Navbar>
        <div class="user-info-container">
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
            <div class="liked-items">
                <h2>Liked Items</h2>
                <ul>
                    <li v-for="item in likedItems" :key="item.id">
                        <img :src="item.image" alt="item image" class="liked-item-img" />
                        <span>{{ item.name }}</span>
                    </li>
                    <li v-if="likedItems.length === 0">No liked items yet.</li>
                </ul>
            </div>
        </div>
    `,
    setup() {
        const username = Vue.ref("CoolUser123");
        const usernameEdit = Vue.ref(username.value);
        const editingUsername = Vue.ref(false);

        const joinedDate = Vue.ref("2023-12-01");
        const rating = Vue.ref(4);
        const description = Vue.ref("This is my profile description!");
        const icon = Vue.ref("https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123");

        // Simulate liked items
        const likedItems = Vue.ref([
            { id: 1, name: "Vintage Camera", image: "https://placehold.co/40x40?text=Cam" },
            { id: 2, name: "Classic Book", image: "https://placehold.co/40x40?text=Book" },
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
                reader.onload = ev => {
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
            saveUsername
        };
    }
};

