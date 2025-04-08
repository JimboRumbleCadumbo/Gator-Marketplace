from flask import Flask, request, jsonify 
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import MySQLdb.cursors
import os

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
    # Load environment variables
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
                    sql_query += " WHERE name LIKE %s"
                    params = ('%' + query + '%',)
            else:
                # Get category ID from constants
                category_id = CATEGORY_IDS.get(filter_by)
                if category_id is None:
                    return jsonify({"error": "Invalid category"}), 400
                
                sql_query = "SELECT * FROM Item_Listing WHERE category_id = %s"
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
            return jsonify(results)
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()