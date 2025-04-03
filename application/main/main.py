from flask import Flask, render_template

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

@app.route('/')
def index():
    return render_template('home_pagevp.html')  # Render the index.html file

@app.route('/about/alexis')
def about_alexis():
    return render_template('about-alexis.html') # Render the about_alexis.html file

@app.route('/about/david')
def about_david():
    return render_template('about-david.html') # Render the about_alexis.html file

@app.route('/about/jun')
def about_jun():
    return render_template('about-jun.html') # Render the about_alexis.html file

@app.route('/about/yuming')
def about_yuming():
    return render_template('about-yuming.html') # Render the about_alexis.html file

@app.route('/about/athan')
def about_athan():
    return render_template('about-athan.html') # Render the about_alexis.html file

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)