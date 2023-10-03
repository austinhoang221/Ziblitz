import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../app/models/IUser";
import { RootState } from "../store";
const initialState: IUser[] = [];
export const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state: any, action: PayloadAction<IUser[]>) => {
            return [...state, ...action.payload];
        },
        updateProject: (state: any, action: PayloadAction<IUser>) => {
            const index = state.projects.findIndex((item: IUser) => item.id === action.payload.id);
            return state.projects.splice(index, 1, action.payload);
        },
        deleteProject: (state: any, action: PayloadAction<string>) => {
            return state.projects.filter((item: IUser) => item.id !== action.payload);
        }
    }
})

export const selectProject = (state: RootState) => state.projects;
export const {setUsers} = userSlice.actions;
export default userSlice.reducer;
