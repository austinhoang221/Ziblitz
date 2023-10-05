import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Authentication from "./app/pages/authentication";
import Content from "./app/pages/content";
import Dashboard from "./app/pages/content/dashboard";
import Project from "./app/pages/content/project";
import DetailProject from "./app/pages/content/project/partials/detail";
import { PrivateRoute } from "./app/routes/private-route";

function App() {
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/login" element={<Authentication />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Content />
              </PrivateRoute>
            }
          >
            <Route>
              <Route path="dashboard" element={<Dashboard />}></Route>
              <Route path="project" element={<Project />}></Route>
              <Route path="project/:code" element={<DetailProject />}></Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
