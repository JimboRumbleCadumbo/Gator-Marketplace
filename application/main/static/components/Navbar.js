import Searchbar from "/static/components/Searchbar.js";

export default {
  components: { Searchbar },
  data() {
    return {
      // You can replace this with a real user icon URL or a computed property
      userIcon: "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123",
    };
  },
  template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Gator Savvy</router-link>
            <div class="demonstration-only">
                SFSU Software Engineering Project<br />CSC 648-848, Spring 2025.<br />For Demonstration Only
            </div>
            <Searchbar></Searchbar>
            <router-link to="/postings" class="nav-link">Post</router-link>
            <router-link to="/login" class="nav-link">Login/Signup</router-link>
            <router-link to="/profile" class="nav-link profile-icon-link">
                <img :src="userIcon" alt="Profile" class="nav-profile-icon" />
            </router-link>
        </nav>
    `,
};
