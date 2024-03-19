import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import "../style/index.css";
import Button from "../Components/ButtonTop";
import LOGO from "../img/logo_final_2.png";

export default function Topbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = Cookies.get('user'); // 쿠키에서 'user' 쿠키 가져오기
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 쿠키에서 가져온 문자열을 객체로 변환하여 상태 설정
    }
  }, []);

  function logout() {
    Cookies.remove('user'); // 'user' 쿠키 삭제
    window.location.reload(); // 페이지 새로고침으로 로그아웃 반영
  }

  return (
    <div className="w-full h-24 flex items-center justify-between px-16 bg-[#F3F4F6] border-b-2 text-slate-500">
      <div className="py-4">
        <img
          className="w-52 cursor-pointer"
          src={LOGO}
          alt=""
          onClick={() => {
            window.location.href = "/student";
          }}
        />
      </div>
      {!user ? (
        <div className="flex items-center gap-5">
          <div className="font-extrabold text-lg">
            사용을 위해 로그인을 해주세요.
          </div>
          <Button
            URL="/sign-in"
            label="로그인"
            styleClass={"w-28 h-11 border-[3px] rounded-lg fontA text-ms"}
          />
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="font-extrabold text-lg">{user.name}</div>
          <Button onClick={logout} label={"로그아웃"} width={80} />
        </div>
      )}
    </div>
  );
}
