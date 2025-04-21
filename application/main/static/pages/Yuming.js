export default {
    template: `
        <Navbar></Navbar>
        <div class="container">
            <div class="about-content">
                <!-- Left Section -->
                <div class="left-section">
                    <div class="profile">
                        <img class="profile-icon" src="/static/picture/yuming_profile.jpg" alt="Profile Image">
                    </div>

                    <!-- Change the link to your GitHub profile page -->
                    <a href="https://github.com/JimboRumbleCadumbo" target="_blank">
                        <button class="github-button">GitHub</button>
                    </a>
                    <a href="https://www.linkedin.com/in/yu-ming-jim-chen/" target="_blank">
                        <button class="linkedin-button">Linkedin</button>
                    </a>
                </div>

                <!-- Right Section -->
                <div class="right-section">
                    <div class="name-text">Yu-Ming Chen (Jim)</div>
                    <div class="about-text">About Me</div>
                    <div class="about-box">
                        <ul>
                            <li>Junior studying Computer Science in SFSU.</li>
                            <li>Hobbies: Pool/Billiard, rhythm games, cooking, Rubik’s Cube</li>
                            <li>Favorite music genre: anything from the 80's ~ 2000's, but not a picky listener</li>
                            <li>Favorite food: Ramen</li>
                            <li>Favorite month: September</li>
                        </ul>
                        
                    </div>
                </div>
            </div>
        </div>
        
        <footer class="footer">
            <p>&copy; 2025 CSC 648 Team 05. All rights reserved.</p>
            <router-link to="/about" class="footer-link">About</router-link>
        </footer>
    `
}