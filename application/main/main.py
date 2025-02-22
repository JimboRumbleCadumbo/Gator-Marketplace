from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('pages/index.html')  # Render the index.html file

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)