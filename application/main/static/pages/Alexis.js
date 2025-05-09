/**
 * @file Alexis.js
 * Alexis's about page. Displays a profile section with an icon, GitHub link, and a short bio. 
 * Located in about.
 */
export default {
    template: `
        <Navbar></Navbar>
        <div class="page-wrapper">
            <div class="container">
                <div class="about-content">
                    <!-- Left Section -->
                    <div class="left-section">
                        <div class="profile">
                            <svg class="profile-icon" viewBox="0 0 322 314" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M253.74 284.093C230.954 259.281 197.847 243.667 161 243.667C124.153 243.667 91.0431 259.281 68.2569 284.093M161 313C72.6344 313 1 243.156 1 157C1 70.8436 72.6344 1 161 1C249.366 1 321 70.8436 321 157C321 243.156 249.366 313 161 313ZM161 191.667C131.545 191.667 107.667 168.385 107.667 139.667C107.667 110.948 131.545 87.6667 161 87.6667C190.455 87.6667 214.333 110.948 214.333 139.667C214.333 168.385 190.455 191.667 161 191.667Z" />
                            </svg>
                        </div>
                        <a href="https://github.com/Alexis283" target="_blank">
                            <button class="github-button">GitHub</button>
                        </a>
                    </div>

                    <!-- Right Section -->
                    <div class="right-section">
                        <div class="name-text">Alexis Perez</div>
                        <div class="about-text">About Me</div>
                        <div class="about-box">
                            <p>Hello, my name is Alexis Perez. I am a senior at SFSU majoring in Computer Science planning to graduate in Fall 2025. I have a strong interest in web development,
                                software development, and game development, and I hope to build a career in these areas. I look forward to collaborating with teams 
                                to enhance my communication skills and strengthen my technological expertise.
                            </p>
                            <p>Outside of school I really enjoy video games and I love food!</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer class="footer">
                <p>&copy; 2025 CSC 648 Team 05. All rights reserved.</p>
                <router-link to="/about" class="footer-link">About</router-link>
            </footer>
        </div>
    `,
};
