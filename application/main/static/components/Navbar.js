export default {
    template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Home</router-link>
            <search-bar></search-bar>
            <router-link to="/postings" class="nav-link">Create Listing</router-link>
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/signup" class="nav-link">Sign Up</router-link>
        </nav>
    `,
};