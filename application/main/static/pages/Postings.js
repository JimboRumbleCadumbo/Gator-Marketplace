export default {
    template: `
    <Navbar></Navbar>
        <div class="postings-container">
            <h1>Create New Item Listing</h1>
            
            <form @submit.prevent="submitForm" class="posting-form">
                <div class="form-group">
                    <label for="itemName" class="required-label">Item Name</label>
                    <input 
                        type="text" 
                        id="itemName" 
                        v-model="itemData.name" 
                        required 
                        placeholder="Enter item name"
                    />
                </div>
                
                <div class="form-group">
                    <label for="itemPrice" class="required-label">Price ($)</label>
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
                <label for="itemCondition" class="required-label">Condition</label>
                <select id="itemCondition" v-model="itemData.condition" required>
                    <option value="" disabled selected>Select condition</option>
                    <option value="NW">New (NW)</option>
                    <option value="NM">Near Mint (NM)</option>
                    <option value="MU">Medium Used (MU)</option>
                    <option value="UD">Used Daily (UD)</option>
                    <option value="DM">Damaged (DM)</option>
                </select>
                </div>
                
                <div class="form-group">
                <label for="itemCategory" class="required-label">Category</label>
                <select id="itemCategory" v-model="itemData.category" required>
                    <option value="" disabled selected>Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Sports Equipment">Sports Equipment</option>
                </select>
                </div>
                
                <div class="form-group checkbox-group">
                <input 
                type="checkbox" 
                id="rentalOption" 
                v-model="itemData.rentalOption"
                />
                <label for="rentalOption">This item is available for rental</label>
                </div>
                
                <div class="form-group">
                    <label for="UploadItem" class="required-label">Item Image</label>
                    <label for="itemImage" class="custom-file-upload">
                        <div class="upload-placeholder" v-if="!imagePreview">
                            Click to upload
                        </div>
                        <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="preview-img" />
                    </label>
                    <input 
                    type="file" 
                    id="itemImage" 
                    @change="handleImageUpload" 
                    accept="image/*"
                    style="display: none;"
                    />
                
                <div class="form-group">
                    <label for="itemDescription">Description</label>
                    <textarea 
                        id="itemDescription" 
                        v-model="itemData.description" 
                        required 
                        placeholder="Describe your item. (*If choose mail, please specify your mailing method)"
                        rows="4"
                    ></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" @click="resetForm" class="reset-btn">Reset</button>
                    <button type="submit" class="submit-btn">Create Listing</button>
                </div>
            </form>
        </div>

        <footer class="footer">
            <p>&copy; 2025 CSC 648 Team 05. All rights reserved.</p>
            <router-link to="/about" class="footer-link">About</router-link>
        </footer>
    `,
    setup() {
        const itemData = Vue.ref({
            name: '',
            price: '',
            description: '',
            condition: '',
            category: '',
            rentalOption: false,
            image: null
        });
        
        const imagePreview = Vue.ref(null);

        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                  imagePreview.value = reader.result;
                };
                reader.readAsDataURL(file);
              }
        }

        function submitForm() {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', itemData.value.name);
            formData.append('price', itemData.value.price);
            formData.append('description', itemData.value.description);
            formData.append('condition', itemData.value.condition);
            formData.append('category', itemData.value.category);
            formData.append('rentalOption', itemData.value.rentalOption);

            if (itemData.value.image) {
                formData.append('image', itemData.value.image);
            }

            // Send the request to the backend
            fetch('/api/create-listing', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || 'Failed to create listing');
                    });
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
                location: '',
                rentalOption: false,
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