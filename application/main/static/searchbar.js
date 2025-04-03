const SearchBar = {
    template: `
        <!-- Search Bar and Filters Dropdown in Flexbox -->
            <div class="search-bar-container">
                <!-- Filters Dropdown -->
                <div class="dropdown" :class="{ open: isDropdownVisible }">
                    <button @click="toggleDropdown" class="dropbtn">{{ selectedFilter || "All" }}</button>
                    <div class="dropdown-content">
                        <div v-for="filter in filters" :key="filter" @click="selectFilter(filter)">
                            {{ filter }}
                        </div>
                    </div>
                </div>
                
                <!-- Search Bar -->
                <div class="search-bar">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Search..." 
                        @keyup.enter="submitSearch" 
                    />
                    <button @click="submitSearch">Search</button>
                </div>
            </div>
            `,
    data() {
            return {
                searchQuery: '',
                isDropdownVisible: false,
                selectedFilter: '',
                filters: ['All', 'Books', 'Electronics', 'Furniture']
            };
        },
    methods: {
        toggleDropdown() {
            this.isDropdownVisible = !this.isDropdownVisible;
        },
        selectFilter(filter) {
            this.selectedFilter = filter;
            this.isDropdownVisible = false;
         },
        submitSearch() {
            console.log('Searching for:', this.searchQuery);
            console.log('Selected Filter:', this.selectedFilter);
        }
    }
};

export default SearchBar;