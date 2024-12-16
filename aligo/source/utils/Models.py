from typing import Any, Optional
from pydantic import BaseModel, Field, field_validator

from .Error_handler import ValueErrorException

class QR_Request(BaseModel):
    qr_data: str = Field(..., title="QR 코드", description="학생 QR Code를 나타내는 문자열입니다. 36자리 값으로 설정해야됩니다.")

    @field_validator('qr_data')
    def check_length(cls, v) -> str:
        if len(v) != 36:
            raise ValueErrorException(detail=f"QR Code는 정확히 36자리여야 합니다. 입력된 값의 길이: {len(v)}")
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
    
class QR_Response(BaseModel):
    message: str = Field(..., title="메시지")
    student_name: Optional[str] = Field(None, title="학생 이름")
    send_result: Optional[Any] = Field(None, title="전송 결과")
