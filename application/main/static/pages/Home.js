console.log("Home.js Loaded!");

export default {
    template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Home</router-link>
            <search-bar></search-bar>
            <router-link to="/postings" class="nav-link">Create Listing</router-link>
            <router-link to="/test" class="nav-link">About</router-link>
        </nav>
        <div class="container">
            <div class="content">
                <h1>CSC 648-Spring 2025 Team 05</h1>

            <div class="product-grid" v-show="searchData.results.length > 0">
                <div class="card" v-for="result in searchData.results" :key="result.id">
                <img :src="result.image_base64 || 'https://via.placeholder.com/150'" alt="Item Image" />
                <h3>{{ result.name || result.title }}</h3>
                <p>{{ result.price || result.cost }}</p>
                <p>{{ result.description || 'No description available' }}</p>
                </div>
            </div>
                
            </div>
        </div>
    `,
    setup() {
        //Added to make sure searchresults are reset if you hit home page
        const route = VueRouter.useRoute();
        const searchData = Vue.inject('searchData');

        Vue.watchEffect(() => {
            //Reset the results when on the home page
            if (route.path === '/') {
                searchData.results = [];
            }
        });

        return {
            searchData
        };
    }
};