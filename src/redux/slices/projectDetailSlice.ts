import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDetailProject } from "../../app/models/IDetailProject";
interface IProjectDetail {
  project: IDetailProject | null; // Store the detailed project or null if none is selected
}
const initialProjectDetailState: IProjectDetail = {
  project: null,
};
export const projectDetailSlice = createSlice({
  
    name: 'projectDetail',
    initialState: initialProjectDetailState,
    reducers: {
      setProjectDetail: (state, action: PayloadAction<IDetailProject | null>) => {
        console.log(state.project)
        return {project: action.payload};
      },
    },
  });

  export const {setProjectDetail} = projectDetailSlice.actions;
export default projectDetailSlice.reducer;