import React from "react";
import "../style/index.css";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import MainPage from "../pages/student/main";
import LoginPage from "../pages/login/signIn";
import RegisterPage from "../pages/register/register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentEdit from "../pages/student/student-edit/studentEdit";
import MainPageTeacher from "../pages/teacher/teacher_Check";

import AttandanceStudnet from "../pages/student/attendance_student";
import StudentAdd from "../pages/student/student-add/studentAdd";
import TeacherEdit from "../pages/teacher/teacher-edit/teacherEdit";
import ClassManageTeacher from "../pages/teacher/manage_subject";
import SubjectEdit from "../pages/teacher/subject-edit/subjectEdit";

export default function Consist() {
  return (
    <BrowserRouter>
      <div className="w-full h-full flex flex-col bg-[#FAFBFE]">
        <Topbar />
        <div className="flex h-fit bg-[#FAFBFE]">
          <SideBar />
          <div className="w-full">
            <Routes>
              {/* 로그인 , 회원가입 페이지 */}
              <Route path="/sign-in" element={<LoginPage />} />
              <Route path="/register-page" element={<RegisterPage />} />

              {/* --- 학생 ---  */}
              {/* 학생관리 페이지 */}
              <Route path="/student" element={<MainPage />} />
              <Route path="/attendance-student" element={<AttandanceStudnet />} />
              {/* 학생정보 수정 페이지 */}
              <Route path="/student-edit/:studentID" element={<StudentEdit />} />
              {/* 학생 추가 페이지 */}
              <Route path="/student-add" element={<StudentAdd />} />

              {/* --- 교직원 ---  */}
              {/* 교직원 관리 페이지 */}
              <Route path="/teacher" element={<MainPageTeacher />} />
              <Route path="/manage_subject" element={<ClassManageTeacher />} />
              {/* 교직원 정보 수정 페이지 */}
              <Route path="/teacher-edit/:teacherID" element={<TeacherEdit />} />
              {/* 수업 정보 수정 페이지 */}
              <Route path="/subject-edit/:subjectID" element={<SubjectEdit />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
