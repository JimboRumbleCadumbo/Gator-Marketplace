const SearchBar = {
    template: `
        <div class="search-bar-container">
            <!-- Filters Dropdown -->
            <div class="dropdown" :class="{ open: isDropdownVisible }">
                <button @click="toggleDropdown" class="dropbtn">{{ selectedFilter || "All" }}</button>
                <div class="dropdown-content" v-if="isDropdownVisible">
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

            <!-- Results (optional) -->
            <div class="search-results" v-if="results.length > 0">
                <div v-for="result in results" :key="result.id">
                    {{ result.name || result.title }} <!-- adjust based on DB schema -->
                </div>
            </div>
        </div>
    `,
    data() {
            return {
                searchQuery: '',
                isDropdownVisible: false,
                selectedFilter: '',
                filters: ['All','Books', 'Electronics', 'Furniture'],
                results: []
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
            if (!this.searchQuery) return;
            
            fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: this.searchQuery,
                    filter: this.selectedFilter
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Search results:', data);
                this.results = data;
            })
            .catch(error => console.error('Search error:', error));
        }
    }
};

export default SearchBar;