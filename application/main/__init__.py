from flask import Flask, render_template, request, jsonify
import os
from main import search
# from main import postings
from flask_mysqldb import MySQL
from dotenv import load_dotenv
from .signup import signup_bp

__version__ = "0.1.0" 

app = Flask(__name__)

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
# postings.init_posting_routes(app)

# Register the signup blueprint
app.register_blueprint(signup_bp)  

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)