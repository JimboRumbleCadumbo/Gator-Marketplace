export default {
    template: `
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">Home</router-link>
            <search-bar></search-bar>
            <router-link to="/test" class="nav-link">About</router-link>
        </nav>
        <div class="container">
            <div class="about-content">
                <!-- Left Section -->
                <div class="left-section">
                    <div class="profile">
                        <svg class="profile-icon" viewBox="0 0 322 314" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M253.74 284.093C230.954 259.281 197.847 243.667 161 243.667C124.153 243.667 91.0431 259.281 68.2569 284.093M161 313C72.6344 313 1 243.156 1 157C1 70.8436 72.6344 1 161 1C249.366 1 321 70.8436 321 157C321 243.156 249.366 313 161 313ZM161 191.667C131.545 191.667 107.667 168.385 107.667 139.667C107.667 110.948 131.545 87.6667 161 87.6667C190.455 87.6667 214.333 110.948 214.333 139.667C214.333 168.385 190.455 191.667 161 191.667Z" />
                        </svg>
                    </div>
                    
                    <!-- Change the link to your GitHub profile page -->
                    <a href="https://github.com/athanc2" target="_blank">
                        <button class="github-button">GitHub</button>
                    </a>
                    <a href="https://www.linkedin.com/in/athan-cheung-4373bb2a0/" target="_blank">
                        <button class="linkedin-button">Linkedin</button>
                    </a>
                </div>

                <!-- Right Section -->
                <div class="right-section">
                    <div class="name-text">Athan Cheung</div>
                    <div class="about-text">About Me</div>
                    <div class="about-box">
                        <p>Hi! I am a senior at SFSU majoring in Computer Science.</p>
                        <p>During my free time I like to play video games and hangout with friends :&#41;</p>
                    </div>
                </div>
            </div>
        </div>
    `
}