import React, { useEffect } from "react";
import SearchBox from "../../Components/searchBox/SearchBox";
import { useState } from "react";
import BasicBox from "../../Components/manage-box/BasicBox";
import axios from "axios";
import { EDIT_TEACHER } from "../../constants/searchFilter";
import { Toast, notify } from "../../template/Toastify";
import DataTableV2 from "../../Components/dataTableV2/DataTableV2";

export default function ViewLog() {
  const [data, setData] = useState();

  useEffect(() => {
    loging();
  }, []);

  //데이터 가져오기
  async function loging() {
    try {
      const response = await axios.post("http://localhost/server/log/view", {});
      setData(response.data.log);
    } catch (error) {
      console.error(error);
    }
  }

  //데이터 테이블에 보일 컬럼
  const columns = [
    { columnName: "선생", data: "teacher" },
    { columnName: "시간", data: "샤ㅡㄷ" },
  ];

  return (
    <>
      <BasicBox>
        <SearchBox setData={setData} option={"teacher"}></SearchBox>
        <DataTableV2 title={"로그 테이블"} columns={columns} datas={data} type="admin_log" />
      </BasicBox>
      <Toast />
    </>
  );
}
