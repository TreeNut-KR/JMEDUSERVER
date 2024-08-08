import os
import platform
import subprocess
import re
from typing import Optional, List
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

class SystemInfo:
    def __init__(self):
        self.processor_id = self.get_processor_id()

    def get_processor_id(self) -> str:
        system = platform.system()
        if system == "Windows":
            return self.get_processor_id_windows()
        elif system == "Linux":
            return self.get_processor_id_linux()
        else:
            raise NotImplementedError(f"Unsupported platform: {system}")

    def get_processor_id_windows(self) -> str:
        import wmi
        win = wmi.WMI()
        processors = win.Win32_Processor()
        return processors[0].ProcessorId

    def get_processor_id_linux(self) -> str:
        try:
            output = subprocess.check_output("dmidecode -t processor | grep ID", shell=True, text=True)
            match = re.search(r'ID:\s+(\w+)', output)
            if match:
                return match.group(1)
        except subprocess.CalledProcessError:
            raise RuntimeError("Failed to get processor ID")
        return ""

system_info = SystemInfo()
print(system_info.processor_id)
SECRET_KEY = system_info.processor_id
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    비밀번호를 해시하여 반환합니다.
    
    :param password: 해시할 비밀번호
    :return: 해시된 비밀번호
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    비밀번호가 해시된 비밀번호와 일치하는지 확인합니다.
    
    :param plain_password: 원본 비밀번호
    :param hashed_password: 해시된 비밀번호
    :return: 비밀번호 일치 여부
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    액세스 토큰을 생성합니다.
    
    :param data: 토큰에 포함할 데이터
    :param expires_delta: 토큰 만료 시간 (기본값: 30분)
    :return: 생성된 JWT 토큰
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
