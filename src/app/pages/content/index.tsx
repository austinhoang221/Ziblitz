import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setUsers } from "../../../redux/slices/userSlice";
import useUserData from "../../customHooks/fetchUser";
import Header from "../components/header";
import "./index.scss";
export default function Content() {
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const dispatch = useDispatch();
  const { listOfData } = useUserData(userId);
  useEffect(() => {
    dispatch(setUsers(listOfData));
  }, [userId, listOfData]);
  return (
    <>
      <Header></Header>
      <div className="c-content">
        <Outlet />
      </div>
    </>
  );
}
