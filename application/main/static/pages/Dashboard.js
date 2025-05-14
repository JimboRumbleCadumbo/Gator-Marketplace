console.log("Dashboard.js Loaded!");

export default {
  template: `
    <Navbar></Navbar>
    <div class="page-wrapper">
        <div class="container">
            <div class="content">
                <div class="banner">
                    <h1>Welcome to Our Marketplace!</h1>
                    <p>Browse items from students at SFSU.</p>
                </div>
        
                <h1> Featured Items </h1>
                <!-- Product Grid -->
                <!-- Product Grid -->
                <div class="product-grid">
                    <router-link 
                        v-for="item in featuredItems" 
                        :key="item.id" 
                        :to="'/item?id=' + item.id" 
                        class="card-link">
                        
                        <div class="card">
                            <img :src="item.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
                            <h3>{{ item.name || item.title }}</h3>
                            <p>\${{ item.price || item.cost }}</p>
                            <p>{{ item.description || 'No description available' }}</p>
                        </div>
                    </router-link>
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
    //Added to make sure searchresults are reset if you hit home page
    const route = VueRouter.useRoute();
    const searchData = Vue.inject("searchData");
    const featuredItems = Vue.ref([]);

    Vue.watchEffect(() => {
        //Reset the results when on the home page
        if (route.path === "/") {
            searchData.results = [];
        }
    });

    const fetchFeaturedItems = async () => {
        try {
            const response = await fetch('/api/featured-items');
            console.log("Response:", response);
            const data = await response.json();
            featuredItems.value = data;
        } catch (error) {
            console.error("Error fetching featured items:", error);
        }
    };

    fetchFeaturedItems();

    return {
        searchData,
        featuredItems,
        fetchFeaturedItems,
    };
  },
};
