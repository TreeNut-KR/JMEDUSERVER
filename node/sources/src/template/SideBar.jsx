import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sideMenus } from "../constants/sideMenus";

export default function SideBar() {
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const foundMenuItem = sideMenus.find((menu) =>
      menu.menus.some((item) => item.href === location.pathname)
    );

    if (foundMenuItem) {
      setActiveMenuItem(foundMenuItem);
    }
  }, [location.pathname]);

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
            {menu.menus.map((item, itemIndex) => (
              <a
                className={`text-right font-extrabold py-1 px-7 ${
                  item.href === location.pathname
                    ? "bg-[#5272F2] text-white"
                    : ""
                }`}
                key={itemIndex}
                href={item.href}
              >
                {item.name}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
