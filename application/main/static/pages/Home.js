console.log("Home.js Loaded!");

export default {
    template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Home</router-link>
            <search-bar></search-bar>
            <router-link to="/test" class="nav-link">About</router-link>
        </nav>
        <div class="container">
            <div class="content">
                <h1>CSC 648-Spring 2025 Team 05</h1>

                <div class="product-grid">
                    <div class="card">
                        <img src="https://via.placeholder.com/150" alt="Item Image" />
                        <h3>Product Name</h3>
                        <p>Product description</p>
                    </div>

                    <div class="card">
                        <img src="" alt="Item Image" />
                        <h3>Product Name</h3>
                        <p>Product description</p>
                    </div>

                    <div class="card">
                        <img src="" alt="Item Image" />
                        <h3>Product Name</h3>
                        <p>Product description</p>
                    </div>
                    <div class="card">
                        <img src="" alt="Item Image" />
                        <h3>Product Name</h3>
                        <p>Product description</p>
                    </div>
                    <div class="card">
                        <img src="" alt="Item Image" />
                        <h3>Product Name</h3>
                        <p>Product description</p>
                    </div>
                </div>
                
            </div>
        </div>
    `
};