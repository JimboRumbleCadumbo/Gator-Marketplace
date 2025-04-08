from flask import Flask, render_template
import os
from main import search

__version__ = "0.1.0" 

app = Flask(__name__)

app.jinja_options = {
    'variable_start_string': '[[',
    'variable_end_string': ']]',
    'block_start_string': '{%',
    'block_end_string': '%}'
}

# Initialize routes from search module
search.init_search_routes(app)

@app.route('/about/alexis')
def about_alexis():
    return render_template('about-alexis.html') # Render the about_alexis.html file

@app.route('/about/david')
def about_david():
    return render_template('about-david.html') # Render the about_david.html file

@app.route('/about/jun')
def about_jun():
    return render_template('about-jun.html') # Render the about_jun.html file

@app.route('/about/yuming')
def about_yuming():
    return render_template('about-yuming.html') # Render the about-yuming.html file

@app.route('/about/athan')
def about_athan():
    return render_template('about-athan.html') # Render the about-athan.html file

@app.route('/')
def index():
    return render_template('home_pagevp.html')  # Render the index.html file

@app.route('/test/search-test')
def search_test():
    return render_template('search-test.html')  # Render the search_test.html file


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)