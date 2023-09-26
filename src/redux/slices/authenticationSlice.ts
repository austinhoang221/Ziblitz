import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthentication } from "../../app/models/IAuthentication";
import { RootState } from "../store";
const initialState: IAuthentication = {
    isLoggedIn: false,
    token: ""
}
export const authenticationSlice = createSlice({
    name: "authentication", 
    initialState,
    reducers: {
      login: (state: any, action: PayloadAction<IAuthentication>) => {
        return {
            isLoggedIn: true,
            token: action.payload.token
        }
      },
      logout: (state: any, action: PayloadAction<IAuthentication>) => {
        return {
            isLoggedIn: false,
            token: action.payload.token
        }
      },
    }
  });

  export const selectUsser = (state: RootState) => state.authentication;
  export const {login, logout} = authenticationSlice.actions;
  export default authenticationSlice.reducer;
  