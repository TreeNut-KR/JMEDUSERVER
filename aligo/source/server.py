import ctypes
import logging
import os
from ctypes.wintypes import MAX_PATH
from datetime import datetime
from pathlib import Path
from sys import platform
from typing import Any, Optional, Tuple, Union

import mysql.connector
import mysql.connector.cursor
import requests
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError
from fastapi import status
from pydantic import BaseModel, Field, field_validator
from utils.Aligo import Aligo

app = FastAPI()

MAX_PATH = 260
def get_documents_folder():
    CSIDL_PERSONAL = 5
    SHGFP_TYPE_CURRENT = 0
    path_buf = ctypes.create_unicode_buffer(MAX_PATH)
    ctypes.windll.shell32.SHGetFolderPathW(None, CSIDL_PERSONAL, None, SHGFP_TYPE_CURRENT, path_buf)
    return path_buf.value
if platform == "linux" or platform == "linux2":
    documents_path = Path(__file__).parent.parent
elif platform == "win32":
    documents_path = Path(get_documents_folder())
    
log_file_path = documents_path / 'Aligo(JMEDU)_logs.log'

if not log_file_path.parent.exists():
    log_file_path.parent.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename=log_file_path,
    filemode='a')

class QRdata(BaseModel):
    qr_data: str = Field(..., title="QR 코드",
                         description="학생 QR Code를 나타내는 문자열입니다. 36자리 값으로 설정해야됩니다.",)
    @field_validator('qr_data')
    def check_length(cls, v) -> str:
        if len(v) != 36:
            raise ValueError(f"QR Code는 정확히 36자리여야 합니다. 입력된 값의 길이: {len(v)}")
        return v
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                "qr_data": "3335cf9b-198c-11ef-b8a7-0242c0a87002"
                }
            ]
        }
    }

class QRresult(BaseModel):
    success: bool = Field(False, title="성공 여부")
    message: str = Field(..., title="메시지")
    send_result: Optional[Any] = Field(None, title="전송 결과")
    description: Optional[Any] = Field(None, title="설명")


db_config = {
    'host': os.getenv('MYSQL_ROOT_HOST'),
    'user': os.getenv('MYSQL_ROOT_USERDB_USER'),
    'password': os.getenv('MYSQL_ROOT_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE'),
    'port': 3306
}

def mask_name(name: str) -> str:
    """
    이름을 마스킹합니다.
    - 2글자: 첫 글자 + 'O'
    - 3글자 이상: 첫 글자 + 'O' + 마지막 글자
    예시:
      홍길동 → 홍O동
      남궁민찬 → 남O찬
      김건 → 김O
    """
    if not name:
        return ""
    if len(name) == 2:
        return name[0] + "O"
    elif len(name) > 2:
        return name[0] + "O" + name[-1]
    else:
        return name


def procedure_attendance_contact(QR: str, cursor: mysql.connector.cursor) -> Union[Tuple[str, str, str], str]:
    ''' 반환값 => (번호 : str, 이름 : str, 상태 : str) : tuple'''
    try:

        cursor.callproc('RecordAttendance', (QR,))
        result_set = next(cursor.stored_results()) 
        fetched_result = result_set.fetchone()
            
        if fetched_result:
            return fetched_result
        else:
            return "해당 QR의 학생이 데이터베이스에 존재하지 않습니다"
        
    except Exception as e:
        logging.error(f'An error occurred: {str(e)}')
        raise HTTPException(status_code=500, detail="해당 QR의 학생이 데이터베이스에 존재하지 않습니다.")
            
@app.post("/qr", response_model=QRresult, summary="QR Code 수신", response_model_exclude_none=True)
def receive_qr(request_data: QRdata) -> QRresult:
    """
    출석 키호스크에서 QR코드를 전달 받아 Aligo Web 발신 후 성공 여부를 반환합니다.
    """
    try:
        cnx = mysql.connector.connect(**db_config)
        with cnx.cursor() as cursor:
            contact_result = procedure_attendance_contact(request_data.qr_data, cursor)
            cnx.commit()
        if isinstance(contact_result, str):
            logging.error(contact_result)
            return QRresult(success=False, message=contact_result)
        
        number, name, status = contact_result
        if status == "leave":
            logging.error(f"{name} 하원이 완료된 상태")
            return QRresult(message="금일 하원이 이미 완료되었습니다", success=False)
        elif status == "wait":
            return QRresult(message="이미 등원 처리가 완료되었습니다", success=False, description="하원 시 잠시 후 다시 시도해주세요")
        elif status == "attend":
            attendance_status = "등원"
        elif status == "already":
            attendance_status = "하원"
        else:
            attendance_status = None

        if attendance_status:
            try:
                # 알림톡 전송
                message, result_code, api_message = Aligo().send_alimtalk(
                    receiver_name=name,
                    receiver_num=number,
                    status=attendance_status
                )
                logging.info(f'Received QR Data: {request_data.qr_data} '
                             f'Student\'s name: {name} '
                             f'Parent\'s Contact: {number} '
                             f'status: {status} '
                             f'aligo: {message, result_code, api_message}')
                return QRresult(
                    message=mask_name(name)+f" 학생 {attendance_status} 완료",
                    send_result=None,
                    success=True,
                    description=None,
                )
            except Exception as e:
                logging.error(f"Alimtalk send error: {e}")
                return JSONResponse(
                    status_code=500,
                    content={
                        "success": False,
                        "message": "알림톡 전송에 실패했습니다",
                        "description": "관리자에게 문의해주세요"
                    }
                )
        
    except mysql.connector.Error as err:
        logging.error(f"등원 기록 중 데이터베이스 오류: {err}")
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "message": "등원 기록 중 오류가 발생했습니다",
                "description": "관리자에게 문의해주세요"
            }
        )
    except UnboundLocalError as ue:
        logging.error(f'Unbound Local Error occurred: {str(ue)}')
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "서버 내부 오류가 발생했습니다",
                "description": "관리자에게 문의해주세요"
            }
        )
    except Exception as e:
        logging.error(f'An error occurred: {str(e)}')
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "서버에서 처리할 수 없는 요청입니다",
                "description": "관리자에게 문의해주세요"
            }
        )
    finally:
        if 'cnx' in locals() and cnx.is_connected():
            cnx.close()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    QRresult 형식으로 Pydantic 유효성 검사 오류 반환
    """
    errors = exc.errors()
    for err in errors:
        if "ctx" in err and "error" in err["ctx"]:
            err["ctx"]["error"] = str(err["ctx"]["error"])
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "입력된 데이터가 올바르지 않습니다",
            "error_context": errors
        }
    )

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)