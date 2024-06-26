import React, { useEffect } from "react";
import DataTableV1 from "../../Components/dataTableV1/DataTableV1";
import SearchBox from "../../Components/searchBox/SearchBox";
import { useState } from "react";
import BasicBox from "../../Components/manage-box/BasicBox";
import axios from "axios";
import { EDIT_SCHEDULE } from "../../constants/searchFilter";
import { Toast, notify } from "../../template/Toastify";

export default function ManageSchedule() {
  const [data, setData] = useState();

  //배열 정수형으로 변환
  function arrayToSqlInString(arr) {
    return arr.map((item) => `'${item}'`).join(", ");
  }

  useEffect(() => {
    loging();
  }, []);

  //데이터 가져오기
  async function loging() {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/schedules_view`, {});
      setData(response.data.schedules);
    } catch (error) {
      console.error(error);
    }
  }

  //데이터 수정 (한번에)
  async function dataSubmit_all(editText, studentArray) {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/plans_view_update_all`, {
        editObject: editText,
        editTarget: arrayToSqlInString(studentArray),
      });
      if (response.data.success) {
        notify({
          type: "success",
          text: "수정이 완료됐습니다. 확인을 위해서는 새로고침을 해주세요",
        });
      } else {
        notify({
          type: "error",
          text: "수정 중 오류발생.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  //데이터 테이블에 보일 컬럼
  const columns = [
    { columnName: "수업 이름", data: "subject_name" },
    { columnName: "담당 강사", data: "teacher_name" },
    { columnName: "시작", data: "starttime" },
    { columnName: "종료", data: "endtime" },
  ];
  console.log(data);
  return (
    <>
      <BasicBox>
        <SearchBox setData={setData} option={"schedule"}></SearchBox>
        <DataTableV1
          title={"강의 목록 테이블"}
          columns={columns}
          datas={data}
          type="plan"
          editType={EDIT_SCHEDULE}
          runSQL={dataSubmit_all}
        />
      </BasicBox>
      <Toast />
    </>
  );
}
