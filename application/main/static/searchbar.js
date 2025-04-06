
export default{
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
            setup() {
                const searchData = Vue.inject('searchData'); 
                const searchQuery = Vue.ref('');
                const selectedFilter = Vue.ref('');
                const isDropdownVisible = Vue.ref(false);
            
                function submitSearch() {
                    fetch('/api/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: searchQuery.value,
                            filter: selectedFilter.value || 'All'
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        searchData.results = data;
                        console.log(searchData) // Update global state
                    });
                }
            
                return {
                    searchQuery,
                    selectedFilter,
                    isDropdownVisible,
                    filters: ['All', 'Electronics', 'Books', 'Clothing', 'Furniture', 'Sports Equipment'],
                    submitSearch,
                    toggleDropdown() {
                        isDropdownVisible.value = !isDropdownVisible.value;
                    },
                    selectFilter(filter) {
                        selectedFilter.value = filter;
                        isDropdownVisible.value = false;
                    }
                };
            }
};
