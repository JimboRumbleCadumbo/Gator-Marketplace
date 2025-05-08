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
            LEFT JOIN User u on il.seller_id = u.user_id
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
            "seller_id": item["seller_id"],
            "seller_rating": item["rating"],
            "seller_name": item["user_name"],  # Assuming the seller's name is in the same row
            "category_name": item["category_name"],
            "image": image_base64,
        }

        return jsonify(item_data)
