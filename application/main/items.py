import base64
from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
import MySQLdb.cursors

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
            LEFT JOIN Profile p on u.profile_id = p.profile_id
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

        print("Seller rating:", item["rating"])
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
            SELECT * FROM Wishlist 
            WHERE user_id = %s AND item_id = %s
        """, (user_id, item_id))
        wishlist_entry = cursor.fetchone()

        if wishlist_entry:
            # If it exists, remove it
            cursor.execute("""
                DELETE FROM Wishlist 
                WHERE user_id = %s AND item_id = %s
            """, (user_id, item_id))
            mysql.connection.commit()
            return jsonify({"liked": False})

        else:
            # If it doesn't exist, add it
            cursor.execute("""
                INSERT INTO Wishlist (user_id, item_id, created_at)
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
            SELECT * FROM Wishlist 
            WHERE user_id = %s AND item_id = %s
        """, (user_id, item_id))
        wishlist_entry = cursor.fetchone()
        cursor.close()

        return jsonify({"liked": bool(wishlist_entry)})

    @app.route('/api/liked-items', methods=['GET'])
    def get_user_liked_items():
        """
        API endpoint for fetching liked items for the logged-in user.
        
        Returns:
            JSON response with liked items
        """
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Not logged in"}), 401

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        try:
            # Fetch the liked items for the logged-in user
            sql_query = """
                SELECT il.item_id, il.name, il.price, il.image 
                FROM Wishlist w
                JOIN Item_Listing il ON w.item_id = il.item_id
                WHERE w.user_id = %s
            """
            cursor.execute(sql_query, (user_id,))
            results = cursor.fetchall()
            

            processed_results = []
            for item in results:
                processed_item = {
                    "item_id": item['item_id'],
                    "name": item['name'],
                    "price": f"${item['price']:.2f}",
                    "image_base64": None
                }
                
                # Convert image BLOB to base64 if it exists
                if item['image']:
                    try:
                        image_data = base64.b64encode(item['image']).decode('utf-8')
                        processed_item['image_base64'] = f"data:image/jpeg;base64,{image_data}"
                    except Exception as e:
                        print(f"Error converting image to base64: {str(e)}")
                
                processed_results.append(processed_item)
            
            return jsonify(processed_results)
        
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Liked Items API error: {error_details}")
            return jsonify({"error": str(e), "details": error_details}), 500
        
        finally:
            cursor.close()

    @app.route('/api/featured-items', methods=['GET'])
    def get_featured_items():
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        try:
            sql_query = """
                SELECT item_id, name, price, description, image 
                FROM Item_Listing 
                WHERE is_active = 1 
                ORDER BY item_id DESC 
                LIMIT 4
            """
            cursor.execute(sql_query)
            results = cursor.fetchall()
            
            processed_results = []
            for item in results:
                processed_item = {
                    "id": item['item_id'],
                    "name": item['name'],
                    "price": f"{item['price']:.2f}",
                    "description": item['description'],
                    "image_base64": None
                }
                
                # Convert image BLOB to base64 if it exists
                if item['image']:
                    try:
                        image_data = base64.b64encode(item['image']).decode('utf-8')
                        processed_item['image_base64'] = f"data:image/jpeg;base64,{image_data}"
                    except Exception as e:
                        print(f"Error converting image to base64: {str(e)}")
                
                processed_results.append(processed_item)
            
            return jsonify(processed_results)
        
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Featured Items API error: {error_details}")
            return jsonify({"error": str(e), "details": error_details}), 500
        
        finally:
            cursor.close()



    @app.route('/api/user-items', methods=['GET'])
    def get_user_posted_items():
        """
        API endpoint for fetching items posted by the logged-in user.

        Query param:
        - status: 'active' (default) or 'sold'

        Returns:
            JSON response with user's posted items filtered by status.
        """
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Not logged in"}), 401

        status = request.args.get('status', 'active').lower()
        if status == 'sold':
            is_active = 0
        else:
            is_active = 1  # default to active items

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        try:
            sql_query = """
                SELECT il.item_id, il.name, il.price, il.image 
                FROM Item_Listing il
                WHERE il.user_id = %s
                AND il.is_active = %s
            """
            cursor.execute(sql_query, (user_id, is_active))
            results = cursor.fetchall()
            
            processed_results = []
            for item in results:
                processed_item = {
                    "item_id": item['item_id'],
                    "name": item['name'],
                    "price": f"${item['price']:.2f}",
                    "image_base64": None
                }
                
                if item['image']:
                    try:
                        image_data = base64.b64encode(item['image']).decode('utf-8')
                        processed_item['image_base64'] = f"data:image/jpeg;base64,{image_data}"
                    except Exception as e:
                        print(f"Error converting image to base64: {str(e)}")
                
                processed_results.append(processed_item)
            
            return jsonify(processed_results)
        
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"User Items API error: {error_details}")
            return jsonify({"error": str(e), "details": error_details}), 500
        
        finally:
            cursor.close()

    @app.route('/api/user-items/<int:item_id>', methods=['DELETE'])
    def delete_user_item(item_id):
        """
        API endpoint to delete a user's posted item and associated likes in Wishlist.
        """
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Not logged in"}), 401

        cursor = mysql.connection.cursor()
        
        try:
            # Start a transaction
            mysql.connection.begin()

            # Ensure the item belongs to the logged-in user
            delete_item_query = """
                DELETE FROM Item_Listing 
                WHERE item_id = %s AND user_id = %s
            """
            cursor.execute(delete_item_query, (item_id, user_id))
            
            if cursor.rowcount == 0:
                mysql.connection.rollback()
                return jsonify({"error": "Item not found or not owned by user"}), 404
            
            # Delete associated wishlist entries
            delete_wishlist_query = """
                DELETE FROM Wishlist 
                WHERE item_id = %s
            """
            cursor.execute(delete_wishlist_query, (item_id,))
            
            # Commit the transaction
            mysql.connection.commit()
            return jsonify({"success": True, "message": "Item and associated wishlist entries deleted successfully"}), 200
        
        except Exception as e:
            mysql.connection.rollback()
            import traceback
            error_details = traceback.format_exc()
            print(f"Delete Item API error: {error_details}")
            return jsonify({"error": str(e), "details": error_details}), 500
        
        finally:
            cursor.close()

    @app.route('/api/user-items/<int:item_id>/sold', methods=['POST'])
    def mark_item_as_sold(item_id):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Not logged in"}), 401

        cursor = mysql.connection.cursor()
        
        try:
            # Update only if the item belongs to the user
            sql_update = """
                UPDATE Item_Listing
                SET is_active = 0
                WHERE item_id = %s AND user_id = %s
            """
            cursor.execute(sql_update, (item_id, user_id))
            mysql.connection.commit()

            if cursor.rowcount == 0:
                # No rows affected means either item doesn't exist or doesn't belong to user
                return jsonify({"error": "Item not found or you do not have permission to modify this item."}), 404
            
            return jsonify({"message": "Item marked as sold successfully."})
        
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Mark item as sold API error: {error_details}")
            return jsonify({"error": str(e), "details": error_details}), 500
        
        finally:
            cursor.close()
