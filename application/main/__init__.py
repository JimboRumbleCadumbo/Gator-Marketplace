from flask import Flask, render_template, session
import os
from main import search
from main import postings
from main import items
from main import auth
from main import messaging
from flask_mysqldb import MySQL
from dotenv import load_dotenv

__version__ = "0.1.0" 

app = Flask(__name__)
app.config['DEBUG'] = True

# Load environment variables
load_dotenv()

# Configure MySQL with connection pool settings
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

# Add connection pool settings to prevent connection timeouts
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['MYSQL_AUTOCOMMIT'] = True
app.config['MYSQL_POOL_NAME'] = 'mypool'
app.config['MYSQL_POOL_SIZE'] = 10

# Initialize MySQL once for the whole application
mysql = MySQL(app)
app.config['MYSQL_CONNECTION'] = mysql

# Initialize routes from search module
search.init_search_routes(app)

# Initialize routes from postings module
postings.init_posting_routes(app)

# Initialize routes from items module
items.init_item_routes(app)

# Set secret key for session management
app.secret_key = os.getenv('FLASK_SESSION_SECRET_KEY')

# Initialize routes from auth module
auth.init_auth_routes(app)

messaging.init_message_routes(app, mysql)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    user_id = session.get('user_id')
    user_name = session.get('user_name', '')
    user_icon = None

    if user_id:
        # Fetch the user_icon from the database
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT user_icon FROM User WHERE user_id = %s", (user_id,))
        result = cursor.fetchone()
        if result and result['user_icon']:
            # Convert the binary blob to a base64 string for rendering in the frontend
            import base64
            # user_icon = f"data:image/png;base64,{base64.b64encode(result['user_icon']).decode('utf-8')}"
            user_icon = f"data:image/svg+xml;base64,{base64.b64encode(result['user_icon']).decode('utf-8')}"
        else:
            # Default icon if no user_icon exists in the database
            user_icon = "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123"  # Replace with your default icon URL

    login_state = {
        "logged_in": bool(user_id),
        "user_name": user_name,
        "user_icon": user_icon or "https://api.dicebear.com/8.x/bottts/svg?seed=CoolUser123"  # Default icon if user_icon not available
    }
    return render_template('index.html', login_state=login_state)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)
