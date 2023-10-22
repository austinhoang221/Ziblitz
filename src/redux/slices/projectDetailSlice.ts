import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Endpoint from "../../app/api/endpoint";
import { useAppDispatch } from "../../app/customHooks/dispatch";
import { checkResponseStatus } from "../../app/helpers";
import { IDetailProject } from "../../app/models/IDetailProject";
import { IIssue } from "../../app/models/IIssue";
import { ISprint } from "../../app/models/ISprint";
import { ProjectService } from "../../services/projectService";
interface IProjectDetail {
  project: IDetailProject | null; // Store the detailed project or null if none is selected
  backlogIssues: IIssue[] | null;
  sprints: ISprint[] | null;
}
const initialProjectDetailState: IProjectDetail = {
  project: null,
  backlogIssues: [],
  sprints: [],
};

const userId = JSON.parse(localStorage.getItem("user")!)?.id;

export const getProjectByCode = createAsyncThunk(
  Endpoint.getProjectByCode,
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
  },
});

export const { setProjectDetail, setBacklogIssues, setSprints } =
  projectDetailSlice.actions;
export default projectDetailSlice.reducer;
