import React, { useEffect, useState } from "react";
import { sideMenus } from "../../constants/sideMenus";
import { useLocation } from "react-router-dom";

export default function BasicBox({ children }) {
  //localstorage 로그인 정보 가져오기
  const [user, setUser] = useState(null);
  const [showDelayedContent, setShowDelayedContent] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setTimeout(() => {
      setShowDelayedContent(true);
    }, 100);
  }, []);

  //페이지 타이틀과 페이지 명 가져오기
  const location = useLocation();
  const URL = location.pathname;
  var modifiedUrls = () => {
    var parts = URL.split("/");
    if (parts.length > 2) {
      parts.splice(2, 1);
    }
    return parts.join("/");
  };
  const targetPath = modifiedUrls();
  let foundMenu = null;
  sideMenus.forEach((menuGroup) => {
    menuGroup.menus.forEach((menu) => {
      if (menu.href === targetPath) {
        foundMenu = { title: menuGroup.title, name: menu.name };
      }
    });
  });

  return (
    <>
      <div className="fontA text-3xl pt-10 pl-10">
        {foundMenu ? (
          <>
            {foundMenu.title}{" "}
            <span className="text-lg fontA">
              {" "}
              {">"} {foundMenu.name}
            </span>
          </>
        ) : null}
      </div>

      <div className="relative w-full justify-center flex px-10 py-12">
        {showDelayedContent && !user ? (
          <div className="absolute w-full h-full justify-center items-center flex">
            <div className="fontA text-5xl">로그인 후 사용이 가능합니다.</div>
          </div>
        ) : null}
        {showDelayedContent && (
          <div
            className={`min-w-[50vw] border-4 rounded-md shadow-2xl border-[#5272F2] px-10  ${
              !user ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
}
