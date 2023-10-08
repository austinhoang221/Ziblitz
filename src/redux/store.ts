import { configureStore } from "@reduxjs/toolkit";
import  authentication from "./slices/authenticationSlice"
import projects from "./slices/projectSlice"
import users from "./slices/userSlice"
import projectDetail from "./slices/projectDetailSlice"
import roles from "./slices/roleSlice"

export const store = configureStore({
    reducer: {
     authentication, projects, users, projectDetail, roles
    }
  })
  
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;