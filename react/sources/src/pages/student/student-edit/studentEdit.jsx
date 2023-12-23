import React, { useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { useParams } from "react-router-dom";

export default function StudentEdit() {
  const { studentID } = useParams();

  const [data, setdata] = useState("");

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
      </BasicBox>
    </>
  );
}
