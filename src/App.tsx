import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Authentication from "./app/pages/authentication";
import Content from "./app/pages/content";
import { RootState } from "./redux/store";
function render(isLoggedIn: boolean) {
  if (!isLoggedIn) {
    return <Route path="*" element={<Authentication />}></Route>;
  } else {
    return <Route path="/" element={<Content />}></Route>;
  }
}
function App() {
  const isLoggedIn: boolean = useSelector(
    (state: RootState) => state.authentication?.isLoggedIn
  );
  return (
    <>
      <Routes>{render(isLoggedIn)}</Routes>
    </>
  );
}

export default App;
