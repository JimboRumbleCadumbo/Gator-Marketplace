export default {
  template: `
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
}
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", (e) => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("confirm-password").value;

    if (!email.endsWith("@sfsu.edu")) {
      e.preventDefault();
      alert("Only @sfsu.edu email addresses are allowed.");
      return;
    }

    if (password !== confirm) {
      e.preventDefault();
      alert("Passwords do not match.");
    }
  });

  // Toggle to Login Form
  document.querySelectorAll('.toggle-link[data-target="login"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("signup-form").classList.add("hidden");
      document.getElementById("login-form").classList.remove("hidden");
    });
  });
});
