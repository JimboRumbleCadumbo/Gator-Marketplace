export default {
  template: `
    <Navbar></Navbar>
    <div class="page-wrapper">
        <div class="container">
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

    function handleLogin() {
      if (!email.value.endsWith('@sfsu.edu') && !email.value.endsWith('@mail.sfsu.edu')) {
        alert('Please use your @sfsu.edu or @mail.sfsu.edu email address.');
        return;
      }
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.error || 'Failed to log in');
            });
          }
          return response.json();
        })
        .then((data) => {
          alert('Login successful');
          console.log('User:', data.user);
          // Redirect to dashboard
          window.location.href = '/dashboard';
        })
        .catch((error) => {
          console.error('Login error:', error);
          alert('Login failed: ' + error.message);
        });

        //Google Analytics login event
          if (typeof gtag === 'function') {
            gtag('event', 'login', {
            method: 'email'
            });
          }
    }

    return {
      email,
      password,
      handleLogin,
    };
  }
};
