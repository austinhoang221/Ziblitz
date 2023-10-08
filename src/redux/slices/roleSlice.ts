import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRole } from "../../app/models/IRole";
import { RootState } from "../store";
const initialState: IRole[] = [];
export const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        setRoles: (state: any, action: PayloadAction<IRole[]>) => {
            return [...state, ...action.payload];
        },
        updateRole: (state: any, action: PayloadAction<IRole>) => {
            const index = state.findIndex((item: IRole) => item.id === action.payload.id);
            return state.splice(index, 1, action.payload);
        },
        deleteRole: (state: any, action: PayloadAction<string>) => {
            return state.filter((item: IRole) => item.id !== action.payload);
        }
    }
})

export const selectRole = (state: RootState) => state.roles;
export const {setRoles} = roleSlice.actions;
export default roleSlice.reducer;
