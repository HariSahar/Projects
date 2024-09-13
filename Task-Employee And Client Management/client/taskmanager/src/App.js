import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employee from "./EmployeeDetails/Employee";
import Customer from "./CustomerDetails/Customer";
import Task from "./TaskDetails/Task";
import Login from "./Pages/Login";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import PrivateRoute from "./Auth/PrivateRouter";
import PublicRoute from "./Auth/PublicRouter";
import TaskInfo from "./TaskDetails/TaskInfo";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PrivateRoute element={Home} />} />
          <Route path="login" element={<PublicRoute element={Login} />} />
          <Route
            path="/employee"
            element={<PrivateRoute element={Employee} />}
          />
          <Route
            path="/customer"
            element={<PrivateRoute element={Customer} />}
          />
          <Route path="/task" element={<PrivateRoute element={Task} />} />
          <Route
            path="/task-details"
            element={<PrivateRoute element={TaskInfo} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
