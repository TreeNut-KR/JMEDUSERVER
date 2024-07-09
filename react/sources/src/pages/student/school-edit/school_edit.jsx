import React, { useEffect, useState } from "react";
import BasicBox from "../../../Components/manage-box/BasicBox";
import InputBox from "../../../Components/InputBox";
import { useParams } from "react-router-dom";
import { Toast, notify } from "../../../template/Toastify";
import Button from "../../../Components/ButtonTop";
import axios from "axios";

export default function SchoolEdit() {
  const [data, setData] = useState(null);
  const { schoolID } = useParams();
  const [name, setName] = useState("");
  const [elementary, setElementary] = useState("");
  const [middle, setMiddle] = useState("");
  const [high, setHigh] = useState("");

  useEffect(() => {
    const loging = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/server/schools_view_detail`, {
          school_pk: schoolID,
        });
        setData(response.data.schools);
      } catch (error) {
        // window.location.reload();
      }
    };

    loging();
  }, [schoolID]);

  useEffect(() => {
    function setDefaultData() {
      setName(data[0].name);
      setElementary(data[0].is_elementary);
      setMiddle(data[0].is_middle);
      setHigh(data[0].is_high);
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
        `${process.env.REACT_APP_SERVER_URL}/server/schools_view_update`,
        JSON.stringify({
          school_pk: schoolID,
          name,
          elementary,
          middle,
          high,
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
          <InputBox data={name} name={"학교 이름"} edit={setName} />
          <InputBox
            data={elementary}
            name={"초등학교"}
            edit={setElementary}
            type={"radio"}
            options={["예", "아니요"]}
          />
          <InputBox data={middle} name={"중학교"} edit={setMiddle} type={"radio"} options={["예", "아니요"]} />
          <InputBox data={high} name={"고등학교"} edit={setHigh} type={"radio"} options={["예", "아니요"]} />
        </div>
        <div className="m-5 flex justify-end pr-10">
          <Button label={"수정하기"} onClick={handleSubmit} width={90} />
        </div>
      </BasicBox>
      <Toast />
    </>
  );
}
