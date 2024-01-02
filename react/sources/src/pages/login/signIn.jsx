import React from "react";
import axios from "axios";
import Button from "../../Components/ButtonTop";

export default function LoginPage() {
  async function loging(e) {
    e.preventDefault();
    const inputID = e.target.elements.ID.value;
    const inputPW = e.target.elements.PASSWORD.value;

    try {
      const response = await axios.post("http://localhost:5002/login", {
        username: inputID,
        password: inputPW,
      });
      console.log(response);

      if (response.data.success) {
        const userData = { name: inputID, author: "admin" };
        localStorage.setItem("user", JSON.stringify(userData));
        alert("로그인 성공");
        window.location.href = "/student";
      } else {
        alert("로그인 실패: " + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        alert("로그인 실패: " + error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
        alert("서버로부터 응답이 없습니다: " + error.message);
      } else {
        console.log("Error", error.message);
        alert("로그인 오류: " + error.message);
      }
      console.log(error.config);
    }
  }

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
