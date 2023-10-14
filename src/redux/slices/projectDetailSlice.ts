import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDetailProject } from "../../app/models/IDetailProject";
import { IIssue } from "../../app/models/IIssue";
interface IProjectDetail {
  project: IDetailProject | null; // Store the detailed project or null if none is selected
  backlogIssues: IIssue[] | null
}
const initialProjectDetailState: IProjectDetail = {
  project: null,
  backlogIssues: []
};
export const projectDetailSlice = createSlice({
    name: 'projectDetail',
    initialState: initialProjectDetailState,
    reducers: {
      setProjectDetail: (state, action: PayloadAction<IDetailProject | null>) => {
        return {...state, project: action.payload};
      },
      setBacklogIssues: (state, action: PayloadAction<IIssue[] | null>) => {
        return {...state, backlogIssues: action.payload};
      },
    },
  });

export const {setProjectDetail, setBacklogIssues} = projectDetailSlice.actions;
export default projectDetailSlice.reducer;