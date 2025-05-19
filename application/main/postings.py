from flask import request, jsonify, session

# Category mapping based on the database values
CATEGORY_MAP = {
    'Electronics': 1,
    'Books': 2,
    'Clothing': 3,
    'Furniture': 4,
    'Sports Equipment': 5
}

def init_posting_routes(app):
    mysql = app.config.get('MYSQL_CONNECTION')
    
    @app.route('/api/create-listing', methods=['POST'])
    def create_listing():
        try:
            # Get category ID from the category name
            category_name = request.form.get('category')
            if category_name not in CATEGORY_MAP:
                return jsonify({
                    'success': False,
                    'error': f'Invalid category: {category_name}. Valid categories are: {", ".join(CATEGORY_MAP.keys())}'
                }), 400
                
            # Database setup connection
            cursor = mysql.connection.cursor()
            
            # Get user ID from the session
            user_id = session.get('user_id')
            if not user_id:
                return jsonify({'success': False, 'error': 'User not logged in'}), 401

            # Within your existing signup route
            cursor.execute("SELECT MAX(item_id) AS max_id FROM Item_Listing")
            result = cursor.fetchone()
            max_item_id = result['max_id'] + 1 if result else 0

            # Get form data
            item_data = {
                'name': request.form.get('name'),
                'price': request.form.get('price'),
                'quality': request.form.get('condition'),
                'category_id': CATEGORY_MAP[category_name],  # Convert category name to ID
                'rental_option': 1 if request.form.get('rentalOption') == 'true' else 0,
                'description': request.form.get('description'),
                'user_id': user_id,
                'item_id': max_item_id
            }

            # Validate required fields
            required_fields = ['name', 'price', 'quality', 'category_id', 'description']
            for field in required_fields:
                if not item_data[field]:
                    return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400

            # Handle image upload
            if 'image' not in request.files:
                return jsonify({'success': False, 'error': 'No image file provided'}), 400

            image_file = request.files['image']
            if image_file.filename == '':
                return jsonify({'success': False, 'error': 'No selected image'}), 400

            image_binary = image_file.read()

            # Database insertion
            query = """
            INSERT INTO Item_Listing 
            (item_id, name, price, category_id, quality, rental_option, description, image, user_id)
            VALUES (%(item_id)s, %(name)s, %(price)s, %(category_id)s, %(quality)s, 
                    %(rental_option)s, %(description)s, %(image)s, %(user_id)s)
            """
            params = {**item_data, 'image': image_binary}
            
            cursor.execute(query, params)
            mysql.connection.commit()
            cursor.close()

            return jsonify({
                'success': True,
                'message': 'Item created successfully',
                'id': cursor.lastrowid
            }), 201

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500

