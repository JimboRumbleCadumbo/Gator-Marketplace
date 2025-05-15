/**
 * @file Results.js
 * Displays search results from the marketplace.
 * Shows result cards from searchData.
 */
console.log("Dashboard.js Loaded!");

export default {
  template: `
    <Navbar></Navbar>
    <div class="page-wrapper">
        <div class="container">
            <div class="content">    
                <h1> Results <span class="result-count">({{ filteredResults.length }})</span> </h1>

                <div class="filter-section">
                    <label>Price Range:</label>
                    <input type="number" v-model="minPrice" placeholder="min" />
                    <span>-</span>
                    <input type="number" v-model="maxPrice" placeholder="max" />

                    <button @click="applyFilter">Apply Filter</button>
                    <button @click="clearFilter">Clear Filter</button>
                </div>

                <!-- Product Grid -->
                <div class="result-product-grid" v-show="filteredResults.length > 0">
        
                    <router-link v-for="result in filteredResults"
                        :key="result.id"
                        :to="'/item?id=' + result.item_id"
                        class="card-link"
                        >
                        <div class="result-card">
                            <img :src="result.image_base64 || 'https://placehold.co/600x400'" alt="Item Image" />
                            <h3>{{ result.name || result.title }}</h3>
                            <p>\${{ result.price || result.cost }}</p>
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

    const filteredResults = Vue.ref([]);

    // Price range states
    const minPrice = Vue.ref(0);
    const maxPrice = Vue.ref();

    Vue.watchEffect(() => {
        //Reset the results when on the home page
        if (route.path === "/") {
            searchData.results = [];
        }

        filteredResults.value = searchData.results;
    });

    const applyFilter = () => {
        filteredResults.value = searchData.results.filter((item) => {
            const price = parseFloat(item.price || item.cost || 0);
            return price >= minPrice.value && price <= maxPrice.value;
        });
    };

    const clearFilter = () => {
        minPrice.value = 0;
        maxPrice.value = null;
        filteredResults.value = searchData.results;
    };

    Vue.onMounted(() => {
        filteredResults.value = searchData.results;
    });

    return {
        searchData,
        minPrice,
        maxPrice,
        filteredResults,
        applyFilter,
        clearFilter,
        
    };
  },
};
