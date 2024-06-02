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
import SubjectAdd from "../pages/teacher/subject-edit/subjectAdd";
import ManageSchedule from "../pages/teacher/manage_schedule";
import PlanAdd from "../pages/teacher/schedule-edit/planAdd";
import PlanEdit from "../pages/teacher/schedule-edit/PlanEdit";
import ViewLog from "../pages/admin/view_log";

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
              <Route path="/manage_schedule" element={<ManageSchedule />} />
              {/* 교직원 정보 수정 페이지 */}
              <Route path="/teacher-edit/:teacherID" element={<TeacherEdit />} />
              <Route path="/plan-edit/:scheduleID" element={<PlanEdit />} />
              {/* 수업 정보 수정/추가 페이지 */}
              <Route path="/subject-edit/:subjectID" element={<SubjectEdit />} />
              <Route path="/subject-add" element={<SubjectAdd />} />
              <Route path="/plan-add" element={<PlanAdd />} />

              {/* --- 관리자 ---  */}
              <Route path="/log_view" element={<ViewLog />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
