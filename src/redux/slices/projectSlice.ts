import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProject } from "../../app/models/IProject";
import { RootState } from "../store";
const initialState: IProject[] = [];
export const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects: (state: any, action: PayloadAction<IProject[]>) => {
            return [...action.payload];
        },
        setProject: (state: any, action: PayloadAction<IProject[]>) => {
            return [...action.payload];
        },
        createProject: (state: any, action: PayloadAction<IProject>) => {
            return [action.payload,...state];
        },
        updateProject: (state: any, action: PayloadAction<IProject>) => {
            const index = state.findIndex((item: IProject) => item.id === action.payload.id);
            return state.toSpliced(index, 1, action.payload);
        },
        deleteProject: (state: any, action: PayloadAction<string>) => {
            const deletedState = state.filter((item: IProject) => item.id !== action.payload);
            return deletedState;
        }
    }
})

export const selectProject = (state: RootState) => state.projects;
export const {setProjects, createProject,updateProject, deleteProject} = projectSlice.actions;
export default projectSlice.reducer;
