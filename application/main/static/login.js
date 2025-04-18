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
f