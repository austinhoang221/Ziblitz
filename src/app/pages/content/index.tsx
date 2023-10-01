import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";
import "./index.scss";
export default function Content() {
  return (
    <>
      <Header></Header>
      <div className="c-content">
        <Outlet />
      </div>
    </>
  );
}
