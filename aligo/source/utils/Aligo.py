import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv
from typing import Tuple

class Aligo:
    def __init__(self) -> None:
        current_directory = os.path.dirname(os.path.abspath(__file__))
        env_file_path = os.path.join(current_directory, '../.env')
        load_dotenv(env_file_path)
        
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
            "안녕하세요. 제이엠에듀입니다.\n\n"
            f"{current_time}, {self.receiver_name} 학생이 {status}하였습니다.")

        sms_data_updated = self.sms_data.copy()
        sms_data_updated['msg'] = msg_template
        
        send_response = requests.post(self.send_url, data=sms_data_updated)
        return send_response.json().get('message'), send_response.json().get('msg_type'), send_response.json().get('title')
    
    def send_alimtalk(self, receiver_name: str, receiver_num: str, status: str) -> tuple:
        '''
        카카오 알림톡 전송
        반환값: (결과 메시지, 응답코드, 상세 메시지)
        '''
        url = 'https://kakaoapi.aligo.in/akv10/alimtalk/send/'
        now = datetime.now().strftime('%H:%M')

        # 템플릿 내용
        if status == "등원":
            tpl_code = os.getenv('ALIMTALK_TEMPLATE_ATTEND')
            subject = "제이엠에듀국영수논술전문학원"
            emtitle = "등원알림"
            msg_template = f"안녕하세요, 제이엠에듀국영수논술전문학원입니다.\n\n{receiver_name} 학생이 {now}에 등원하였습니다.\n\n더 열심히 가르치겠습니다. 감사합니다."
            alt_msg = f"안녕하세요, 제이엠에듀입니다.\n\n{receiver_name} 학생이 {now}에 등원하였습니다."
        elif status == "하원":
            tpl_code = os.getenv('ALIMTALK_TEMPLATE_LEAVE')
            subject = "제이엠에듀국영수논술전문학원"
            emtitle = "하원알림"
            msg_template = f"안녕하세요, 제이엠에듀국영수논술전문학원입니다.\n\n{receiver_name} 학생이 {now}에 하원하였습니다.\n\n더 열심히 가르치겠습니다. 감사합니다."
            alt_msg = f"안녕하세요, 제이엠에듀입니다.\n\n{receiver_name} 학생이 {now}에 하원하였습니다."
        else:
            tpl_code = os.getenv('ALIMTALK_TEMPLATE_ATTEND')
            subject = ""
            emtitle = ""
            msg_template = ""
            alt_msg = ""


        data = {
            'apikey': os.getenv('ALIMTALK_API_KEY'),
            'userid': os.getenv('ALIMTALK_USERID'),
            'senderkey': os.getenv('ALIMTALK_SENDERKEY'),
            'tpl_code': tpl_code,
            'sender': os.getenv('ALIMTALK_SENDER'),
            'receiver_1': receiver_num,
            'recvname_1': receiver_name,
            'subject_1': subject,
            'emtitle_1': emtitle,
            'message_1': msg_template,
            'failover': 'Y',
            'fsubject_1': subject,
            'fmessage_1': alt_msg,
            'ftype_1': 'SMS'
        }

        response = requests.post(url, data=data)
        resp_json = response.json()
        return resp_json.get('result_message', ''), resp_json.get('result_code', ''), resp_json.get('message', '')