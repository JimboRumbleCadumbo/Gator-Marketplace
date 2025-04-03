from flask import Flask, render_template
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('indextest.html')  # Render the index.html file

# Load member data from the JSON file
def load_member_data():
    with open('members.json') as members_file:
        return json.load(members_file)

@app.route('/about/<member>')
def about_member(member):
    # Load all members' data
    members_data = load_member_data()
    
    # Check if the member exists in the data
    if member in members_data:
        # Pass the member's data to the template
        return render_template(f'about-{member}.html', member_data=members_data[member])
    else:
        # If the member is not found, return a 404 page
        return "Member not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Default Flask server (not for production)
