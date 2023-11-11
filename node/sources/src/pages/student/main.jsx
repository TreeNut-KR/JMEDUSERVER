import React from "react";
import DataTableV1 from "../../Components/dataTableV1/DataTableV1";
import SearchBox from "../../Components/searchBox/SearchBox";
import { sideMenus } from "../../constants/sideMenus";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function MainPage() {
  const [search, setSearch] = useState({
    text: "",
    option: "student",
    startDate: "",
    endDate: "",
  });
  console.log(search);
  //페이지 타이틀과 페이지 명 가져오기
  const location = useLocation();
  const targetPath = location.pathname;
  let foundMenu = null;
  sideMenus.forEach((menuGroup) => {
    menuGroup.menus.forEach((menu) => {
      if (menu.href === targetPath) {
        foundMenu = { title: menuGroup.title, name: menu.name };
      }
    });
  });

  const columns = [
    { columnName: "no", data: "no" },
    { columnName: "이름", data: "name" },
    { columnName: "모시깽", data: "hi" },
    { columnName: "저시깽", data: "name" },
    { columnName: "응애", data: "name" },
  ];

  const data = [
    { name: "hello", hi: "hi" },
    { name: "hellasdfasfsdfo" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
  ];

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
      <div className="w-full justify-center flex px-10 py-12">
        <div className="min-w-[45vw] max-w-[800px] border-4 rounded-md shadow-2xl border-[#5272F2] px-10">
          <SearchBox onSubmit={setSearch} option={"student"}></SearchBox>
          <DataTableV1
            title={"학생관리 테이블"}
            columns={columns}
            datas={data}
          />
        </div>
      </div>
    </>
  );
}
