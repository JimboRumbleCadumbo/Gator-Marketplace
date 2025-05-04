from flask import Blueprint, request, jsonify, current_app
import bcrypt

signup_bp = Blueprint('signup', __name__)

@signup_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    confirm_password = data.get('confirmPassword')

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields."}), 400

    if not email.endswith("@sfsu.edu"):
        return jsonify({"error": "Only @sfsu.edu emails are allowed."}), 400

    if confirm_password and password != confirm_password:
        return jsonify({"error": "Passwords do not match."}), 400

    try:
        mysql = current_app.config['MYSQL_CONNECTION']
        cursor = mysql.connection.cursor()

        cursor.execute("SELECT id FROM User WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already exists."}), 409

        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor.execute(
            "INSERT INTO User (email, password, name, role) VALUES (%s, %s, %s, %s)",
            (email, hashed_pw, name, 'student')
        )
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Account created successfully!"}), 201

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500
