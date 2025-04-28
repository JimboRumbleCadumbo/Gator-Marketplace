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
                <div class="product-grid">
                    <div class="card">
                        <img src="https://placehold.co/600x400" alt="Item Image" />
                        <h3> Sample Item</h3>
                        <p>$10</p>
                        <p>Sample description Sample description</p>
                    </div>

                    <div class="card">
                        <img src="https://placehold.co/600x400" alt="Item Image" />
                        <h3> Sample Item</h3>
                        <p>$10</p>
                        <p>Sample description Sample description</p>
                    </div>

                    <div class="card">
                        <img src="https://placehold.co/600x400" alt="Item Image" />
                        <h3> Sample Item</h3>
                        <p>$10</p>
                        <p>Sample description Sample description</p>
                    </div>

                    <div class="card">
                        <img src="https://placehold.co/600x400" alt="Item Image" />
                        <h3> Sample Item</h3>
                        <p>$10</p>
                        <p>Sample description Sample description</p>
                    </div>
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
