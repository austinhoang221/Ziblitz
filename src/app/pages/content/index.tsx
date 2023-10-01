import React from "react";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "../components/header";
import Dashboard from "./dashboard";
import Project from "./project";

export default function Content() {
  return (
    <>
      <Header></Header>
      <Outlet />
    </>
  );
}
