import os
import requests
from typing import Tuple
from datetime import datetime
from dotenv import load_dotenv

class Aligo:
    def __init__(self) -> None:
        current_directory = os.path.dirname(os.path.abspath(__file__))
        env_file_path = os.path.join(current_directory, '../.env')
        load_dotenv(env_file_path)  # .env 파일 로드
        
        self.send_url = 'https://apis.aligo.in/send/'
        self.receiver_name = "김준건"
        self.receiver_num = "0327667789"
        self.sms_data = {
            'key': os.getenv('SMS_KEY'),
            'userid': os.getenv('SMS_USERID'),
            'sender': os.getenv('SMS_SENDER'),
            'receiver': self.receiver_num,
            'msg_type': os.getenv('SMS_MSG_TYPE'),
            'title': os.getenv('SMS_TITLE'),
            'testmode_yn': os.getenv('SMS_TESTMODE_YN')
        }
        
    def send_sms(self, receiver_name: str, receiver_num: str, status: str) -> Tuple[str, str, str]:
        '''
        반환값 => (결과 : str, 문자 유형 : str, 타이틀 : str)
        '''
        self.receiver_name = receiver_name
        self.sms_data['receiver'] = receiver_num
        current_time = datetime.now().strftime('%H시 %M분')
        # 메시지 포맷
        msg_template = ( 
            "안녕하세요. 제이엠에듀 학원입니다.\n\n"
            f"금일 {current_time}, {self.receiver_name} 학생이\n"
            f"{status} 하였습니다.")            

        sms_data_updated = self.sms_data.copy()
        sms_data_updated['msg'] = msg_template
        
        send_response = requests.post(self.send_url, data=sms_data_updated)
        return send_response.json().get('message'), send_response.json().get('msg_type'), send_response.json().get('title')