import { createSlice } from "@reduxjs/toolkit";

export const EmployeeTaskSlicer = createSlice({
  name: "EmployeeTasks",
  initialState: {
    isLoading: false,
    data: [],
    empNameData: [],
    error: false,
  },
  reducers: {
    fetch_EmpTask: (state, action) => {
      console.log("action.payload", action.payload);

      state.data = action.payload;
    },
    addEmpTask: (state, action) => {
      state.data.push(action.payload);
    },
    deleteEmpTask: (state, action) => {
      state.data = state.data.filter(
        (emptask) => emptask.id !== action.payload
      );
    },
    updateEmpTask: (state, action) => {
      const index = state.data.findIndex(
        (emptask) => emptask.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
    },
    fetchName: (state, action) => {
      state.empNameData = action.payload;
      localStorage.setItem("empName", JSON.stringify(action.payload));
    },
  },
});

export const {
  fetch_EmpTask,
  addEmpTask,
  deleteEmpTask,
  updateEmpTask,
  fetchName,
} = EmployeeTaskSlicer.actions;
export default EmployeeTaskSlicer.reducer;
