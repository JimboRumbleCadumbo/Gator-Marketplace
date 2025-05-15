/**
 * @file Navbar.js
 * The navigation bar for the app. 
 * Includes a logo, links for posting, login/signup, and a dropdown menu 
 * for logged-in users to access their profile or logout.
 */
import Searchbar from "/static/components/Searchbar.js";

export default {
  components: { Searchbar },
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
  setup() {
    const userName = Vue.ref("");
    const userIcon = Vue.ref("https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123");
    const loggedIn = Vue.ref(false);
    const showDropdown = Vue.ref(false);

    // Initialize Login State (from injected global state)
    const initializeLoginState = () => {
      const loginState = window.__LOGIN_STATE__;
      if (loginState) {
        loggedIn.value = loginState.logged_in;
        userName.value = loginState.user_name || "";
      }
    };

    // Fetch User Data from API
    const fetchUserData = async () => {
      try {
        const sessionResponse = await fetch('/api/session');
        const sessionData = await sessionResponse.json();

        if (sessionData.logged_in) {
          const userId = sessionData.user_id;
          const userResponse = await fetch(`/api/user/${userId}`);
          const userData = await userResponse.json();
          console.log("Session data", userData);

            if (userResponse.ok) {
                userName.value = userData.user_name;
                userIcon.value = userData.user_icon || "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123";
            } else {
                console.error("Failed to fetch user data:", userData.error);
            }
        } else {
          console.error("User is not logged in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Handle Logout
    const handleLogout = async () => {
      try {
        await fetch('/api/logout', { method: 'POST' });
        loggedIn.value = false;
        userName.value = "";
        userIcon.value = "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123";
        alert("Logged out successfully");
        window.location.href = '/';
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    // Toggle Dropdown
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    // Auto-run on component mount
    initializeLoginState();
    fetchUserData();

    return {
        userName,
        userIcon,
        loggedIn,
        showDropdown,
        toggleDropdown,
        handleLogout,
    };
  },
};
