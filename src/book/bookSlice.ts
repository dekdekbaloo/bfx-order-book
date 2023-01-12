import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookRow, Precision, SortedBookRows } from "./types";

interface BookState {
  status: "disconnected" | "pending" | "connected";
  precision: Precision;
  bids: BookRow[];
  asks: BookRow[];
}

const initialState: BookState = {
  status: "pending",
  precision: "P0",
  bids: [],
  asks: [],
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<BookState["status"]>) => {
      state.status = action.payload;
    },
    setPrecision: (state, action: PayloadAction<Precision>) => {
      state.status = "pending";
      state.precision = action.payload;
    },
    updateBook: (state, action: PayloadAction<SortedBookRows>) => {
      state.bids = action.payload.bids;
      state.asks = action.payload.asks;
    },
  },
});

export const { setStatus, setPrecision, updateBook } = bookSlice.actions;

export default bookSlice.reducer;
