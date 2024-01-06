import React, { useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
// import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";
import axios from "axios";

export default function StudentEdit() {
  // const { studentID } = useParams();
  const [name, setName] = useState("");
  const [sex_ism, setSexIsm] = useState("");
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");
  const [contact_parent, setContact_parent] = useState("");
  const [school, setSchool] = useState("");
  const [payday, setPayday] = useState("");
  const [firstreg, setFirstreg] = useState("");

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

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    try {
      //수정 예정
      const response = await axios.post("http://localhost:5002/register", {
        name,
        sex_ism,
        birthday,
        contact_parent,
        school,
        payday,
        firstreg,
      });
      notify({
        type: "success",
        text: "전송성공.",
      });
      console.log(response.data);
    } catch (error) {
      notify({
        type: "error",
        text: "에러 발생.",
      });
      console.error("등록 중 오류 발생:", error);
    }
  };

  return (
    <>
      <BasicBox>
        <div className="pt-3">
          <InputBox data={name} name={"이름"} edit={setName} />
          <InputBox data={sex_ism} name={"전화번호"} edit={setSexIsm} />
          <InputBox data={birthday} name={"생일 (8자)"} edit={setBirthday} />
          <InputBox data={contact} name={"전화번호"} edit={setContact} />
          <InputBox
            data={contact_parent}
            name={"전화번호 (가족)"}
            edit={setContact_parent}
          />
          <InputBox data={school} name={"학교"} edit={setSchool} />
          <InputBox data={payday} name={"상납일"} edit={setPayday} />
          <InputBox data={firstreg} name={"firstreg"} edit={setFirstreg} />
        </div>
        <div className="m-5 flex justify-end pr-10">
          <Button label={"수정하기"} onClick={handleSubmit} width={90} />
        </div>
      </BasicBox>
      <Toast />
    </>
  );
}
