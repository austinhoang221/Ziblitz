import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Dashboard from "./dashboard";

export default function Content() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}
