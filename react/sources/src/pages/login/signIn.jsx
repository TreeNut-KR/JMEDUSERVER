import React from "react";
import Button from "../../Components/ButtonTop";

export default function LoginPage() {
  function loging(e) {
    //로그인 체크 기능 없음
    e.preventDefault();
    const inputID = e.target.elements.ID.value;
    // const inputPW = e.target.elements.PASSWORD.value;

    //로컬 스토리지에 정보 로그인 정보 저장
    const userData = { name: inputID, author: "admin" };
    localStorage.setItem("user", JSON.stringify(userData));

    window.location.href = "/student";
  }

  return (
    <>
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-black opacity-50" />
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 flex justify-center items-center">
        <div className="w-[450px] h-80 bg-white rounded-lg shadow-2xl">
          <div className="flex justify-between pt-4 pr-4">
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
                placeholder={`아이디`}
              />
              <input
                className="px-2 w-80 h-11 rounded-md border border-[#000000]"
                name="PASSWORD"
                placeholder={`비밀번호`}
              />
              <div className="flex justify-evenly pt-6">
                <button className="text-xs w-20 h-10 px-2 rounded-md border bg-[#5272F2] text-white">
                  로그인
                </button>
                <Button
                  label={"신규등록"}
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
