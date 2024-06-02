import React, { useEffect, useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";
import axios from "axios";

export default function SubjectEdit() {
  const [data, setData] = useState(null);
  const [teachers, setTeachers] = useState(null);
  const { subjectID } = useParams();
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [tinyInt, setTinyInt] = useState("");

  const [teacher, setTeacher] = useState("");
  const [PK, setPK] = useState("");
  //선생 정보 핸들러
  const handleTeacherChange = (newTeacher) => {
    console.log(newTeacher);
    setTeacher(newTeacher.name);
    setPK(newTeacher.pk);
  };

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
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/subjects_view_detail`, { subject_pk: subjectID });
        setData(response.data.subjects);
        const teachersResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/teacher_view`, {});
        const teachersData = teachersResponse.data.teachers;

        const formattedTeachers = teachersData.map((teacher) => ({
          ...teacher,
          birthday: formatDatePart(teacher.birthday),
        }));
        setTeachers(formattedTeachers);
        console.log(teachers, formattedTeachers);
      } catch (error) {
        // window.location.reload();
      }
    };

    loging();
  }, [subjectID]);

  useEffect(() => {
    function setDefaultData() {
      setName(data[0].name);
      setSchool(data[0].school);
      setGrade(data[0].grade);
      setTeacher(data[0].teacher_name);
      setTinyInt(data[0].is_personal);
      setPK(data[0].teacher);
    }
    if (data && data[0]) {
      setDefaultData();
    }
  }, [data]); // data가 변경될 때만 setDefaultData 실행

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
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/server/subject/update`,
        JSON.stringify({
          subject_pk: subjectID,
          name,
          school,
          teacher: PK,
          grade,
          tinyInt,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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

  return (
    <>
      <BasicBox>
        <div className="pt-3">
          <InputBox data={name} name={"강의 명"} edit={setName} />
          <InputBox data={school} name={"학교"} edit={setSchool} />
          <InputBox data={grade} name={"강의 학년"} edit={setGrade} />
          <InputBox
            data={teacher}
            name={"테스트"}
            edit={handleTeacherChange}
            type={"picker"}
            table={"teacher"}
            subData_picker={teachers}
          />
          <InputBox data={tinyInt} name={"int(1)값"} edit={setTinyInt} />
        </div>
        <div className="m-5 flex justify-end pr-10">
          <Button label={"수정하기"} onClick={handleSubmit} width={90} />
        </div>
      </BasicBox>
      <Toast />
    </>
  );
}
