export default {
  template: `
    <div id="login-form">
      <h1>SFSU Login</h1>
      <form @submit.prevent="handleLogin">
        <label for="login-email">SFSU Email</label>
        <input type="email" id="login-email" v-model="email" required />

        <label for="login-password">Password</label>
        <input type="password" id="login-password" v-model="password" required />

        <button type="submit">Login</button>

        <p class="toggle-link">
          <router-link to="/signup">Don't have an account? Sign up</router-link>
        </p>
      </form>
    </div>
  `,
  setup() {
    const email = Vue.ref('');
    const password = Vue.ref('');

    function handleLogin() {
      if (!email.value.endsWith('@sfsu.edu')) {
        alert('Please use your @sfsu.edu email address.');
        return;
      }

      // TODO: Replace with actual login API request
      console.log('Logging in with', email.value, password.value);
    }

    return {
      email,
      password,
      handleLogin
    };
  }
};
