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
}
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", (e) => {
    const email = document.getElementById("login-email").value;
    if (!email.endsWith("@sfsu.edu")) {
      e.preventDefault();
      alert("Please use your @sfsu.edu email to log in.");
    }
  });

  // Toggle to Signup Form
  document
    .querySelectorAll('.toggle-link[data-target="signup"]')
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("signup-form").classList.remove("hidden");
      });
    });
});
