export default {
    template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Home</router-link>
            <search-bar></search-bar>
            <router-link to="/postings" class="nav-link">Create Listing</router-link>
            <router-link to="/test" class="nav-link">Test Page</router-link>
        </nav>
    `,
};
