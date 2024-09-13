import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import EmployeeSlicer from "./features/EmployeeSlicer";
import TaskSlicer from "./features/TaskSlicer";
import EmployeeTaskSlicer from "./features/EmployeeTaskSlicer";
import CustomerSlicer from "./features/CustomerSlicer";
import loginSlicer from "./features/LoginSlicer";
const store = configureStore({
  reducer: {
    employees: EmployeeSlicer,
    EmployeeTasks: EmployeeTaskSlicer,
    Tasks: TaskSlicer,
    customer: CustomerSlicer,
    login: loginSlicer,
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
