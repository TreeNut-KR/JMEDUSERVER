import React from "react";
import "../style/index.css";
import Button from "../Components/ButtonTop";

export default function Topbar() {
  return (
    <div className="w-full h-24 flex items-center justify-between px-16 bg-[#F3F4F6] border-b-2 text-slate-500">
      <img className="w-48 h-12" src="" alt="" />
      <Button
        URL="/sign-in"
        label="로그인"
        styleClass={"w-28 h-11 border-[3px] rounded-lg fontA text-ms"}
      />
    </div>
  );
}
