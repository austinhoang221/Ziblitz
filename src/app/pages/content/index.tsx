import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import Dashboard from "./dashboard";

export default function Content() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}
