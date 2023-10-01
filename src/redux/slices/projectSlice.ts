import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProject } from "../../app/models/IProject";
import { RootState } from "../store";
const initialState: IProject[] = [];
export const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        getAllProject: (state: any, action: PayloadAction<IProject[]>) => {
            return [...state, ...action.payload];
        },
        updateProject: (state: any, action: PayloadAction<IProject>) => {
            const index = state.projects.findIndex((item: IProject) => item.id === action.payload.id);
            return state.projects.splice(index, 1, action.payload);
        },
        deleteProject: (state: any, action: PayloadAction<string>) => {
            return state.projects.filter((item: IProject) => item.id !== action.payload);
        }
    }
})

export const selectProject = (state: RootState) => state.projects;
export const {getAllProject} = projectSlice.actions;
export default projectSlice.reducer;
