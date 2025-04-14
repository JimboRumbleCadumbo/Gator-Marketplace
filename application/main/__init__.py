from flask import Flask, render_template, request, jsonify
import os
from main import search
from main import postings

__version__ = "0.1.0" 

app = Flask(__name__)

# Initialize routes from search module
search.init_search_routes(app)

# Initialize routes from postings module
postings.init_posting_routes(app)

@app.route('/')
def index():
    return render_template('index.html')  # Render the index.html file

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)