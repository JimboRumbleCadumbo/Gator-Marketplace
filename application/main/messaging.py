"""
This module provides message routes for the Gator Savvy application.
"""
from flask import request, jsonify, session
from datetime import datetime
import MySQLdb

def init_message_routes(app, mysql):    
    """
    Initialize message routes.
    
    :param app: Flask application instance
    :param mysql: MySQL database connection
    :return: None
    """
    @app.route('/api/messages', methods=['POST'])
    def send_message():
        """
        API endpoint to send a message.
        
        :return: JSON response with message details
        """
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401

        data = request.get_json()
        # require item_id as well
        required = ['receiver_id', 'text', 'item_id']
        if not all(f in data for f in required):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        try:
            conn = mysql.connection
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO Message (sender_id, receiver_id, text, item_id)
                VALUES (%s, %s, %s, %s)
            ''', (user_id, data['receiver_id'], data['text'], data['item_id']))
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
            cursor.close()

    @app.route('/api/messages/fetchAllContact', methods=['GET'])
    def fetch_all_contact():
        """
        API endpoint to fetch all messages for a user.
        
        :return: JSON response with message details
        """
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401

        try:
            conn = mysql.connection
            cursor = conn.cursor()
            # get distinct (contact_id, item_id), then join User + Item_Listing
            cursor.execute('''
                SELECT
                  c.contact_id,
                  c.item_id,
                  u.user_name,
                  il.name      AS item_name,
                  il.status    AS item_status
                FROM (
                  SELECT DISTINCT
                    CASE WHEN sender_id=%s THEN receiver_id ELSE sender_id END AS contact_id,
                    item_id
                  FROM Message
                  WHERE sender_id=%s OR receiver_id=%s
                ) AS c
                JOIN `User` AS u
                  ON u.user_id  = c.contact_id
                JOIN Item_Listing AS il
                  ON il.item_id = c.item_id
            ''', (user_id, user_id, user_id))

            rows = cursor.fetchall()
            # each row is a dict-like; convert to JSON-able list
            return jsonify({
                'success': True,
                'messages': [dict(r) for r in rows]
            }), 200

        except MySQLdb.Error as e:
            return jsonify({'success': False, 'error': str(e)}), 500
        finally:
            cursor.close()

    @app.route('/api/messages/<int:other_user_id>', methods=['GET'])
    def get_message_history(other_user_id):
        """
        API endpoint to fetch message history between two users.
        
        :param other_user_id: ID of the other user
        :return: JSON response with message details
        """
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401

        # require item_id query-param
        item_id = request.args.get('item_id', type=int)
        if not item_id:
            return jsonify({'success': False, 'error': 'Missing item_id'}), 400

        try:
            conn = mysql.connection
            cursor = conn.cursor()
            cursor.execute('''
                SELECT
                  id,
                  sender_id,
                  receiver_id,
                  text,
                  created_at,
                  item_id
                FROM Message
                WHERE (
                  (sender_id=%s AND receiver_id=%s)
                  OR (sender_id=%s AND receiver_id=%s)
                )
                AND item_id=%s
                ORDER BY created_at
            ''', (user_id, other_user_id, other_user_id, user_id, item_id))

            msgs = cursor.fetchall()
            return jsonify({
                'success': True,
                'messages': [dict(m) for m in msgs]
            }), 200

        except MySQLdb.Error as e:
            return jsonify({'success': False, 'error': str(e)}), 500
        finally:
            cursor.close()
