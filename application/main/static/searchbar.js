
export default{
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
