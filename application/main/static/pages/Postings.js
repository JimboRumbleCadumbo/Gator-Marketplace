export default {
    template: `
        <div class="postings-container">
            <h1>Create New Item Listing</h1>
            
            <form @submit.prevent="submitForm" class="posting-form">
                <div class="form-group">
                    <label for="itemName">Item Name</label>
                    <input 
                        type="text" 
                        id="itemName" 
                        v-model="itemData.name" 
                        required 
                        placeholder="Enter item name"
                    />
                </div>
                
                <div class="form-group">
                    <label for="itemPrice">Price ($)</label>
                    <input 
                        type="number" 
                        id="itemPrice" 
                        v-model="itemData.price" 
                        required 
                        min="0" 
                        step="0.01" 
                        placeholder="Enter price"
                    />
                </div>
                
                <div class="form-group">
                    <label for="itemDescription">Description</label>
                    <textarea 
                        id="itemDescription" 
                        v-model="itemData.description" 
                        required 
                        placeholder="Describe your item"
                        rows="4"
                    ></textarea>
                </div>
                
                <div class="form-group">
                    <label for="itemCondition">Condition</label>
                    <select id="itemCondition" v-model="itemData.condition" required>
                        <option value="" disabled selected>Select condition</option>
                        <option value="NW">New (NW)</option>
                        <option value="NM">Near Mint (NM)</option>
                        <option value="MU">Medium Used (MU)</option>
                        <option value="UD">Used Daily (UD)</option>
                        <option value="DM">Damaged (DM)</option>
                    </select>
                </div>
                
                <div class="form-group checkbox-group">
                    <input 
                        type="checkbox" 
                        id="isRental" 
                        v-model="itemData.isRental"
                    />
                    <label for="isRental">This item is available for rental</label>
                </div>
                
                <div class="form-group">
                    <label for="itemImage">Item Image</label>
                    <input 
                        type="file" 
                        id="itemImage" 
                        @change="handleImageUpload" 
                        accept="image/*"
                    />
                    <div v-if="imagePreview" class="image-preview">
                        <img :src="imagePreview" alt="Preview" />
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Create Listing</button>
                    <button type="button" @click="resetForm" class="reset-btn">Reset</button>
                </div>
            </form>
        </div>
    `,
    setup() {
        const itemData = Vue.ref({
            name: '',
            price: '',
            description: '',
            condition: '',
            isRental: false,
            image: null
        });
        
        const imagePreview = Vue.ref(null);
        
        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                itemData.value.image = file;
                
                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
        
        function submitForm() {
            // Here you would typically send the data to your backend
            console.log('Submitting form with data:', itemData.value);
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', itemData.value.name);
            formData.append('price', itemData.value.price);
            formData.append('description', itemData.value.description);
            formData.append('condition', itemData.value.condition);
            formData.append('isRental', itemData.value.isRental);
            
            if (itemData.value.image) {
                formData.append('image', itemData.value.image);
            }
            
            // Example API call (you'll need to implement this endpoint)
            fetch('/api/create-listing', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create listing');
                }
                return response.json();
            })
            .then(data => {
                console.log('Listing created successfully:', data);
                alert('Item listing created successfully!');
                resetForm();
            })
            .catch(error => {
                console.error('Error creating listing:', error);
                alert('Failed to create listing: ' + error.message);
            });
        }
        
        function resetForm() {
            itemData.value = {
                name: '',
                price: '',
                description: '',
                condition: '',
                isRental: false,
                image: null
            };
            imagePreview.value = null;
        }
        
        return {
            itemData,
            imagePreview,
            handleImageUpload,
            submitForm,
            resetForm
        };
    }
}; 