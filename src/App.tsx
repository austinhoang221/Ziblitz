import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Authentication from "./app/pages/authentication";
import Content from "./app/pages/content";
import { PrivateRoute } from "./app/routes/private-route";
import { RootState } from "./redux/store";

function App() {
  const isLoggedIn: boolean = useSelector(
    (state: RootState) => state.authentication?.isLoggedIn
  );
  return (
    <>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Content />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
