import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterText: "",
  selectedSymbol: null,
};

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setFilterText(state, action) {
      state.filterText = action.payload;
    },
    toggleSelectedSymbol(state, action) {
      const symbol = action.payload;
      state.selectedSymbol = state.selectedSymbol === symbol ? null : symbol;
    },
  },
});

export const { setFilterText, toggleSelectedSymbol } = stocksSlice.actions;
export default stocksSlice.reducer;
