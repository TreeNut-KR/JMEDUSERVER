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

  // 시간 형식 변환 함수
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}-${minutes}`;
  };

  // 데이터 가져오기
  async function loging() {
    try {
      const response = await axios.post("http://localhost/server/log/view", {});
      const logs = response.data.log.map((log) => ({
        ...log,
        time: formatTime(log.time),
      }));
      setData(logs);
    } catch (error) {
      console.error(error);
    }
  }

  //데이터 테이블에 보일 컬럼
  const columns = [
    { columnName: "선생", data: "teacher" },
    { columnName: "시간", data: "time" },
    { columnName: "로그", data: "log" },
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
