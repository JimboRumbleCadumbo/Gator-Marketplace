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
                            <div v-if="!item.is_active" class="sold-banner">SOLD</div>
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
                    <router-link 
                        v-for="item in soldItems" 
                        :key="item.item_id" 
                        :to="'/item?id=' + item.item_id" 
                        class="card-link"
                    >
                        <div class="result-card">
                            <div class="sold-banner">SOLD</div>
                            <img :src="item.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
                            <h3>{{ item.name }}</h3>
                            <p>{{ item.price }}</p>
                        </div>
                    </router-link>
                </div>
            </div>

            <div v-if="activeTab === 'rented'" class="tab-content">
                <h3>Rented Items</h3>
                <div class="dashboard-product-grid">
                    <div class="result-card rented-card" v-for="item in rentedItems" :key="item.item_id">
                        <div class="return-banner">
                            Return by: {{ item.return_date || 'TBD' }}
                        </div>
                        <img :src="item.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.price }}</p>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'messages'" class="tab-content">
                <h3>Messages</h3>
                <div class="messages-container">
                    <!-- Conversation list -->
                    <div class="user-list">
                        <div
                            v-for="conv in users"
                            :key="conv.id + '-' + conv.item_id"
                            class="user-list-item"
                            :class="{ active: selectedConv && selectedConv.id === conv.id && selectedConv.item_id === conv.item_id }"
                            @click="selectConv(conv)">
                            {{ conv.name }}
                        </div>
                    </div>

                    <!-- Chat area -->
                    <div class="chat-panel" v-if="selectedConv">
                        <div class="chat-header">
                            <span>
                                {{ selectedConv.name }}
                                <strong v-if="selectedConv.is_active === 0">(SOLD)</strong>
                            </span>
                        </div>
                        <div class="chat-messages">
                            <div
                                v-for="msg in messages"
                                :key="msg.id"
                                class="message"
                                :class="msg.from === 'user' ? 'user' : 'seller'">
                                {{ msg.text }}
                            </div>
                        </div>
                        <div class="chat-input">
                            <input
                                type="text"
                                v-model="newMessage"
                                @keyup.enter="sendMessage()"
                                placeholder="Type a message..."
                            />
                            <button @click="sendMessage()">Send</button>
                        </div>
                    </div>

                    <!-- Placeholder if no conversation selected -->
                    <div class="chat-panel" v-else>
                        <p class="no-user-selected">Select a conversation to start chatting</p>
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
            userIcon:
                window.__LOGIN_STATE__.user_icon ||
                "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123", // Default icon
        };
    },
    setup() {
        const { ref, onMounted, onUnmounted, watch } = Vue;

        // User data
        const user = ref(null);

        // Tabs and settings
        const activeTab = ref("about");
        const usernameEdit = ref("");
        const newPassword = ref("");
        const description = ref("");

        // Messages
        const users = ref([]);
        const selectedConv = ref(null);
        const messages = ref([]);
        const newMessage = ref("");
        let poller = null;

        // Items
        const likedItems = ref([]);
        const myItems = ref([]);
        const soldItems = ref([]);
        const rentedItems = [
            {
                item_id: 1,
                name: "Portable Projector",
                price: "$25/day",
                return_date: "2025-05-25",
                image_base64:
                    "https://placehold.co/600x400?text=Portable+Projector",
            },
            {
                item_id: 2,
                name: "Electric Scooter",
                price: "$15/day",
                return_date: "2025-05-20",
                image_base64:
                    "https://placehold.co/600x400?text=Electric+Scooter",
            },
            {
                item_id: 3,
                name: "Camping Tent",
                price: "$10/day",
                return_date: "2025-05-22",
                image_base64: "https://placehold.co/600x400?text=Camping+Tent",
            },
        ];

        // ----------------- Message functions -----------------

        async function safeJson(res) {
            if (!res.ok) {
                console.error(res.status, await res.text());
                return null;
            }
            const ct = res.headers.get("Content-Type") || "";
            if (!ct.includes("application/json")) {
                console.error("expected JSON", ct);
                return null;
            }
            return res.json();
        }

        const fetchConversations = async () => {
            const res = await fetch("/api/messages/fetchAllContact", {
                credentials: "include",
            });
            const data = await safeJson(res);
            if (data?.success) {
                users.value = data.messages.map((m) => ({
                    id: m.contact_id,
                    item_id: m.item_id,
                    name: `${m.user_name} - ${m.item_name}`,
                    is_active: m.is_active,
                }));
                if (!selectedConv.value && users.value.length)
                    selectConv(users.value[0]);
            }
        };

        // load chat history for given conversation
        const loadHistory = async (contactId, itemId) => {
            const url = `/api/messages/${contactId}?item_id=${itemId}`;
            const res = await fetch(url, { credentials: "include" });
            const data = await safeJson(res);
            if (data?.success) {
                messages.value = data.messages.map((msg) => ({
                    id: msg.id,
                    text: msg.text,
                    from: msg.sender_id === contactId ? "seller" : "user",
                }));
            }
        };

        // select a conversation
        const selectConv = async (conv) => {
            selectedConv.value = conv;
            newMessage.value = "";
            await loadHistory(conv.id, conv.item_id);
        };

        // send a message
        const sendMessage = async () => {
            if (!newMessage.value.trim() || !selectedConv.value) return;
            const body = {
                receiver_id: selectedConv.value.id,
                text: newMessage.value,
                item_id: selectedConv.value.item_id,
            };
            const res = await fetch("/api/messages", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await safeJson(res);
            if (data?.success) {
                newMessage.value = "";
                await loadHistory(
                    selectedConv.value.id,
                    selectedConv.value.item_id
                );
            }
        };

        // ----------------- Item functions -----------------

        const deleteUserItem = async (itemId) => {
            if (!confirm("Are you sure you want to delete this item?")) return;
            try {
                const response = await fetch(`/api/user-items/${itemId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to delete item.");
                myItems.value = myItems.value.filter(
                    (item) => item.item_id !== itemId
                );
                soldItems.value = soldItems.value.filter(
                    (item) => item.item_id !== itemId
                );
                alert("Item deleted successfully!!");
            } catch (error) {
                console.error(error);
            }
        };

        const markAsSold = async (itemId) => {
            if (!confirm("Are you sure you want to mark this item as sold?"))
                return;
            try {
                const response = await fetch(`/api/user-items/${itemId}/sold`, {
                    method: "POST",
                    credentials: "include",
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(
                        errData.error || "Failed to mark item as sold."
                    );
                }
                const soldItem = myItems.value.find(
                    (item) => item.item_id === itemId
                );
                if (soldItem) {
                    myItems.value = myItems.value.filter(
                        (item) => item.item_id !== itemId
                    );
                    soldItems.value.push(soldItem);
                }
                alert("Item marked as sold successfully!!");
            } catch (error) {
                console.error(error);
            }
        };

        // ----------------- User Setting functions -----------------

        const saveSettings = async () => {
            try {
                const formData = new FormData();
                formData.append("user_name", usernameEdit.value.trim());
                formData.append("description", description.value.trim());
                if (newPassword.value.trim()) {
                    formData.append("password", newPassword.value.trim());
                }
                if (user.value.icon) {
                    const blob = await fetch(user.value.icon).then((res) =>
                        res.blob()
                    );
                    formData.append("icon", blob);
                }
                const response = await fetch("/api/user/update", {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to update settings.");
                }
                alert("Updated successfully!!");
            } catch (error) {
                console.error(error);
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
                const sessionResponse = await fetch("/api/session");
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
                            icon:
                                userData.user_icon ||
                                "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123",
                            rating: userData.rating,
                            description: userData.description,
                        };

                        // Update the settings form fields
                        usernameEdit.value = userData.user_name || "";
                        description.value = userData.description || "";
                    } else {
                        console.error(
                            "Failed to fetch user data:",
                            userData.error
                        );
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
                const response = await fetch("/api/liked-items");
                if (!response.ok)
                    throw new Error("Failed to fetch liked items");

                const data = await response.json();
                likedItems.value = data;
                // console.log("Loaded liked items:", likedItems.value);
            } catch (error) {
                console.error("Error loading liked items:", error);
            }
        };

        // console.log(likedItems.value);

        //Get Users liked items
        const fetchUsersItems = async (status = "active") => {
            try {
                const response = await fetch(
                    `/api/user-items?status=${status}`
                );
                if (!response.ok)
                    throw new Error(`Failed to fetch ${status} items`);

                const data = await response.json();
                if (status === "active") {
                    myItems.value = data;
                } else {
                    soldItems.value = data;
                }
                // console.log(`Loaded User's ${status} items:`, data);
            } catch (error) {
                console.error(`Error loading User's ${status} items:`, error);
            }
        };

        onMounted(() => {
            if (activeTab.value === "messages") {
                fetchConversations();
            }
            fetchUserData();
            fetchLikedItems();
            fetchUsersItems("active");
            fetchUsersItems("sold");
        });

        onUnmounted(() => clearInterval(poller));

        watch(activeTab, (tab) => {
            if (tab === "messages") {
                fetchConversations();
                poller = setInterval(() => {
                    if (selectedConv.value)
                        loadHistory(
                            selectedConv.value.id,
                            selectedConv.value.item_id
                        );
                }, 5000);
            } else {
                clearInterval(poller);
                poller = null;
            }
        });

        return {
            user,
            activeTab,
            usernameEdit,
            newPassword,
            description,
            users,
            selectedConv,
            messages,
            newMessage,
            likedItems,
            myItems,
            soldItems,
            rentedItems,
            selectConv,
            fetchConversations,
            sendMessage,
            deleteUserItem,
            markAsSold,
            saveSettings,
            onIconChange,
        };
    },
};
