import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProject } from "../../app/models/IProject";
interface IProjectDetail {
  project: IProject | null; // Store the detailed project or null if none is selected
}
const initialProjectDetailState: IProjectDetail = {
  project: null,
};
export const projectDetailSlice = createSlice({
  
    name: 'projectDetail',
    initialState: initialProjectDetailState,
    reducers: {
      setProjectDetail: (state, action: PayloadAction<IProject | null>) => {
        console.log(state.project)
        return {project: action.payload};
      },
    },
  });

  export const {setProjectDetail} = projectDetailSlice.actions;
export default projectDetailSlice.reducer;