console.log("Dashboard.js Loaded!");

export default {
  template: `
    <Navbar></Navbar>
    <div class="container">
        <div class="content">    
            <h1> Results </h1>
            <!-- Product Grid -->
            <div class="result-product-grid" v-show="searchData.results.length > 0">
    
                <router-link v-for="result in searchData.results"
                    :key="result.id"
                    :to="'/item?id=' + result.item_id"
                    class="card-link"
                    >
                    <div class="result-card">
                        <img :src="result.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
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
