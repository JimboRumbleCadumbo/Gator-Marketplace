export default {
  template: `
    <Navbar></Navbar>
    <div id="signup-form">
      <h1>Create Account</h1>
      <form @submit.prevent="handleSignup">
        <label for="signup-email">SFSU Email</label>
        <input type="email" id="signup-email" v-model="email" required />

        <label for="signup-password">Password</label>
        <input type="password" id="signup-password" v-model="password" required />

        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" required />

        <button type="submit">Sign Up</button>

        <p class="toggle-link">
          <router-link to="/login">Already have an account? Log in</router-link>
        </p>
      </form>
    </div>
  `,
  setup() {
    const email = Vue.ref('');
    const password = Vue.ref('');
    const confirmPassword = Vue.ref('');

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
      handleSignup
    };
  }
};
