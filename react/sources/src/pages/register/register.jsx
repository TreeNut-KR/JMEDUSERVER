import React, { useState } from "react";
import Button from "../../Components/ButtonTop";
import axios from "axios";
import ModalInputBox from "../../Components/modal_input/register_input";
import { Toast, notify } from "../../template/Toastify";

export default function RegisterPage() {
  // 상태 관리를 위한 useState 훅
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [sexIsm, setSexIsm] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [contact, setContact] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function loging() {
    if (!name || !id || !password || sexIsm === null || !birthday || !contact) {
      notify({
        type: "error",
        text: "모든 필드를 채워주세요.",
      });
      return;
    }
    handleSubmit();
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    try {
      // POST 요청을 통한 회원가입 데이터 전송
      const YYYY = birthday.substring(0, 4);
      const MM = birthday.substring(4, 6);
      const DD = birthday.substring(6, 8);
      const birthday_converted = YYYY + "-" + MM + "-" + DD;
      console.log(birthday_converted);
      const response = await axios.post("http://localhost:5002/register", {
        name,
        id,
        pwd: password,
        sex_ism: sexIsm,
        birthday: birthday_converted,
        contact,
        is_admin: isAdmin,
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
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-black opacity-50" />
      <div className="absolute w-[100vw] h-[100vh] top-0 left-0 flex justify-center items-center">
        <div className="w-[450px] bg-white rounded-lg shadow-2xl pb-4">
          <div className="flex justify-between pt-4 pr-4">
            <span className="fontA text-3xl pl-9 pt-2">회원가입</span>
            <Button
              label={"X"}
              width={50}
              URL={"/student"}
              bgColor={"5272F2"}
            />
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col">
              <ModalInputBox label={"이름"} data={name} edit={setName} />
              <ModalInputBox label={"아이디"} data={id} edit={setId} />
              <ModalInputBox
                label={"비밀번호"}
                data={password}
                edit={setPassword}
              />
              <ModalInputBox
                label={"성별"}
                data={sexIsm}
                edit={setSexIsm}
                type={"radioButton"}
              />
              <ModalInputBox
                label={"생일 (8자리)"}
                data={birthday}
                edit={setBirthday}
              />
              <ModalInputBox
                label={"연락처 ('-' 없이 작성해주세요.)"}
                data={contact}
                edit={setContact}
              />
              <ModalInputBox
                label={"관리자 여부"}
                data={isAdmin}
                edit={setIsAdmin}
                type={"checkBox"}
              />

              <div className="flex justify-evenly pt-6">
                <Button label={"뒤로 가기"} width={80} URL={"/sign-in"} />
                <Button label={"신규등록"} width={80} onClick={loging} />
              </div>
              <span className="text-xs font-extrabold pt-3 text-center">
                이후 교직원 관리 페이지에서 수정 가능합니다.
              </span>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
}
