export default {
  //The item.location and item.category are currently id in the return value from searchData.
  //Same thing for seller only currently and id.

  template: `
    <Navbar></Navbar>
    <div class="page-wrapper">
        <div class="container">
            <div class="item-layout">
            <div class="item-image"></div>
            <div class="item-details">
                <h2>{{ item.name }}</h2>
                <p><strong>Price:</strong> {{ item.price }}</p>
                <p><strong>Condition:</strong> {{ item.condition }}</p>
                <p><strong>Categories:</strong> {{ item.categories}}</p>
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
            item: {},
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

            const searchData = Vue.inject("searchData");
            const found = searchData.results.find(i => String(i.item_id) === String(itemId));

            this.item = {
                name: "Sample Item",
                price: "$100",
                condition: "Used",
                categories: ["Electronics", "Gadgets"],
                description: "This is a sample item description.",
                seller: {
                name: "John Doe",
                verified: true,
                rating: 4.5,
                },
            };
            //Example for how we could do it in the future
            // if(found) {
            //   this.item = found;
            // } else {
            //   this.item = {
            //     name: "Sample Item",
            //     price: "$100",
            //     location: "New York, NY",
            //     condition: "Used",
            //     categories: ["Electronics", "Gadgets"],
            //     description: "This is a sample item description.",
            //     seller: {
            //       name: "John Doe",
            //       verified: true,
            //       rating: 4.5,
            //     },
            //   };
            // }

        },
    },
    created() {
        this.loadItemDetails();
    },
};
