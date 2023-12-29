import React, { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  // 상태 관리를 위한 useState 훅
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [sexIsm, setSexIsm] = useState(false); // 성별
  const [birthday, setBirthday] = useState(""); // 생일
  const [contact, setContact] = useState(""); // 연락처
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST 요청을 통한 회원가입 데이터 전송
      const response = await axios.post("http://localhost:5002/register", {
        name,
        id,
        pwd: password,
        sex_ism: sexIsm,
        birthday,
        contact,
        is_admin: isAdmin,
      });
      console.log(response.data);
    } catch (error) {
      console.error("등록 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[450px] bg-white rounded-lg shadow-2xl p-4">
        <h2 className="text-center text-2xl font-bold mb-4">회원가입</h2>
        <form onSubmit={handleSubmit}>
          {/* 이름 필드 */}
          <div className="flex flex-col mb-4">
            <label htmlFor="name">이름:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* 아이디 필드 */}
          <div className="flex flex-col mb-4">
            <label htmlFor="id">아이디:</label>
            <input
              id="id"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* 비밀번호 필드 */}
          <div className="flex flex-col mb-4">
            <label htmlFor="password">비밀번호:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* 성별 필드 */}
          <div className="flex flex-col mb-4">
            <label htmlFor="sexIsm">성별 (남성일 경우 체크):</label>
            <input
              id="sexIsm"
              type="checkbox"
              checked={sexIsm}
              onChange={(e) => setSexIsm(e.target.checked)}
              className="mt-1"
            />
          </div>

          {/* 생일 필드 */}
          <div className="flex flex-col mb-4">
            <label htmlFor="birthday">생일:</label>
            <input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* 연락처 필드 */}
          <div className="flex flex-col mb-4">
            <label htmlFor="contact">연락처:</label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          {/* 관리자 여부 필드 */}
          <div className="flex flex-col mb-4">
            <label htmlFor="isAdmin">관리자:</label>
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="mt-1"
            />
          </div>

          {/* 계정 생성 버튼 */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            계정 생성
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          이미 계정이 있으신가요? 로그인 페이지로 이동하세요.
        </p>
      </div>
    </div>
  );
}