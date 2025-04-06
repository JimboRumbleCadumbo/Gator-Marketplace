from flask import Flask, render_template, request, jsonify 
from flask_mysqldb import MySQL
import MySQLdb.cursors 

app = Flask(__name__)

# app.jinja_options = {
#     'variable_start_string': '[[',
#     'variable_end_string': ']]',
#     'block_start_string': '{%',
#     'block_end_string': '%}'
# }
# Might have an issue where some pages will use {{}} double curly braces and python won't be able to render it.
# Only works now because the search bar that had that syntax is now a vue component.
# 
# STILL HAVE TO UPDATE THIS PAGE TO LOAD THE VP PAGE!!

app.config['MYSQL_HOST'] = 'team-5-db.crgggaqsqvst.us-west-2.rds.amazonaws.com'
app.config['MYSQL_USER'] = 't5db'
app.config['MYSQL_PASSWORD'] = 'team5!250127'
app.config['MYSQL_DB'] = 'marketplace'

mysql = MySQL(app)

@app.route('/')
def index():
    return render_template('index.html')  # Render the index.html file

# Search API route for Vue to fetch results
@app.route('/api/search', methods=['POST'])
def api_search():
    data = request.get_json()
    query = data.get('query', '')
    filter_by = data.get('filter', '')

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Query based on selected filter
    if filter_by == 'All':
        if query == '':
            cursor.execute("SELECT * FROM Item_Listing")
        else:
            cursor.execute("SELECT * FROM Item_Listing WHERE name LIKE %s", ('%' + query + '%',))
    elif filter_by == 'Electronics':
        if query == '':
            cursor.execute("SELECT * FROM Item_Listing WHERE category_id = 1")
        else:
            cursor.execute("SELECT * FROM Item_Listing WHERE name LIKE %s AND category_id = 1", ('%' + query + '%',))
    elif filter_by == 'Books':
        if query == '':
            cursor.execute("SELECT * FROM Item_Listing WHERE category_id = 2")
        else:
            cursor.execute("SELECT * FROM Item_Listing WHERE name LIKE %s AND category_id = 2", ('%' + query + '%',))
    elif filter_by == 'Clothing':
        if query == '':
            cursor.execute("SELECT * FROM Item_Listing WHERE category_id = 3")
        else:
            cursor.execute("SELECT * FROM Item_Listing WHERE name LIKE %s AND category_id = 3", ('%' + query + '%',))
    elif filter_by == 'Furniture':
        if query == '':
            cursor.execute("SELECT * FROM Item_Listing WHERE category_id = 4")
        else:
            cursor.execute("SELECT * FROM Item_Listing WHERE name LIKE %s AND category_id = 4", ('%' + query + '%',))
    elif filter_by == 'Sports Equipment':
        if query == '':
            cursor.execute("SELECT * FROM Item_Listing WHERE category_id = 5")
        else:
            cursor.execute("SELECT * FROM Item_Listing WHERE name LIKE %s AND category_id = 5", ('%' + query + '%',))
            
    results = cursor.fetchall()
    cursor.close()

    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)