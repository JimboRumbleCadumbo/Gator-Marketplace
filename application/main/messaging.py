from flask import request, jsonify, session
from datetime import datetime
import MySQLdb
import os


def init_message_routes(app, mysql):
    @app.route('/api/messages', methods=['POST'])
    def send_message():
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401

        data = request.get_json()
        required_fields = ['receiver_id', 'text']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        try:
            conn = mysql.connection
            cursor = conn.cursor()  # Always get a new cursor per request

            cursor.execute('''
                INSERT INTO Message (sender_id, receiver_id, text)
                VALUES (%s, %s, %s)
            ''', (user_id, data['receiver_id'], data['text']))
            
            conn.commit()
            return jsonify({
                'success': True,
                'message_id': cursor.lastrowid,
                'timestamp': datetime.now().isoformat()
            }), 201
            
        except MySQLdb.Error as e:
            conn.rollback()
            return jsonify({'success': False, 'error': str(e)}), 500
        finally:
            cursor.close()  # Only close the cursor!

    @app.route('/api/messages/fetchAllContact', methods=['GET'])
    def fetch_all_contact():
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401

        try:
            conn = mysql.connection
            cursor = conn.cursor()

            # 1) Figure out each distinct contact_id
            # 2) Join that set back to User to get the username
            cursor.execute('''
                SELECT
                  contact.contact_id,
                  u.user_name
                FROM (
                  SELECT DISTINCT
                    CASE
                      WHEN sender_id = %s THEN receiver_id
                      ELSE sender_id
                    END AS contact_id
                  FROM Message
                  WHERE sender_id = %s OR receiver_id = %s
                ) AS contact
                JOIN `User` AS u
                  ON u.user_id = contact.contact_id
            ''', (user_id, user_id, user_id))

            rows = cursor.fetchall()
            # return the same “messages” key so your front-end mapping still works
            return jsonify({ 'success': True, 'messages': rows }), 200
            
        except MySQLdb.Error as e:
            return jsonify({'success': False, 'error': str(e)}), 500
        finally:
            cursor.close()

    @app.route('/api/messages/<int:other_user_id>', methods=['GET'])
    def get_message_history(other_user_id):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401

        try:
            conn = mysql.connection
            cursor = conn.cursor()

            cursor.execute('''
                SELECT 
                    id,
                    sender_id,
                    receiver_id,
                    text,
                    created_at
                FROM Message 
                WHERE (sender_id = %s AND receiver_id = %s)
                   OR (sender_id = %s AND receiver_id = %s)
                ORDER BY created_at
            ''', (user_id, other_user_id, other_user_id, user_id))
            
            messages = cursor.fetchall()
            return jsonify({
                'success': True,
                'messages': [dict(msg) for msg in messages]
            }), 200
            
        except MySQLdb.Error as e:
            return jsonify({'success': False, 'error': str(e)}), 500
        finally:
            cursor.close()
