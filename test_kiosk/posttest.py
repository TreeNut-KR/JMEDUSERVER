import requests
import json

url = "http://localhost:5100/QR"  # 서버의 주소
data = {"qrcode": "your_qrcode"}  # 보낼 데이터

response = requests.post(url, data=json.dumps(data))  # POST 요청 보내기

# 응답 확인
if response.status_code == 200:
    print("요청 성공!")
    print(response.json())
else:
    print("요청 실패...")