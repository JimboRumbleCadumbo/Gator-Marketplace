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
                    timestamp 
                FROM Message 
                WHERE (sender_id = %s AND receiver_id = %s)
                   OR (sender_id = %s AND receiver_id = %s)
                ORDER BY timestamp
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
