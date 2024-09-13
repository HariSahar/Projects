import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchemployee = createAsyncThunk("fetchemployee", async () => {
  const data = await fetch("http://127.0.0.1:8000/api/employees/");
  return data.json();
});

export const storeSlice = createSlice({
  name: "employees",
  initialState: {
    isLoading: false,
    data: [],
    error: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchemployee.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(fetchemployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = false;
      })
      .addCase(fetchemployee.rejected, (state) => {
        state.isLoading = false;
        state.data = [];
        state.error = true;
      });
  },
  reducers: {
    addEmployee: (state, action) => {
      state.data.push(action.payload);
    },

    deleteEmployee: (state, action) => {
      state.data = state.data.filter(
        (employee) => employee.id !== action.payload
      );
    },

    updateEmployee: (state, action) => {
      const index = state.data.findIndex((emp) => emp.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
});

export const { addEmployee, deleteEmployee, updateEmployee } =
  storeSlice.actions;
export default storeSlice.reducer;
