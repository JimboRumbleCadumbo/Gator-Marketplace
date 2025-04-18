export default {
    template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Home</router-link>
            <search-bar></search-bar>
            <router-link to="/about" class="nav-link">About</router-link>
        </nav>
        <div class="container">
            <div class="content">
                <h1>CSC-648 Group 5</h1>
                <div class="group-buttons">
                    <router-link to="/about/alexis" class="button">Alexis Perez</router-link>
                    <router-link to="/about/david" class="button">David Cabanela</router-link>
                    <router-link to="/about/jun" class="button">David Chang</router-link>
                    <router-link to="/about/athan" class="button">Athan Cheung</router-link>
                    <router-link to="/about/yuming" class="button">Yu-Ming Chen</router-link>
                </div>
            </div>
        </div>
    `,
};
