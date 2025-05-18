from flask import Flask, request, jsonify 
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import MySQLdb.cursors
import os
import base64

# Category constants for better readability and maintainability
CATEGORY_IDS = {
    'Electronics': 1,
    'Books': 2,
    'Clothing': 3,
    'Furniture': 4,
    'Sports Equipment': 5
}

def init_search_routes(app):
    """
    Initialize search routes and MySQL configuration for the Flask application.
    
    Args:
        app: Flask application instance
    """
    # Get the shared MySQL connection
    mysql = app.config.get('MYSQL_CONNECTION')
    if not mysql:
        # Fallback if shared connection is not available
        load_dotenv()
        
        # Configure MySQL connection
        app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
        app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
        app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
        app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

        mysql = MySQL(app)

    @app.route('/api/search', methods=['POST'])
    def api_search():
        """
        API endpoint for searching items with optional filtering by category.
        
        Returns:
            JSON response with search results
        """
        data = request.get_json()
        query = data.get('query', '')
        filter_by = data.get('filter', '')

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        try:
            # Build the SQL query based on filter
            if filter_by == 'All':
                sql_query = "SELECT * FROM Item_Listing"
                params = None
                
                if query:
                    sql_query += " WHERE name LIKE %s AND is_active = 1"
                    params = ('%' + query + '%',)
            else:
                # Get category ID from constants
                category_id = CATEGORY_IDS.get(filter_by)
                if category_id is None:
                    return jsonify({"error": "Invalid category"}), 400
                
                sql_query = "SELECT * FROM Item_Listing WHERE category_id = %s AND is_active = 1"
                params = (category_id,)
                
                if query:
                    sql_query += " AND name LIKE %s"
                    params = (category_id, '%' + query + '%')
            
            # Execute query with or without parameters
            if params:
                cursor.execute(sql_query, params)
            else:
                cursor.execute(sql_query)
                
            results = cursor.fetchall()
            
            # Process the results to convert BLOB images to base64
            processed_results = []
            for item in results:
                # Create a new dictionary with the same keys but without the BLOB data
                processed_item = {}
                for key, value in item.items():
                    if key == 'image' and value:
                        try:
                            # Convert BLOB to base64 string
                            image_data = base64.b64encode(value).decode('utf-8')
                            # Add data URI prefix for direct use in img src
                            processed_item['image_base64'] = f"data:image/jpeg;base64,{image_data}"
                        except Exception as e:
                            print(f"Error converting image to base64: {str(e)}")
                            processed_item['image_base64'] = None
                    else:
                        processed_item[key] = value
                
                processed_results.append(processed_item)
            
            return jsonify(processed_results)
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Search API error: {error_details}")
            return jsonify({"error": str(e), "details": error_details}), 500
        finally:
            cursor.close()