export default {
    template: `
        <Navbar></Navbar>
        <div class="page-wrapper">
            <div class="container">
                <div id="signup-form">
                <h1>Create Account</h1>
                    <form @submit.prevent="handleSignup">

                        <label for="signup-display-name" class="required-label">Display Name</label>
                        <input type="text" id="signup-display-name" v-model="displayName" required/>

                        <label for="signup-email" class="required-label">SFSU Email</label>
                        <input type="email" id="signup-email" v-model="email" required/>

                        <label for="signup-password" class="required-label">Password</label>
                        <input type="password" id="signup-password" v-model="password" required/>

                        <label for="confirm-password" class="required-label">Confirm Password</label>
                        <input type="password" id="confirm-password" v-model="confirmPassword" required/>

                        <button type="submit">Sign Up</button>

                        <p class="toggle-link">
                        <router-link to="/login">Already have an account? Log in</router-link>
                        </p>
                    </form>
                </div>
            </div>

        <footer class="footer">
            <p>&copy; 2025 CSC 648 Team 05. All rights reserved.</p>
            <router-link to="/about" class="footer-link">About</router-link>
        </footer>
    </div>
  `,
  setup() {
    const email = Vue.ref('');
    const password = Vue.ref('');
    const confirmPassword = Vue.ref('');
    const displayName = Vue.ref('');

    function handleSignup() {
      if (!email.value.endsWith('@sfsu.edu')) {
        alert('Only SFSU email addresses are allowed.');
        return;
      }

      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match.');
        return;
      }

      // TODO: Replace with actual signup API request
      console.log('Signing up with', email.value);
    }

    return {
      email,
      password,
      confirmPassword,
      displayName,
      handleSignup
    };
  }
};
