import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Endpoint from "../../app/api/endpoint";
import { checkResponseStatus } from "../../app/helpers";
import { IDetailProject } from "../../app/models/IDetailProject";
import { IIssue } from "../../app/models/IIssue";
import { IPriority } from "../../app/models/IPriority";
import { ISprint } from "../../app/models/ISprint";
import { ProjectService } from "../../services/projectService";
interface IProjectDetail {
  project: IDetailProject | null; // Store the detailed project or null if none is selected
  backlogIssues: IIssue[] | null;
  sprints: ISprint[] | null;
  priorities: IPriority[] | null;
  isShowEpic: boolean;
}
const initialProjectDetailState: IProjectDetail = {
  project: null,
  backlogIssues: [],
  sprints: [],
  priorities: [],
  isShowEpic: false,
};

const userId = JSON.parse(localStorage.getItem("user")!)?.id;

export const getProjectByCode = createAsyncThunk(
  "getByCode",
  async (code: string) => {
    let response: IDetailProject | null = null;
    await ProjectService.getByCode(userId, code).then((res) => {
      if (checkResponseStatus(res)) {
        response = res?.data!;
      }
    });
    return response;
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
      getProjectByCode.fulfilled,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.project = action.payload;
        if (action.payload !== null) {
          if (action.payload.backlog) {
            newState.backlogIssues = action.payload.backlog.issues || [];
          }
          if (action.payload.sprints) {
            newState.sprints = action.payload.sprints || [];
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
          newState.priorities = action.payload.priorities || [];
        }
        return newState;
      }
    );
  },
});

export const { setProjectDetail, setBacklogIssues, setSprints, setIsShowEpic } =
  projectDetailSlice.actions;
export default projectDetailSlice.reducer;
