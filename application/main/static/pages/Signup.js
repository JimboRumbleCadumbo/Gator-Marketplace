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
      if (
        !email.value.endsWith('@sfsu.edu') &&
        !email.value.endsWith('@mail.sfsu.edu')
      ) {
        alert('Only SFSU email addresses are allowed.');
        return;
      }
    
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match.');
        return;
      }
    
      fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName.value,
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
        })
      })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.error) {
            alert(`Signup failed: ${data.error}`);
          } else {
            alert('Account created successfully!');
            window.location.href = '/login';
          }
        } else {
          const text = await res.text();
          console.error("Unexpected response:", text);
          alert("Unexpected response from server. Check console.");
        }
      })
      .catch((err) => {
        console.error('Signup error:', err);
        alert('Something went wrong. Please try again.');
      });      
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
