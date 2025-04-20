import Searchbar from "/static/components/Searchbar.js";

export default {
    components: { Searchbar },
    template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Gator Savvy</router-link>
            <Searchbar></Searchbar>
            <router-link to="/postings" class="nav-link">Post</router-link>
            <router-link to="/login" class="nav-link">Login/Signup</router-link>
        </nav>
    `,
};