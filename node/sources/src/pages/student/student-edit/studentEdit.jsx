import React from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import { useParams } from "react-router-dom";

export default function StudentEdit() {
  const { studentID } = useParams();

  return (
    <>
      <BasicBox>
        <span className="text-6xl">studentID = {studentID}</span>
      </BasicBox>
    </>
  );
}
