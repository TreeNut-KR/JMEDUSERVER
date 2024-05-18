import React, { useEffect, useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";
import axios from "axios";

export default function SubjectAdd() {
  const [teachers, setTeachers] = useState([]);

  //picker인 선생 기본 템플릿
  const [teacher, setTeacher] = useState("");
  //선생 정보 핸들러
  const handleTeacherChange = (newTeacher) => {
    setTeacher(newTeacher.name);
    setDataStudents((prevState) => ({
      ...prevState,
      teacher: newTeacher.pk,
    }));
  };

  const [DataStudents, setDataStudents] = useState({
    name: "",
    teacher: "",
    school: "",
    grade: "",
    is_personal: "",
  });

  //date 형식 맞춰주는 함수
  const formatDatePart = (dateString) => {
    if (dateString && dateString.includes("T")) {
      return new Date(dateString).toISOString().split("T")[0];
    }
    return dateString;
  };

  useEffect(() => {
    const loging = async () => {
      try {
        const teachersResponse = await axios.post("http://localhost/server/teacher_view", {});
        const teachersData = teachersResponse.data.teachers;
        const formattedTeachers = teachersData.map((teacher) => ({
          ...teacher,
          birthday: formatDatePart(teacher.birthday),
        }));
        setTeachers(formattedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    loging();
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/server/subject/add", DataStudents, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      notify({
        type: "success",
        text: "전송 중.",
      });

      if (response.data.success) {
        notify({
          type: "success",
          text: "전송 완료.",
        });
      }
    } catch (error) {
      notify({
        type: "error",
        text: "에러 발생.",
      });
      console.error("등록 중 오류 발생:", error);
    }
  };

  const handleChange = (field, value) => {
    setDataStudents((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <BasicBox>
        <div className="pt-3">
          <InputBox data={DataStudents.name} name={"이름"} edit={(value) => handleChange("name", value)} />
          <InputBox
            data={teacher}
            name={"담당 강사"}
            edit={handleTeacherChange}
            type={"picker"}
            table={"teacher"}
            subData_picker={teachers}
          />
          <InputBox data={DataStudents.school} name={"학교"} edit={(value) => handleChange("school", value)} />
          <InputBox data={DataStudents.grade} name={"학년"} edit={(value) => handleChange("grade", value)} />
          <InputBox
            data={DataStudents.is_personal}
            name={"개인 (1/0)"}
            edit={(value) => handleChange("is_personal", value)}
            type={"radio"}
            options={["예", "아니요"]}
          />
        </div>

        <div className="m-5 flex justify-end pr-10">
          <Button label={"추가하기"} width={90} onClick={handleSubmit} />
        </div>
      </BasicBox>
      <Toast />
    </>
  );
}
