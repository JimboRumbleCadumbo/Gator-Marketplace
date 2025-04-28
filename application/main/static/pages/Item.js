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
                        <h2>{{ item.name }}</h2>
                        <p><strong>Price:</strong> {{ item.price }}</p>
                        <p><strong>Location:</strong> {{ item.location }}</p>
                        <p><strong>Condition:</strong> {{ item.quality }}</p>
                        <p><strong>Category:</strong> {{ item.category }}</p>
                        <div class="buttons">
                            <button @click="showChat">Rent</button>
                            <button @click="showChat">Buy</button>
                        </div>
                    </div>
                </div>

                <div class="item-lower">
                    <div class="description">
                        <h3>Description</h3>
                        <p>{{ item.description }}</p>
                    </div>

                    <div class="seller-section">
                        <div class="seller-info">
                            <p class="seller-profile">
                                <strong @click="goToSellerProfile">Seller:</strong> {{ item.seller?.name }}
                                <span v-if="item.seller?.verified" class="badge">Verified</span>
                                <span>{{ item.seller?.rating }} ★</span>
                            </p>
                            <p>^Can Click to go seller page^</p>
                        </div>
                    </div>
                </div>

                <div class="chat-box" v-if="chatVisible">
                    <button @click="hideChat" class="close-btn">×</button>
                    <strong>Seller</strong>
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

    data() {
        return {
            chatVisible: false,
            item: {
                image: null,
                name: "",
                price: "",
                description: "",
                category: "",
            },
        };
    },
    methods: {
        showChat() {
            this.chatVisible = true;
        },
        hideChat() {
            this.chatVisible = false;
        },
        goToSellerProfile() {
            console.log("Go to seller profile clicked");
        },
        loadItemDetails() {
            const route = VueRouter.useRoute();
            const itemId = route.query.id;

            fetch(`/api/item?id=${itemId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch item details");
                    }
                    return response.json();
                })
                .then((data) => {
                    this.item = {
                        id: data.item_id,
                        name: data.name,
                        description: data.description,
                        price: `$${data.price.toFixed(2)}`,
                        location: data.location,
                        quality: data.quality,
                        rentalOption: data.rental_option ? "Available for Rent" : "Not for Rent",
                        category: data.category_name, // Use category_name from the API
                        image: data.image ? `data:image/jpeg;base64,${data.image}` : "https://placehold.co/600x400", // Use placeholder if image is missing
                    };
                })
                .catch((error) => {
                    console.error("Error loading item details:", error);
                    alert("Failed to load item details.");
                });
        },
    },
    created() {
        this.loadItemDetails();
    },
};
