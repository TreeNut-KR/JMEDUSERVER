import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sideMenus } from "../constants/sideMenus";

export default function SideBar() {
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const location = useLocation();
  const URL = location.pathname;
  var modifiedUrls = () => {
    var parts = URL.split("/");
    if (parts.length > 2) {
      parts.splice(2, 1);
    }
    return parts.join("/");
  };
  const modifiedURL = modifiedUrls();

  useEffect(() => {
    const foundMenuItem = sideMenus.find((menu) =>
      menu.menus.some((item) => item.href === modifiedURL)
    );

    if (foundMenuItem) {
      setActiveMenuItem(foundMenuItem);
    }
  }, [modifiedURL]);

  return (
    <div className="relative w-96 h-full min-w-[200px] fontA">
      <div className="h-full">
        {sideMenus.map((menu, index) => (
          <div
            className={`h-44 flex flex-col ${
              menu === activeMenuItem
                ? "border-r-4 border-[#5272F2] rounded-r-sm"
                : "border-r-4 rounded-r-sm"
            }`}
            key={index}
          >
            <h1
              className="text-2xl font-bold w-full text-left py-3 border-b-2 px-10"
              style={{ userSelect: "none" }}
            >
              {menu.title}
            </h1>
            {menu.menus.map((item, itemIndex) =>
              item.display !== "none" ? (
                <a
                  className={`text-right font-extrabold text-[18px] py-1 px-7 ${
                    item.href === location.pathname
                      ? "bg-[#5272F2] text-white"
                      : ""
                  }`}
                  key={itemIndex}
                  href={item.href}
                >
                  {item.name}
                </a>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
