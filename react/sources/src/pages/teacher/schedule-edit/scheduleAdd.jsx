import React, { useEffect, useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";
import axios from "axios";

export default function ScheduleAdd() {
  const [DataSubjects, setDataSubjects] = useState({
    subject: "",
    week: "",
    starttime: "",
    endtime: "",
    room: "",
  });

  const [subjects, setSubjects] = useState([]);
  //picker인 강의 기본 템플릿
  const [subject, setSubject] = useState("");
  //강의 정보 핸들러
  const handleTeacherChange = (newSubject) => {
    setSubject(newSubject.name);
    setDataSubjects((prevState) => ({
      ...prevState,
      subject: newSubject.pk,
    }));
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
        const subjectsResponse = await axios.post("http://localhost/server/subjects_view", {});
        const subjectsData = subjectsResponse.data.subjects;
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    loging();
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(DataSubjects);
    try {
      const response = await axios.post("http://localhost/server/plan/add", DataSubjects, {
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
    setDataSubjects((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <BasicBox>
        <div className="pt-3">
          <InputBox
            data={subject}
            name={"수업 이름"}
            edit={handleTeacherChange}
            type={"picker"}
            table={"subject"}
            subData_picker={subjects}
          />
          <InputBox data={DataSubjects.week} name={"week"} edit={(value) => handleChange("week", value)} />
          <InputBox
            data={DataSubjects.starttime}
            name={"시작 시간"}
            type={"time"}
            edit={(value) => handleChange("starttime", value)}
          />
          <InputBox
            data={DataSubjects.endtime}
            name={"종료 시간"}
            type={"time"}
            edit={(value) => handleChange("endtime", value)}
          />
          <InputBox data={DataSubjects.room} name={"room"} edit={(value) => handleChange("room", value)} />
        </div>

        <div className="m-5 flex justify-end pr-10">
          <Button label={"추가하기"} width={90} onClick={handleSubmit} />
        </div>
      </BasicBox>
      <Toast />
    </>
  );
}
