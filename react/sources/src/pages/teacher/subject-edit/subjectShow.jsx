import React, { useEffect, useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";

import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";

import axios from "axios";
import SearchBox from "../../../Components/searchBox/SearchBox";
import DataTableV1 from "../../../Components/dataTableV1/DataTableV1";
import { EDIT_SCHEDULE } from "../../../constants/searchFilter";

export default function SubjectShow() {
  const [data, setData] = useState();
  const { subjectID } = useParams();

  useEffect(() => {
    loging();
  }, []);

  //데이터 가져오기
  async function loging() {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/schedules_search`, {
        subject_pk: subjectID,
      });
      setData(response.data.schedules);
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
        <DataTableV1
          title={"강의 목록 테이블"}
          columns={columns}
          datas={data}
          type="subject"
          editType={EDIT_SCHEDULE}
        />
      </BasicBox>
      <Toast />
    </>
  );
}
