from flask import Flask, render_template, request, jsonify
import os
from main import search #Still having issues when running like this - Alexis
from main import postings #Still having issues when running like this - Alexis

__version__ = "0.1.0" 

app = Flask(__name__)

# Initialize routes from search module
search.init_search_routes(app)

# # Initialize routes from postings module
postings.init_posting_routes(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)