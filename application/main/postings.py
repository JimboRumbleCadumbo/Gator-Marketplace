from flask import Flask, request, jsonify
from flask_mysqldb import MySQL

def init_posting_routes(app):
    mysql = app.config.get('MYSQL_CONNECTION')
    
    @app.route('/api/create-listing', methods=['POST'])
    def create_listing():
        try:
                    
            # Get form data
            item_data = {
                'name': request.form.get('name'),
                'price': request.form.get('price'),
                'quality': request.form.get('condition'),
                'category_id': request.form.get('category'),
                'is_rental': 1 if request.form.get('isRental') == 'true' else 0,
                'description': request.form.get('description'),
                'image_file': request.files.get('image'),
            }

            image_file = request.files['image']
            if image_file.filename == '':
                return jsonify({'success': False, 'error': 'No selected image'}), 400

            image_binary = image_file.read()

            # Database insertion
            cursor = mysql.connection.cursor()
            query = """
            INSERT INTO Item_Listing 
            (name, price, category, quality, rental_option, description, image)
            VALUES (%(name)s, %(price)s, %(category)s, %(quality)s, 
                    %(is_rental)s, %(description)s, %(image)s)
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

