from flask import request, jsonify, session
import bcrypt
import base64
from MySQLdb.cursors import DictCursor

def init_auth_routes(app):
    mysql = app.config.get('MYSQL_CONNECTION')

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        cursor = mysql.connection.cursor(DictCursor)
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Convert user icon to Base64 and store in session
        user_icon_base64 = None
        if user['user_icon']:
            import base64
            user_icon_base64 = f"data:image/svg+xml;base64,{base64.b64encode(user['user_icon']).decode('utf-8')}"

        session['user_id'] = user['user_id']
        session['user_name'] = user['user_name']
        session['user_icon'] = user_icon_base64

        return jsonify({
            "message": "Login successful",
            "user": {
                "user_id": user['user_id'],
                "user_name": user['user_name'],
                "email": user['email'],
            }
        })

    @app.route('/api/signup', methods=['POST'])
    def signup():
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            full_name = data.get('full_name')
            user_name = data.get('user_name')

            if not email or not password or not full_name or not user_name:
                return jsonify({"error": "All fields are required"}), 400

            if not (email.endswith("@sfsu.edu") or email.endswith("@mail.sfsu.edu")):
                return jsonify({"error": "Must use an @sfsu.edu or @mail.sfsu.edu email"}), 400

            if password != confirm_password:
                return jsonify({"error": "Passwords do not match"}), 400

            cursor = mysql.connection.cursor()

            # Check for duplicates
            cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({"error": "Email already exists"}), 409

            cursor.execute("SELECT * FROM User WHERE user_name = %s", (user_name,))
            if cursor.fetchone():
                return jsonify({"error": "Username already taken"}), 409

            # Hash and insert
            hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute(
                "INSERT INTO User (email, password_hash, full_name, user_name, role, profile_id) VALUES (%s, %s, %s, %s, %s, %s)",
                (email, hashed_pw, full_name, user_name, 'user', 1)
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
                "user_icon": session.get('user_icon')
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
                u.description, 
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
            "description": user['description'],
            "rating": user['rating'] 
        })

    @app.route('/api/user/update', methods=['POST'])
    def update_user_info():
        """
        API endpoint to update user information (display name, description, password, and profile icon).
        """
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "User not logged in"}), 401

        user_name = request.form.get('user_name')
        description = request.form.get('description')
        password = request.form.get('password')
        icon = request.files.get('icon')

        if not user_name or not description:
            return jsonify({"error": "Display name and description are required"}), 400

        cursor = mysql.connection.cursor()

        cursor.execute("""
            UPDATE User 
            SET user_name = %s, description = %s, updated_at = NOW() 
            WHERE user_id = %s
        """, (user_name, description, user_id))

        if password:
            hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute("""
                UPDATE User 
                SET password_hash = %s 
                WHERE user_id = %s
            """, (hashed_pw, user_id))

        if icon:
            icon_data = icon.read()
            cursor.execute("""
                UPDATE User 
                SET user_icon = %s 
                WHERE user_id = %s
            """, (icon_data, user_id))

            session['user_icon'] = f"data:image/svg+xml;base64,{base64.b64encode(icon_data).decode('utf-8')}"

        session['user_name'] = user_name

        mysql.connection.commit()
        return jsonify({"message": "User information updated successfully"})
