import React, { useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";

export default function StudentEdit() {
  const { studentID } = useParams();
  const [data, setdata] = useState("");

  function editSubmit() {
    // if(변경 선공시)
    notify({
      type: "success",
      text: "수정이 완료됐습니다.",
    });
    // if(변경 실패시)
    // notify({
    //   type: "warning",
    //   text: "수정에 실패했습니다.",
    // });
    // if(변경사항 없을 시)
    // notify({
    //   type: "error",
    //   text: "수정사항이 없습니다.",
    // });
  }

  return (
    <>
      <BasicBox>
        <form action="">
          {studentID}
          <InputBox data={data} name={"이름"} edit={setdata} />
          <InputBox data={data} name={"전화번호"} edit={setdata} />
          <InputBox data={data} name={"test"} edit={setdata} />
          <InputBox data={data} name={"test"} edit={setdata} />
          <InputBox data={data} name={"test"} edit={setdata} />
        </form>
        <button onClick={editSubmit}>asdf</button>
      </BasicBox>
      <Toast />
    </>
  );
}
