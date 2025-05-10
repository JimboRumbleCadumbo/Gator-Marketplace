import base64
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL

def init_item_routes(app):
    mysql = app.config.get('MYSQL_CONNECTION')

    @app.route('/api/item', methods=['GET'])
    def get_item():
        """
        API endpoint to fetch item details by ID.
        """
        item_id = request.args.get('id')
        if not item_id:
            return jsonify({"error": "Item ID is required"}), 400

        cursor = mysql.connection.cursor()
        # Join Item_Listing with Category to get the category_name
        cursor.execute("""
            SELECT il.*, c.category_name, u.user_name, p.rating
            FROM Item_Listing il
            LEFT JOIN Category c ON il.category_id = c.category_id
            LEFT JOIN User u on il.user_id = u.user_id
            LEFT JOIN Profile p on u.user_id = p.profile_id
            WHERE il.item_id = %s
        """, (item_id,))
        item = cursor.fetchone()

        if not item:
            return jsonify({"error": "Item not found"}), 404

        # Convert the image field to Base64 if it exists
        image_base64 = None
        if item["image"]:
            try:
                image_base64 = base64.b64encode(item["image"]).decode('utf-8')
            except Exception as e:
                print(f"Error encoding image: {e}")
                image_base64 = None

        # Map the database result to a dictionary
        item_data = {
            "item_id": item["item_id"],
            "name": item["name"],
            "description": item["description"],
            "price": float(item["price"]),
            "quality": item["quality"],
            "rental_option": bool(item["rental_option"]),
            "created_at": item["created_at"],
            "updated_at": item["updated_at"],
            "is_active": bool(item["is_active"]),
            "seller_id": item["user_id"],
            "seller_rating": item["rating"],
            "seller_name": item["user_name"], 
            "category_name": item["category_name"],
            "image": image_base64,
        }

        return jsonify(item_data)
    
    @app.route('/api/wishlist/toggle', methods=['POST'])
    def toggle_wishlist():
        data = request.get_json()
        user_id = data.get('user_id')
        item_id = data.get('item_id')

        if not user_id or not item_id:
            return jsonify({"error": "Invalid user or item ID"}), 400

        cursor = mysql.connection.cursor()

        # Check if the item is already in the wishlist
        cursor.execute("""
            SELECT * FROM wishlist 
            WHERE user_id = %s AND item_id = %s
        """, (user_id, item_id))
        wishlist_entry = cursor.fetchone()

        if wishlist_entry:
            # If it exists, remove it
            cursor.execute("""
                DELETE FROM wishlist 
                WHERE user_id = %s AND item_id = %s
            """, (user_id, item_id))
            mysql.connection.commit()
            return jsonify({"liked": False})

        else:
            # If it doesn't exist, add it
            cursor.execute("""
                INSERT INTO wishlist (user_id, item_id, created_at)
                VALUES (%s, %s, NOW())
            """, (user_id, item_id))
            mysql.connection.commit()
            return jsonify({"liked": True})
        

    @app.route('/api/wishlist/check', methods=['GET'])
    def check_wishlist():
        user_id = request.args.get('user_id')
        item_id = request.args.get('item_id')

        if not user_id or not item_id:
            return jsonify({"error": "Invalid user or item ID"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT * FROM wishlist 
            WHERE user_id = %s AND item_id = %s
        """, (user_id, item_id))
        wishlist_entry = cursor.fetchone()
        cursor.close()

        return jsonify({"liked": bool(wishlist_entry)})
