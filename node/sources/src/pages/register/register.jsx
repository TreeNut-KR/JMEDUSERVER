import React from "react";
import Button from "../../Components/ButtonTop";

export default function RegisterPage() {
  return (
    <>
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-black opacity-50" />
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 flex justify-center items-center">
        <div className="w-[450px] bg-white rounded-lg shadow-2xl">
          <div className="flex justify-between pt-2 pr-2">
            <span className="fontA text-3xl pl-9 pt-2">
              회원가입 <span className="fontA text-lg">{"> "}교수전용</span>
            </span>
            <Button
              label={"X"}
              width={50}
              URL={"/student"}
              bgColor={"5272F2"}
            ></Button>
          </div>
          <form action="" className="flex justify-center">
            <div className="flex flex-col">
              <input
                className="px-2 w-80 h-11 rounded-md border border-[#000000] my-7"
                name="NAME"
                placeholder={`이름`}
              />
              <input
                className="px-2 w-80 h-11 rounded-md border border-[#000000] mb-7"
                name="ID"
                placeholder={`아이디`}
              />
              <input
                className="px-2 w-80 h-11 rounded-md border border-[#000000]"
                name="PASSWORD"
                placeholder={`비밀번호`}
              />
              <div className="flex justify-evenly pt-6">
                <button className="text-xs w-36 h-10 px-2 rounded-md border bg-[#5272F2] text-white mb-10">
                  계정생성 및 확인
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
