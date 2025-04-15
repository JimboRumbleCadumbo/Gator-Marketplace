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
  