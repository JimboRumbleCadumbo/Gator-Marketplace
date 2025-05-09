import Searchbar from "/static/components/Searchbar.js";

export default {
  components: { Searchbar },
  data() {
    return {
      userIcon: "",
      loggedIn: false,
      userName: "",
      showDropdown: false,
    };
  },
  methods: {
    initializeLoginState() {
      const loginState = window.__LOGIN_STATE__; // Injected by the backend
      if (loginState) {
        this.loggedIn = loginState.logged_in;
        this.userName = loginState.user_name || "";
        this.userIcon = loginState.user_icon; // Use the user_icon provided by the backend
      }
    },
    handleLogout() {
      fetch('/api/logout', { method: 'POST' })
        .then(() => {
          this.loggedIn = false;
          this.userName = "";
          this.userIcon = "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123"; // Reset to default icon
          alert("Logged out successfully");
          window.location.href = '/';
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
  },
  mounted() {
    this.initializeLoginState();
  },
  template: `
    <nav class="nav-bar">
        <div class="nav-left">
            <router-link to="/" class="nav-link">Gator Savvy</router-link>
            <div class="demonstration-only">
            SFSU Software Engineering Project<br />
            CSC 648-848, Spring 2025.<br />
            For Demonstration Only
            </div>
        </div>

        <div class="nav-center">
            <Searchbar></Searchbar>
        </div>

        <div class="nav-right">
            <router-link v-if="loggedIn" to="/postings" class="nav-link">Post</router-link>
            <router-link v-if="!loggedIn" to="/login" class="nav-link">Login/Signup</router-link>

            <div v-if="loggedIn" class="nav-link dropdown" @click="toggleDropdown">
                <span class="dropdown-label">Welcome, {{ userName }}</span>
                <img :src="userIcon" alt="Profile" class="nav-profile-icon" />
                <div v-if="showDropdown" class="dropdown-menu">
                    <router-link to="/profile" class="dropdown-item">Profile</router-link>
                    <button @click.stop="handleLogout" class="dropdown-item">Logout</button>
                </div>
            </div>
        </div>
    </nav>
  `,
};
