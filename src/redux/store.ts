import { configureStore } from "@reduxjs/toolkit";
import authentication from "./slices/authenticationSlice";
import projects from "./slices/projectSlice";
import users from "./slices/userSlice";
import projectDetail from "./slices/projectDetailSlice";
import roles from "./slices/roleSlice";
import permissions from "./slices/permissionSlice";
import filters from "./slices/filterSlice";

export const store = configureStore({
  reducer: {
    authentication,
    projects,
    users,
    projectDetail,
    roles,
    permissions,
    filters,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
