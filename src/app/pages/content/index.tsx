import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { setProjects } from "../../../redux/slices/projectSlice";
import { getAllRole } from "../../../redux/slices/roleSlice";
import { setUsers } from "../../../redux/slices/userSlice";
import { useAppDispatch } from "../../customHooks/dispatch";
import useProjectData from "../../customHooks/fetchProject";
import useUserData from "../../customHooks/fetchUser";
import { IPagination } from "../../models/IPagination";
import { FullScreenSpinner } from "../components/fullscreen-spinner";
import Header from "../components/header";
export default function Content() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 5,
    sort: ["modificationtime:asc"],
  };
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const dispatch = useAppDispatch();
  const { listUser, isLoadingUser } = useUserData(userId);
  const { isLoading: isLoadingProject } = useProjectData(
    userId,
    initialRequestParam
  );
  const isLoading = isLoadingUser || isLoadingProject;
  useEffect(() => {
    dispatch(getAllRole());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(setUsers(listUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, listUser]);

  return (
    <>
      <Header></Header>
      {isLoading ? (
        <FullScreenSpinner></FullScreenSpinner>
      ) : (
        <div className="scroll">
          <Outlet />
        </div>
      )}
    </>
  );
}
