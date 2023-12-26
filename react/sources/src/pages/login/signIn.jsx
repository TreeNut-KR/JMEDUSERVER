import React from "react";
import axios from 'axios'; // Axios import
import Button from "../../Components/ButtonTop";

export default function LoginPage() {
  async function loging(e) {
    e.preventDefault();
    const inputID = e.target.elements.ID.value;
    const inputPW = e.target.elements.PASSWORD.value;

    try {
      // Node.js 서버로 로그인 요청 보내기
      const response = await axios.post('http://node:5002/login', {
        username: inputID,
        password: inputPW
      });

      // 서버 응답 처리
      if (response.data.success) {
        // 로그인 성공 시 로컬 스토리지에 정보 저장(추후 세션으로 변경)
        const userData = { name: inputID, author: "admin" };
        localStorage.setItem("user", JSON.stringify(userData));
        window.location.href = "/student";
      } else {
        // 로그인 실패 처리 (서버에서 반환된 메시지를 사용)
        alert('로그인 실패: ' + response.data.message);
      }
    } catch (error) {
      // 로그인 오류 처리 (팝업으로 오류 메시지 표시)
      alert('로그인 오류: ' + error.message);
    }
  }
  // 기존 UI 코드
  return (
    <>
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-black opacity-50" />
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 flex justify-center items-center">
        <div className="w-[450px] h-80 bg-white rounded-lg shadow-2xl">
          <div className="flex justify-between pt-2 pr-2">
            <span className="fontA text-3xl pl-9 pt-2">로그인</span>
            <Button
              label={"X"}
              width={50}
              URL={"/student"}
              bgColor={"5272F2"}
            ></Button>
          </div>
          <form onSubmit={(e) => loging(e)} className="flex justify-center">
            <div className="flex flex-col">
              <input
                className="px-2 w-80 h-11 rounded-md border border-[#000000] my-7"
                name="ID"
                placeholder="아이디"
              />
              <input
                className="px-2 w-80 h-11 rounded-md border border-[#000000]"
                name="PASSWORD"
                placeholder="비밀번호"
                type="password"
              />
              <div className="flex justify-evenly pt-6">
                <button className="text-xs w-20 h-10 px-2 rounded-md border bg-[#5272F2] text-white">
                  로그인
                </button>
                <Button
                  label="신규등록"
                  width={80}
                  URL={"/register-page"}
                ></Button>
              </div>
              <span className="text-xs font-extrabold pt-3 text-center">
                신규등록을 통해 새로운 교사의 계정 추가 가능
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}