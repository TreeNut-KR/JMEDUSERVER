import React, { useEffect } from "react";
import DataTableV1 from "../../Components/dataTableV1/DataTableV1";
import SearchBox from "../../Components/searchBox/SearchBox";
import { useState } from "react";
import BasicBox from "../../Components/manage-box/BasicBox";
import axios from "axios";

export default function MainPage() {
  const [data, setData] = useState();
  const [search, setSearch] = useState({
    text: "",
    option: "student",
    startDate: "",
    endDate: "",
  });
  console.log(search);

  useEffect(() => {
    loging();
  }, []);

  async function loging() {
    try {
      const response = await axios.get(
        "http://localhost:5002/students_view",
        {}
      );
      setData(response.data.students);
      console.log(response);
    } catch (error) {
      console.error(error); // 오류 발생 시 자세한 내용을 확인
    }
  }
  const columns = [
    { columnName: "이름", data: "name" },
    { columnName: "전화번호", data: "contact" },
    { columnName: "부모님 전화번호", data: "contact_parent" },
    { columnName: "학교", data: "school" },
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
        <button onClick={loging}>sd./f,sd;lasdfl;djsaf</button>
      </BasicBox>
    </>
  );
}
