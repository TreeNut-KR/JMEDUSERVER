import React from "react";
import DataTableV1 from "../../Components/dataTableV1/DataTableV1";
import SearchBox from "../../Components/searchBox/SearchBox";
import { useState } from "react";
import BasicBox from "../../Components/manage-box/BasicBox";

export default function MainPageTeacher() {
  const [search, setSearch] = useState({
    text: "",
    option: "student",
    startDate: "",
    endDate: "",
  });
  console.log(search);

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
    { name: "hello", hi: "hi" },
    { name: "hellasdfasfsdfo" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello", hi: "hi" },
    { name: "hellasdfasfsdfo" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello", hi: "hi" },
    { name: "hellasdfasfsdfo" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello", hi: "hi" },
    { name: "hellasdfasfsdfo" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello", hi: "hi" },
    { name: "hellasdfasfsdfo" },
    { name: "hello" },
    { name: "hello" },
    { name: "hello" },
  ];

  return (
    <>
      <BasicBox>
        <SearchBox onSubmit={setSearch} option={"student"}></SearchBox>
        <DataTableV1
          title={"학생관리 테이블"}
          columns={columns}
          datas={data}
          type="student"
        />
      </BasicBox>
    </>
  );
}
