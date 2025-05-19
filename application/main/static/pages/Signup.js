/**
 * @file Signup.js
 * User signup form for creating new accounts.
 * Validates SFSU email and matching passwords before sending signup request.
 */
export default {
    template: `
    <Navbar></Navbar>
    <div class="page-wrapper">
      <div class="container">
        <div id="signup-form">
          <h1>Create Account</h1>
          <form @submit.prevent="handleSignup">

            <label for="signup-username" class="required-label">Username</label>
            <input type="text" id="signup-username" v-model="userName" required/>

            <label for="signup-fullname" class="required-label">Full Name</label>
            <input type="text" id="signup-fullname" v-model="fullName" required/>

            <label for="signup-email" class="required-label">SFSU Email</label>
            <input type="email" id="signup-email" v-model="email" required/>

            <label for="signup-password" class="required-label">Password</label>
            <input type="password" id="signup-password" v-model="password" required/>

            <label for="confirm-password" class="required-label">Confirm Password</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" required/>

            <div class="form-group">
                <input type="checkbox" id="accept-tos" v-model="acceptTOS" required />
                <label for="accept-tos">
                    I accept the <router-link to="/terms" class="tos-link">Terms of Service</router-link>.
                </label>
            </div>

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
        const email = Vue.ref("");
        const password = Vue.ref("");
        const confirmPassword = Vue.ref("");
        const userName = Vue.ref("");
        const fullName = Vue.ref("");

        async function handleSignup() {
            if (
                !email.value.endsWith("@sfsu.edu") &&
                !email.value.endsWith("@mail.sfsu.edu")
            ) {
                alert("Only SFSU email addresses are allowed.");
                return;
            }

            if (password.value !== confirmPassword.value) {
                alert("Passwords do not match.");
                return;
            }

            try {
                const res = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_name: userName.value,
                        full_name: fullName.value,
                        email: email.value,
                        password: password.value,
                        confirmPassword: confirmPassword.value,
                    }),
                });

                const contentType = res.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    if (data.error) {
                        alert(`Signup failed: ${data.error}`);
                    } else {
                        alert("Account created successfully!");
                        window.location.href = "/login";
                    }
                } else {
                    const text = await res.text();
                    console.error("Unexpected response:", text);
                    alert("Unexpected response from server. Check console.");
                }
            } catch (err) {
                console.error("Signup error:", err);
                alert("Something went wrong. Please try again.");
            }
        }

        return {
            email,
            password,
            confirmPassword,
            userName,
            fullName,
            handleSignup,
        };
    },
};
