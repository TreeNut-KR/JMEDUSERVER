import os
import mysql.connector
from dotenv import load_dotenv
from typing import Tuple, Union

from .Error_handler import NotFoundException, InternalServerErrorException

current_directory = os.path.dirname(os.path.abspath(__file__))
env_file_path = os.path.join(current_directory, '../.env')
load_dotenv(env_file_path)  # .env 파일 로드

DB_config = {
    'host': os.getenv('MYSQL_ROOT_HOST'),
    'user': os.getenv('MYSQL_ROOT_USERDB_USER'),
    'password': os.getenv('MYSQL_ROOT_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE'),
    'port': 3306
}

def get_db_connection() -> mysql.connector.MySQLConnection:
    '''
    데이터베이스에 연결을 생성합니다.

    Returns:
    - mysql.connector.MySQLConnection: MySQL 데이터베이스 연결 객체

    Raises:
    - InternalServerErrorException: 데이터베이스 연결 실패 시 발생
    '''
    try:
        return mysql.connector.connect(**DB_config)
    except mysql.connector.Error as err:
        # 데이터베이스 연결 실패 시 InternalServerErrorException 발생
        raise InternalServerErrorException(detail=f"데이터베이스 연결 실패: {err}")

def procedure_attendance_contact(QR: str, cursor: mysql.connector.cursor) -> Union[Tuple[str, str, str], str]:
    '''
    주어진 QR 코드에 대해 'RecordAttendance' 저장 프로시저를 호출하여 결과를 반환합니다.

    Attributes:
    - QR: 조회할 QR 코드 (str)
    - cursor: MySQL 커서 객체 (mysql.connector.cursor)

    Returns:
    - Tuple[str, str, str]: (번호, 이름, 상태) 튜플
    - str: 예외 발생 시 오류 메시지

    Raises:
    - NotFoundException: QR 코드에 해당하는 데이터가 없는 경우 발생
    - InternalServerErrorException: MySQL 관련 오류 발생 시 발생
    '''
    try:
        cursor.callproc('RecordAttendance', (QR,))
        result_set = next(cursor.stored_results())  # 첫 번째 결과 집합에 접근
        fetched_result = result_set.fetchone()
        
        if fetched_result:
            return fetched_result
        else:
            # QR 코드에 해당하는 데이터가 없는 경우 NotFoundException 발생
            raise NotFoundException(detail="해당 QR의 학생이 데이터베이스에 존재하지 않습니다.")
        
    except mysql.connector.Error as err:
        # MySQL 관련 오류 발생 시 InternalServerErrorException 발생
        raise InternalServerErrorException(detail=f"MySQL 오류: {err}")
    except Exception as e:
        # 기타 예외 발생 시 InternalServerErrorException 발생
        raise InternalServerErrorException(detail=str(e))