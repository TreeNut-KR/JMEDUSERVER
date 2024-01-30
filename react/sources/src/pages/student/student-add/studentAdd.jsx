import React, { useEffect, useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";
import axios from "axios";
import "./studentAdd.css";

export default function StudentAdd() {
  const [data, setData] = useState(null);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  const [selectedStudent, setSelectedStudent] = useState(1);
  const [numStudents, setNumStudents] = useState(1);
  const [DataStudents, setDataStudents] = useState(
    Array(numStudents).fill({
      name: "",
      sex_ism: "",
      birthday: formattedDate,
      contact: "",
      contact_parent: "",
      school: "",
      payday: "",
      firstreg: formattedDate,
    })
  );

  function editSubmit() {
    notify({
      type: "success",
      text: "수정이 완료됐습니다.",
    });
  }

  const handleAddStudent = () => {
    setDataStudents((prevDataStudents) => [
      ...prevDataStudents,
      {
        name: "",
        sex_ism: "",
        birthday: formattedDate,
        contact: "",
        contact_parent: "",
        school: "",
        payday: "",
        firstreg: formattedDate,
      },
    ]);
    setNumStudents(numStudents + 1);
    setSelectedStudent(selectedStudent + 1);
  };
  const handleRemoveStudent = () => {
    if (numStudents > 1) {
      setNumStudents(numStudents - 1);

      setDataStudents((prevDataStudents) => {
        const updatedDataStudents = [...prevDataStudents];
        updatedDataStudents.splice(selectedStudent - 1, 1);
        return updatedDataStudents;
      });

      setSelectedStudent((prevSelectedStudent) =>
        prevSelectedStudent > 1 ? prevSelectedStudent - 1 : 1
      );
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedDataStudents = [...DataStudents];
    updatedDataStudents[index][field] = value;
    setDataStudents(updatedDataStudents);
  };

  return (
    <>
      <div>
        <BasicBox overflow={true}>
          <div className="fixed right-20 top-[50vh] fontA flex items-center">
            <Button
              label={"<"}
              onClick={() => {
                if (selectedStudent > 1) {
                  setSelectedStudent(selectedStudent - 1);
                }
              }}
              width={40}
            />
            <div className="flex-col flex">
              <Button
                label={"+"}
                bgColor={"3468C0"}
                onClick={handleAddStudent}
                width={40}
              />
              <Button
                label={"-"}
                onClick={handleRemoveStudent}
                width={40}
                bgColor={"D24545"}
              />{" "}
              <Button
                label={"test"}
                onClick={() => {
                  console.log(DataStudents);
                }}
                width={40}
                bgColor={"D24545"}
              />
            </div>
            <Button
              label={">"}
              onClick={() => {
                if (selectedStudent < numStudents) {
                  setSelectedStudent(selectedStudent + 1);
                }
              }}
              width={40}
            />
          </div>
          {DataStudents.map((student, index) => (
            <div
              key={index}
              className={
                index < selectedStudent - 1
                  ? "slide-out-left"
                  : index > selectedStudent - 1
                  ? "slide-out-right"
                  : "slide-in"
              }
            >
              <div className="fontA flex justify-center py-4">
                {index + 1} 번째 학생
              </div>
              <InputBox
                data={student.name}
                name={"이름"}
                edit={(value) => handleInputChange(index, "name", value)}
              />
              <InputBox
                data={student.sex_ism}
                name={"성별"}
                edit={(value) => handleInputChange(index, "sex_ism", value)}
                type={"radio"}
                options={["남", "여"]}
              />
              <InputBox
                data={String(student.birthday)}
                name={"생일 (8자)"}
                edit={(value) => handleInputChange(index, "birthday", value)}
                type={"date"}
              />
              <InputBox
                data={student.contact}
                name={"전화번호"}
                edit={(value) => handleInputChange(index, "contact", value)}
                type={"phone"}
              />
              <InputBox
                data={student.contact_parent}
                name={"전화번호 (가족)"}
                edit={(value) =>
                  handleInputChange(index, "contact_parent", value)
                }
                type={"phone"}
              />
              <InputBox
                data={student.school}
                name={"학교"}
                edit={(value) => handleInputChange(index, "school", value)}
              />
<select 
  value={student.grade}
  name={"학년"} 
  onChange={(event) => handleInputChange(index, "grade", Number(event.target.value))}
>
  <option value={0}>예비 1학년</option>
  <option value={1}>1학년</option>
  <option value={2}>2학년</option>
  <option value={3}>3학년</option>
</select>
              <InputBox
                data={student.payday}
                name={"상납일"}
                edit={(value) => handleInputChange(index, "payday", value)}
              />
              <InputBox
                data={student.firstreg}
                name={"firstreg"}
                edit={(value) => handleInputChange(index, "firstreg", value)}
                type={"date"}
              />
            </div>
          ))}

          <div className="m-5 flex justify-end pr-10">
            <Button label={"추가하기"} width={90} />
          </div>
        </BasicBox>
      </div>
      <div className="m-5 flex justify-end pr-10">
        <Button label={"-"} onClick={handleRemoveStudent} width={40} />
      </div>
      <Toast />
    </>
  );
}
