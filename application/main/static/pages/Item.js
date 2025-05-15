export default {
    template: `
    <div>
        <Navbar></Navbar>
        <div class="page-wrapper">
            <div class="container">
                <div class="item-layout">
                    <img :src="item.image" alt="Item Image" class="item-image" />
                    
                    <div class="item-details">
                        <div class="item-title">
                            <h2>{{ item.name }}</h2>
                            <span class="like-icon" @click="toggleLike">
                                <span :class="{ liked: isLiked }">♥</span>
                            </span>
                        </div>
                        
                        <p><strong>Price:</strong> {{ item.price }}</p>
                        
                        <div class="seller-section">
                            <div class="seller-info">
                                <p class="seller-profile">
                                <strong @click="goToSellerProfile">Seller:</strong> {{ item.seller_name }}
                                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= item.seller_rating }">&#9733;</span>
                                <span class="badge">Verified</span>
                                </p>
                            </div>
                        
                            <p class="category-line">
                                <strong>Categories:</strong>
                                <span class="category-badge">{{ item.category }}</span>
                            </p>
                        
                            <div class="description">
                                <p><strong>Condition:</strong>
                                {{ item.quality }}</p>
                            </div>
                        
                            <div class="description">
                                <h3>Description</h3>
                                <p>{{ item.description }}</p>
                            </div>
                        
                            <div class="buttons">
                                <button @click="initiateChat('rent')" :disabled="item.rentalOption === 'Not for Rent' || !isLoggedIn" class="item-button">Rent</button>
                                <button @click="initiateChat('buy')" :disabled="!isLoggedIn" class="item-button">Buy</button>
                                <span v-if="!isLoggedIn" class="tooltip">You need to log in to chat</span>
                            </div>
                        </div>
                    </div>               
                </div>

                <div class="chat-box" v-if="chatVisible">
                    <button @click="hideChat" class="close-btn">x</button>
                    <strong>Seller: {{ item.seller_name }}</strong>
                    <div class="chat-messages">
                        <div 
                            v-for="msg in messages" 
                            :key="msg.id" 
                            class="message" 
                            :class="msg.sender_id === currentUserId ? 'user' : 'seller'"
                        >
                            {{ msg.text }}
                        </div>
                    </div>
                    <div class="chat-input">
                        <input 
                            type="text" 
                            v-model="newMessage" 
                            @keyup.enter="sendMessage" 
                            placeholder="Type a message..." 
                        />
                        <button @click="sendMessage">Send</button>
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
    setup() {
        const { ref, onMounted, onUnmounted, watch } = Vue;
        const route = VueRouter.useRoute();

        // Reactive state
        const isLoggedIn = ref(false);
        const currentUserId = ref(null);
        const chatVisible = ref(false);
        const isLiked = ref(false);
        const item = ref({});
        const newMessage = ref("");
        const messages = ref([]);
        let poller = null;

        // Safe JSON parser
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

        // Fetch current user session
        const fetchUserData = async () => {
            const res = await fetch('/api/session', { credentials: 'include' });
            const data = await safeJson(res);
            if (data && data.logged_in) {
                isLoggedIn.value = true;
                currentUserId.value = data.user_id;
            } else {
                isLoggedIn.value = false;
            }
        };

        // Load item details
        const loadItemDetails = async () => {
            const itemId = route.query.id;
            const res = await fetch(`/api/item?id=${itemId}`);
            const data = await safeJson(res);
            if (data) {
                item.value = {
                    id: data.item_id,
                    name: data.name,
                    description: data.description,
                    price: `$${data.price.toFixed(2)}`,
                    seller_id: data.seller_id,
                    seller_name: data.seller_name,
                    seller_rating: data.seller_rating,
                    quality: data.quality,
                    rentalOption: data.rental_option ? 'Available for Rent' : 'Not for Rent',
                    category: data.category_name,
                    image: data.image ? `data:image/jpeg;base64,${data.image}` : 'https://placehold.co/600x400',
                };
            }
        };

        // Load chat history with seller
        const loadHistory = async () => {
            if (!item.value.seller_id) return;
            const res = await fetch(`/api/messages/${item.value.seller_id}`, { credentials: 'include' });
            const data = await safeJson(res);
            if (data && data.success) {
                messages.value = data.messages.map(msg => ({
                    id: msg.id,
                    text: msg.text,
                    sender_id: msg.sender_id
                }));
            }
        };

        // Send a new message
        const sendMessage = async () => {
            if (!newMessage.value.trim() || !isLoggedIn.value) return;
            const res = await fetch('/api/messages', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiver_id: item.value.seller_id,
                    text: newMessage.value
                })
            });
            const data = await safeJson(res);
            if (data && data.success) {
                newMessage.value = '';
                await loadHistory();
            }
        };

        // Initiate chat (populate textbox but do not auto-send)
        const initiateChat = async (actionType) => {
            chatVisible.value = true;
            await loadHistory();
            if (actionType === 'buy') {
                newMessage.value = `I want to buy ${item.value.name} (${item.value.price}).`;
            } else if (actionType === 'rent') {
                newMessage.value = `I want to rent ${item.value.name}.`;
            }
        };

        // Toggle like functionality
        const toggleLike = async () => {
            if (!isLoggedIn.value) {
                alert('You must be logged in to like an item.');
                return;
            }
            try {
                const response = await fetch('/api/wishlist/toggle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: currentUserId.value,
                        item_id: item.value.id
                    })
                });
                const data = await safeJson(response);
                if (data) isLiked.value = data.liked;
            } catch (err) {
                console.error('Error toggling like:', err);
            }
        };

        // Navigate to seller profile
        const goToSellerProfile = () => {
            // implement route push to seller's profile page
        };

        // Watch chat visibility to start/stop polling
        watch(chatVisible, visible => {
            if (visible) {
                loadHistory();
                poller = setInterval(loadHistory, 5000);
            } else {
                clearInterval(poller);
                poller = null;
            }
        });

        // Cleanup on unmount
        onUnmounted(() => {
            clearInterval(poller);
        });

        // Initial load
        onMounted(async () => {
            await fetchUserData();
            await loadItemDetails();
        });

        // Expose to template
        return {
            item,
            isLoggedIn,
            currentUserId,
            chatVisible,
            isLiked,
            messages,
            newMessage,
            initiateChat,
            sendMessage,
            hideChat: () => { chatVisible.value = false; },
            showChat: () => { chatVisible.value = true; },
            toggleLike,
            goToSellerProfile
        };
    }
};