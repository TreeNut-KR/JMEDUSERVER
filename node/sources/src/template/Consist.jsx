import React from "react";
import "../style/index.css";
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import MainPage from "../pages/student/main";
import LoginPage from "../pages/login/signIn";
import RegisterPage from "../pages/register/register";
import Product from "../pages/student/product";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Consist() {
  return (
    <BrowserRouter>
      <div className="w-full h-full flex flex-col">
        <Topbar />
        <div className="flex h-full bg-[#FAFBFE]">
          <SideBar />
          <div className="w-full">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/product" element={<Product />} />
              <Route path="/sign-in" element={<LoginPage />} />
              <Route path="/register-page" element={<RegisterPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
