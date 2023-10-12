import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setProjects } from "../../../redux/slices/projectSlice";
import { getAllRole } from "../../../redux/slices/roleSlice";
import { setUsers } from "../../../redux/slices/userSlice";
import { useAppDispatch } from "../../customHooks/dispatch";
import useProjectData from "../../customHooks/fetchProject";
import useRoleData from "../../customHooks/fetchRole";
import useUserData from "../../customHooks/fetchUser";
import { IPagination } from "../../models/IPagination";
import Header from "../components/header";
export default function Content() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 5,
    sort: ["modificationtime:asc"],
  };
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const dispatch = useAppDispatch();
  // const { listRole } = useRoleData();
  const { listUser } = useUserData(userId);
  const { listProject } = useProjectData(userId, initialRequestParam);
  useEffect(() => {
    dispatch(getAllRole());
  }, []);
  useEffect(() => {
    dispatch(setUsers(listUser));
  }, [userId, listUser]);
  useEffect(() => {
    dispatch(setProjects(listProject));
  }, [userId, listProject]);
  return (
    <>
      <Header></Header>
      <div>
        <Outlet />
      </div>
    </>
  );
}
