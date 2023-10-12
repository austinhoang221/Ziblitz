import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Endpoint from "../../app/api/endpoint";
import { IRole } from "../../app/models/IRole";
import { RootState } from "../store";
import { RoleService } from "../../services/roleService";
import { checkResponseStatus } from "../../app/helpers";
import { IUser } from "../../app/models/IUser";
const initialState: IRole[] = [];

export const getAllRole = createAsyncThunk(Endpoint.getAllRole, async () => {
    let response: IUser[] = [];
     await RoleService.getAll().then(res =>{
        if(checkResponseStatus(res)){
            response = [...res?.data!];
        }
    });
    return response;
  })
export const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        updateRole: (state: any, action: PayloadAction<IRole>) => {
            const index = state.findIndex((item: IRole) => item.id === action.payload.id);
            return state.splice(index, 1, action.payload);
        },
        deleteRole: (state: any, action: PayloadAction<string>) => {
            return state.filter((item: IRole) => item.id !== action.payload);
        }
    },
    extraReducers: builder => {
        builder.addCase(getAllRole.fulfilled, (state, action) => {
            return [...action.payload];
        })
    }   
})

export const selectRole = (state: RootState) => state.roles;
export default roleSlice.reducer;
