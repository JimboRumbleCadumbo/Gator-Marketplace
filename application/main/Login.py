from flask import Flask, request, jsonify, session
import mysql.connector
import bcrypt

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a strong secret key

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="your_db_name"
)
cursor = conn.cursor()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # Find user
    cursor.execute("SELECT id, email, password FROM User WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
        session['user_id'] = user[0]  # Save user session
        return jsonify({"message": "Logged in successfully"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
