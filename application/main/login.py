from flask import Blueprint, request, jsonify, session, current_app
import bcrypt

# for tracking logged in users
login_bp = Blueprint('login', __name__)
SESSION_KEY = 'user_id'

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    try:
        mysql = current_app.config['MYSQL_CONNECTION']
        cursor = mysql.connection.cursor()

        cursor.execute("SELECT id, email, password FROM User WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session[SESSION_KEY] = user['id']
            return jsonify({"message": "Logged in successfully"}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@login_bp.route('/logout', methods=['POST'])
def logout():
    session.pop(SESSION_KEY, None)
    return jsonify({"message": "Logged out successfully"}), 200
