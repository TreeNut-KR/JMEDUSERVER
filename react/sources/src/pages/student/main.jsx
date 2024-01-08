import React, { useEffect } from "react";
import DataTableV1 from "../../Components/dataTableV1/DataTableV1";
import SearchBox from "../../Components/searchBox/SearchBox";
import { useState } from "react";
import BasicBox from "../../Components/manage-box/BasicBox";
import axios from "axios";
import { EDIT_STUDENT } from "../../constants/searchFilter";
import { Toast, notify } from "../../template/Toastify";

export default function MainPage() {
  const [data, setData] = useState();

  const [studnetArray, setStudentArray] = useState([]);
  const [editText, setEditText] = useState({
    text: "",
    option: "",
    submit: false,
  });

  if (editText.text && studnetArray.length > 1 && editText.submit) {
    dataSubmit_all();
    setEditText({ text: "", option: "", submit: false }); // 실행 후 초기화
  }

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
      const response = await axios.get(
        "http://localhost:5002/students_view",
        {}
      );
      setData(response.data.students);
    } catch (error) {
      console.error(error);
    }
  }

  //데이터 수정 (한번에)
  async function dataSubmit_all() {
    try {
      const response = await axios.put(
        "http://localhost:5002/students_view_update_all",
        { editObject: editText, editTarget: arrayToSqlInString(studnetArray) }
      );
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
    { columnName: "이름", data: "name" },
    { columnName: "전화번호", data: "contact" },
    { columnName: "부모님 전화번호", data: "contact_parent" },
  ];

  return (
    <>
      <BasicBox>
        <SearchBox setData={setData} option={"student"}></SearchBox>
        <DataTableV1
          title={"학생관리 테이블"}
          columns={columns}
          datas={data}
          type="student"
          setStudentArray={setStudentArray}
          editType={EDIT_STUDENT}
          setEditText={setEditText}
        />
      </BasicBox>
      <Toast />
    </>
  );
}
