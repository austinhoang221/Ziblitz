import { configureStore } from "@reduxjs/toolkit";
import  authentication from "./slices/authenticationSlice"
import projects from "./slices/projectSlice"

export const store = configureStore({
    reducer: {
     authentication, projects
    }
  })
  
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;