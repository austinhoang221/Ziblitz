import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthentication } from "../../app/models/IAuthentication";
import { RootState } from "../store";
const initialState: IAuthentication = {
  id: "",
  name: "",
  avatarUrl: "",
  department: "",
  email: "",
  jobTitle: "",
  location: "",
  organization: "",
  isLoggedIn: false,
  token: ""
}
export const authenticationSlice = createSlice({
    name: "authentication", 
    initialState,
    reducers: {
      login: (state: any, action: PayloadAction<IAuthentication>) => {
        const user: any = {
          id: action.payload.id,
          name: action.payload.name,
          avatarUrl: action.payload.avatarUrl,
          department: action.payload.department,
          email: action.payload.email,
          jobTitle: action.payload.jobTitle,
          location: action.payload.location,
          organization: action.payload.organization,
          isLoggedIn: true,
          token: action.payload.token
      }
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      },
      logout: (state: any) => {
        localStorage.setItem("user", JSON.stringify(initialState));
        return initialState
      },
    }
  });

  export const selectUsser = (state: RootState) => state.authentication;
  export const {login, logout} = authenticationSlice.actions;
  export default authenticationSlice.reducer;
  