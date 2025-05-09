/**
 * @file Home.js
 * Displays a welcome banner and a grid of items based on search results.
 */
console.log("Home.js Loaded!");

export default {
    template: `
        <Navbar></Navbar>
        <div class="container">
            <div class="content">
                <div class="banner">
                    <h2>Welcome to Our Marketplace!</h2>
                    <p>Browse items from students at SFSU.</p>
                </div>

                <h1>Featured Items</h1>

                <div class="product-grid" v-show="searchData.results.length > 0">
                    <router-link v-for="result in searchData.results"
                        :key="result.id"
                        :to="'/item?id=' + result.item_id"
                        class="card-link"
                        >
                        <div class="card">
                            <img :src="result.image_base64 || 'https://via.placeholder.com/150'" alt="Item Image" />
                            <h3>{{ result.name || result.title }}</h3>
                            <p>{{ result.price || result.cost }}</p>
                            <p>{{ result.description || 'No description available' }}</p>
                        </div>
                    </router-link>
                </div>


            </div>
        </div>

        <footer class="footer">
            <p>&copy; 2025 CSC 648 Team 05. All rights reserved.</p>
            <router-link to="/about" class="footer-link">About</router-link>
        </footer>
    `,
    setup() {
        //Added to make sure searchresults are reset if you hit home page
        const route = VueRouter.useRoute();
        const searchData = Vue.inject("searchData");

        Vue.watchEffect(() => {
            //Reset the results when on the home page
            if (route.path === "/") {
                searchData.results = [];
            }
        });

        return {
            searchData,
        };
    },
};
