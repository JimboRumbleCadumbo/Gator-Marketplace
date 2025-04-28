from flask import Flask, request, jsonify
import mysql.connector 
import bcrypt

app = Flask(__name__)

# Connect to your local database
conn = mysql.connector.connect(
    host="team-5-db.crgggaqsqvst.us-west-2.rds.amazonaws.com",
    user="t5db",
    password="team5!250127",
    database="marketplace"
)
cursor = conn.cursor()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if email already exists
    cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({"error": "Email already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert new user
    cursor.execute(
        "INSERT INTO User (email, password, name) VALUES (%s, %s, %s)",
        (email, hashed_password, name)
    )
    conn.commit()

    return jsonify({"message": "User created successfully"}), 201

if __name__ == "__main__":
    app.run(debug=True)
