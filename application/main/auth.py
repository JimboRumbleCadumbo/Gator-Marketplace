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
    
    
    @app.route('/api/user/<int:user_id>', methods=['GET'])
    def get_user_info(user_id):
        """
        API endpoint to fetch user information by user_id.
        """
        mysql = app.config.get('MYSQL_CONNECTION')
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT 
                u.user_id, 
                u.user_name, 
                u.email, 
                DATE_FORMAT(u.created_at, '%%M %%d %%Y') AS formatted_date,
                p.rating 
            FROM 
                User u 
            JOIN 
                Profile p ON u.profile_id = p.profile_id 
            WHERE 
                u.user_id = %s
        """, (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "user_id": user['user_id'],
            "user_name": user['user_name'],
            "email": user['email'],
            "joined_date": user['formatted_date'],
            # "description": user['description'],
            "rating": user['rating'] 
        })
