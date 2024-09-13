import { createSlice } from "@reduxjs/toolkit";

export const TaskSlicer = createSlice({
  name: "Tasks",
  initialState: {
    isLoading: false,
    data: [],
    error: false,
    task_data: [],
  },
  reducers: {
    fetch_Task: (state, action) => {
      //console.log("action.payload", action.payload);
      state.task_data = action.payload;
    },
    addTask: (state, action) => {
      state.task_data.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.task_data.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.task_data[index] = {
          ...state.task_data[index],
          ...action.payload,
        };
      } else {
        console.error("Task with ID not found:", action.payload.id); // Debug log
      }
    },
  },
});

export const { fetch_Task, addTask, updateTask } = TaskSlicer.actions;
export default TaskSlicer.reducer;
