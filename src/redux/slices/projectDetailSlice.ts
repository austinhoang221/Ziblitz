import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkResponseStatus } from "../../app/helpers";
import { IDetailProject } from "../../app/models/IDetailProject";
import { IIssue } from "../../app/models/IIssue";
import {
  IPermissionGroup,
  IProjectPermissions,
} from "../../app/models/IPermission";
import { IPriority } from "../../app/models/IPriority";
import { IIssueOnBoard } from "../../app/models/IProject";
import { ISprint } from "../../app/models/ISprint";
import { ProjectService } from "../../services/projectService";
interface IProjectDetail {
  project: IDetailProject | null; // Store the detailed project or null if none is selected
  backlogIssues: IIssue[] | null;
  sprints: ISprint[] | null;
  priorities: IPriority[] | null;
  issueOnBoard: IIssueOnBoard | null;
  projectPermissions: IPermissionGroup | null;
  isShowEpic: boolean;
  isLoading: boolean;
}
const initialProjectDetailState: IProjectDetail = {
  project: null,
  backlogIssues: [],
  sprints: [],
  priorities: [],
  projectPermissions: null,
  issueOnBoard: null,
  isShowEpic: true,
  isLoading: false,
};

const userId = JSON.parse(localStorage.getItem("user")!)?.id;

export const getProjectByCode = createAsyncThunk(
  "getByCode",
  async (code: string) => {
    if (userId) {
      let response: IDetailProject | null = null;
      await ProjectService.getByCode(userId, code).then((res) => {
        if (checkResponseStatus(res)) {
          response = res?.data!;
        }
      });
      return response;
    }
  }
);

export const getProjectPriorities = createAsyncThunk(
  "getPriorities",
  async (projectId: string) => {
    let response: IPriority[] | null = [];
    await ProjectService.getPriorities(projectId).then((res) => {
      if (checkResponseStatus(res)) {
        response = res?.data!;
      }
    });
    return response;
  }
);

export const projectDetailSlice = createSlice({
  name: "projectDetail",
  initialState: initialProjectDetailState,
  reducers: {
    setProjectDetail: (state, action: PayloadAction<IDetailProject | null>) => {
      return { ...state, project: action.payload };
    },
    setBacklogIssues: (state, action: PayloadAction<IIssue[] | null>) => {
      return { ...state, backlogIssues: action.payload };
    },
    setSprints: (state, action: PayloadAction<ISprint[] | null>) => {
      return { ...state, sprints: action.payload };
    },
    setIsShowEpic: (state, action: PayloadAction<boolean>) => {
      return { ...state, isShowEpic: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getProjectByCode.pending,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.isLoading = true;
        return newState;
      }
    );
    builder.addCase(
      getProjectByCode.fulfilled,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.project = action.payload;
        newState.isLoading = false;
        if (action.payload) {
          newState.projectPermissions = action.payload.userPermissionGroup;

          if (action.payload.backlog) {
            newState.backlogIssues = action.payload.backlog.issues || [];
          }
          if (action.payload.sprints) {
            newState.sprints = action.payload.sprints || [];
          }
          if (action.payload !== null) {
            newState.priorities = action.payload.priorities || [];
          }
        }
        return newState;
      }
    );
    builder.addCase(
      getProjectPriorities.fulfilled,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        if (action.payload !== null) {
          newState.priorities = action.payload || [];
        }
        return newState;
      }
    );
  },
});

export const { setProjectDetail, setBacklogIssues, setSprints, setIsShowEpic } =
  projectDetailSlice.actions;
export default projectDetailSlice.reducer;
