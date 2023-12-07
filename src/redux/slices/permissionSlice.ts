import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkResponseStatus } from "../../app/helpers";
import { IMember } from "../../app/models/IMember";
import { IPagination } from "../../app/models/IPagination";
import { IPermissionGroup } from "../../app/models/IPermission";
import { MemberService } from "../../services/memberService";
import { PermissionService } from "../../services/permissionService";
import { RootState } from "../store";
const requestParam: IPagination = {
  pageNum: 1,
  pageSize: 9999,
  sort: ["name:asc"],
};
interface IPermissionState {
  members: IMember[];
  permissions: IPermissionGroup[];
  isLoading: boolean;
}
const initialPermissionState: IPermissionState = {
  members: [],
  permissions: [],
  isLoading: false,
};
export const getMembers = createAsyncThunk(
  "getMembers",
  async (projectId: string) => {
    let response: IMember[] | null = null;
    await MemberService.getAll(
      projectId,
      requestParam.pageNum,
      requestParam.pageSize,
      requestParam.sort
    ).then((res) => {
      if (checkResponseStatus(res)) {
        response = res?.data.content!;
      }
    });
    return response;
  }
);
export const getPermissions = createAsyncThunk(
  "getPermissions",
  async (projectId: string) => {
    let response: IPermissionGroup[] | null = null;
    await PermissionService.getAll(
      projectId,
      requestParam.pageNum,
      requestParam.pageSize,
      requestParam.sort
    ).then((res) => {
      if (checkResponseStatus(res)) {
        response = res?.data.content!;
      }
    });
    return response;
  }
);
export const permissionSlice = createSlice({
  name: "permission",
  initialState: initialPermissionState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMembers.pending, (state, action: PayloadAction<any>) => {
      let newState = { ...state };
      newState.isLoading = true;
      return newState;
    });
    builder.addCase(
      getMembers.fulfilled,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.members = action.payload;
        newState.isLoading = false;
        return newState;
      }
    );
    builder.addCase(
      getPermissions.pending,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.isLoading = true;
        return newState;
      }
    );
    builder.addCase(
      getPermissions.fulfilled,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.permissions = action.payload;
        newState.isLoading = false;
        return newState;
      }
    );
  },
});

export const selectPermission = (state: RootState) => state.permissions;
export default permissionSlice.reducer;
