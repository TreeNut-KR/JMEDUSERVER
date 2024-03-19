from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import logging

app = Flask(__name__)
socketio = SocketIO(app)

# 로깅 설정
handler = logging.FileHandler('app.log')  # 'app.log' 파일에 로그를 기록합니다.
handler.setLevel(logging.INFO)  # INFO 레벨 이상의 로그를 기록합니다.
app.logger.addHandler(handler)

connected_clients = {}  # 연결된 클라이언트들의 정보를 저장할 딕셔너리입니다.

@app.route('/')
def home():
    return render_template('index.html')

@socketio.on('connect')
def test_connect():
    app.logger.info('Client connected: %s', request.sid)  # 클라이언트 연결 로그를 남깁니다.
    connected_clients[request.sid] = request.sid  # 클라이언트의 sid를 딕셔너리에 저장합니다.

@app.route('/QR', methods=['POST'])
def api():
    data = request.get_json()
    app.logger.info('Received data: %s', data)  # 로그에 받은 데이터를 기록합니다.
    for sid in connected_clients.values():
        socketio.emit('update', data.get('qrcode', ''), room=sid)  # 실시간으로 데이터를 각 클라이언트에 전달합니다.
    return jsonify(data), 200

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5100, debug=True, allow_unsafe_werkzeug=True)