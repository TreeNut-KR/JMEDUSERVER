import React, { useEffect, useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";
import axios from "axios";

export default function TeacherEdit() {
  const [data, setData] = useState(null);
  const { teacherID } = useParams();
  const [name, setName] = useState("");
  const [sex_ism, setSexIsm] = useState("");
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    const loging = async () => {
      try {
        const response = await axios.post("http://localhost/server/teachers_view_detail", { teacher_pk: teacherID });
        setData(response.data.teachers);
        console.log(response);
      } catch (error) {
        // window.location.reload();
      }
    };

    loging();
  }, [teacherID]);

  useEffect(() => {
    function setDefaultData() {
      setName(data[0].name);
      setSexIsm(data[0].sex_ism);
      setBirthday(data[0].birthday);
      setContact(data[0].contact);
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
      const formatDatePart = (dateString) => {
        if (dateString && dateString.includes("T")) {
          return new Date(dateString).toISOString().split("T")[0];
        }
        return dateString;
      };

      const formattedBirthday = formatDatePart(birthday);

      const response = await axios.put(
        "http://localhost/server/teachers_view_update",
        JSON.stringify({
          teacher_pk: teacherID,
          name,
          sex_ism,
          birthday: formattedBirthday,
          contact,
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
          <InputBox data={name} name={"이름"} edit={setName} />
          <InputBox data={sex_ism} name={"성별"} edit={setSexIsm} type={"radio"} options={["남", "여"]} />
          <InputBox data={birthday} name={"생일 (8자)"} edit={setBirthday} type={"date"} />
          <InputBox data={contact} name={"전화번호"} edit={setContact} type={"phone"} />
        </div>
        <div className="m-5 flex justify-end pr-10">
          <Button label={"수정하기"} onClick={handleSubmit} width={90} />
        </div>
      </BasicBox>
      <Toast />
    </>
  );
}
