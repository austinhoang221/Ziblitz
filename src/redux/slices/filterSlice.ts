import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkResponseStatus } from "../../app/helpers";
import { IFilter } from "../../app/models/IFilter";
import { FilterService } from "../../services/filterService";
interface IFilterState {
  filters: IFilter[];
  isLoading: boolean;
}
const initialState: IFilterState = {
  filters: [],
  isLoading: false,
};
const userId = JSON.parse(localStorage.getItem("user")!)?.id;

export const getFilterIssue = createAsyncThunk("getFilter", async () => {
  if (userId) {
    let response: IFilter[] | null = null;
    await FilterService.getALl(userId).then((res) => {
      if (checkResponseStatus(res)) {
        response = res?.data!;
      }
    });
    return response;
  }
});
export const filterSlice = createSlice({
  name: "projectDetail",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getFilterIssue.pending,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.isLoading = true;
        return newState;
      }
    );
    builder.addCase(
      getFilterIssue.fulfilled,
      (state, action: PayloadAction<any>) => {
        let newState = { ...state };
        newState.filters = action.payload;
        newState.isLoading = false;
        return newState;
      }
    );
  },
});

export default filterSlice.reducer;
