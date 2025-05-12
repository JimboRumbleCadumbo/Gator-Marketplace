export default {
    //The item.location and item.category are currently id in the return value from searchData.
    //Same thing for seller only currently and id.

    template: `
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
                            <button @click="showChat" :disabled="item.rentalOption == 'Not for Rent' || !isLoggedIn" class="item-button">Rent</button>
                            <button @click="showChat" :disabled="!isLoggedIn" class="item-button">Buy</button>
                            <span v-if="!isLoggedIn" class="tooltip">You need to log in to buy</span>
                        </div>
                    </div>
                </div>
            </div>
  
            <div class="chat-box" v-if="chatVisible">
                <button @click="hideChat" class="close-btn">×</button>
                <strong>Seller: {{ item.seller_name }}</strong>
                <div class="chat-messages">
                    <div class="message user">User: Is this still available?</div>
                    <div class="message seller">Seller: Yes, it is!</div>
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Type a message..." />
                    <button>Send</button>
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
        const route = VueRouter.useRoute();
        const isLoggedIn = Vue.ref(false);
        const chatVisible = Vue.ref(false);
        const isLiked = Vue.ref(false);
        const item = Vue.ref({});
        const user = Vue.ref(null);

        const showChat = () => {
        chatVisible.value = true;
        };

        const hideChat = () => {
        chatVisible.value = false;
        };

        const goToSellerProfile = () => {
        console.log("Go to seller profile clicked");
        };

        const toggleLike = async () => {
            if (!isLoggedIn.value) {
                alert("You must be logged in to like an item.");
                return;
            }

            try {
                const response = await fetch('/api/wishlist/toggle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.value.user_id,
                        item_id: item.value.id,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to toggle like");
                }

                const data = await response.json();
                isLiked.value = data.liked;
                console.log("Like status:", isLiked.value);
            } catch (error) {
                console.error("Error toggling like:", error);
                alert("Failed to toggle like.");
            }


            console.log("Like button clicked. Liked:", isLiked.value);
        }

        const loadItemDetails = async () => {
            const itemId = route.query.id;
            try {
                const response = await fetch(`/api/item?id=${itemId}`);
                if (!response.ok) throw new Error("Failed to fetch item details");
                    const data = await response.json();
                    console.log("Data that can be loaded:", data);
                    item.value = {
                    id: data.item_id,
                    name: data.name,
                    description: data.description,
                    price: `$${data.price.toFixed(2)}`,
                    seller_id: data.seller_id,
                    seller_name: data.seller_name,
                    seller_rating: data.seller_rating,
                    quality: data.quality,
                    rentalOption: data.rental_option ? "Available for Rent" : "Not for Rent",
                    category: data.category_name,
                    image: data.image ? `data:image/jpeg;base64,${data.image}` : "https://placehold.co/600x400",
                };

                if (isLoggedIn.value) {
                    const likeResponse = await fetch(`/api/wishlist/check?user_id=${user.value.user_id}&item_id=${item.value.id}`);
                    const likeData = await likeResponse.json();
                    isLiked.value = likeData.liked;
                }

            } catch (error) {
                console.error("Error loading item details:", error);
                alert("Failed to load item details.");
            }
        };

        const fetchUserData = async () => {
            try {
                const sessionResponse = await fetch('/api/session');
                const sessionData = await sessionResponse.json();
                isLoggedIn.value = sessionData.logged_in || false;
                console.log("isLoggedin", isLoggedIn.value);

                if (isLoggedIn.value) {
                    user.value = {
                        user_id: sessionData.user_id,
                        username: sessionData.user_name,
                    };
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        loadItemDetails();
        fetchUserData();

        return {
            item,
            user,
            isLoggedIn,
            chatVisible,
            isLiked,
            showChat,
            hideChat,
            goToSellerProfile,
            loadItemDetails,
            fetchUserData,
            toggleLike,
        };

    },
};
