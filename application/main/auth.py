from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
import bcrypt
from functools import wraps

def init_auth_routes(app):
    mysql = app.config.get('MYSQL_CONNECTION')

    @app.route('/api/login', methods=['POST'])
    def login():
        """
        API endpoint for user login.
        """
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Verify the password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({"error": "Invalid email or password"}), 401

        # Store user information in the session
        session['user_id'] = user['user_id']
        session['user_name'] = user['user_name']

        return jsonify({"message": "Login successful", "user": {
            "user_id": user['user_id'],
            "user_name": user['user_name'],
            "email": user['email'],
        }})

    @app.route('/api/signup', methods=['POST'])
    def signup():
        """
        API endpoint for user signup.
        """
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')
        name = data.get('name')

        if not email or not password or not name:
            return jsonify({"error": "All fields are required"}), 400

        if not (email.endswith("@sfsu.edu") or email.endswith("@mail.sfsu.edu")):
            return jsonify({"error": "Must use an @sfsu.edu or @mail.sfsu.edu email"}), 400

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        cursor = mysql.connection.cursor()

        # Check if user already exists
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already exists"}), 409

        # Hash the password
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insert new user
        cursor.execute(
            "INSERT INTO User (email, password_hash, user_name) VALUES (%s, %s, %s)",
            (email, hashed_pw, name)
        )
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Account created successfully"}), 201

    @app.route('/api/logout', methods=['POST'])
    def logout():
        """
        API endpoint for user logout.
        """
        session.clear()
        return jsonify({"message": "Logout successful"})

    @app.route('/api/session', methods=['GET'])
    def check_session():
        """
        API endpoint to check if the user is logged in.
        """
        user_id = session.get('user_id')
        if user_id:
            return jsonify({
                "logged_in": True,
                "user_id": user_id,
                "user_name": session.get('user_name'),
            })
        return jsonify({"logged_in": False})
