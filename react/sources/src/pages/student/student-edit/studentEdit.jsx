import React, { useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
// import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";

export default function StudentEdit() {
  // const { studentID } = useParams();
  const [data0, setdata0] = useState("");
  const [data1, setdata1] = useState("");
  const [data2, setdata2] = useState("");
  const [data3, setdata3] = useState("");
  const [data4, setdata4] = useState("");
  const [data5, setdata5] = useState("");

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
          <InputBox data={data0} name={"이름"} edit={setdata0} />
          <InputBox data={data1} name={"전화번호"} edit={setdata1} />
          <InputBox data={data2} name={"뭔 번호"} edit={setdata2} />
          <InputBox data={data3} name={"데이터 2"} edit={setdata3} />
          <InputBox data={data4} name={"데이터 3"} edit={setdata4} />
          <InputBox data={data5} name={"데이터 4"} edit={setdata5} />
        </form>
        <div className="m-5 flex justify-end pr-10">
          <Button label={"수정하기"} onClick={editSubmit} width={90} />
        </div>
      </BasicBox>
      <Toast />
    </>
  );
}
