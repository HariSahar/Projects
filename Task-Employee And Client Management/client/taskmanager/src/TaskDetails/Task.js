import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import TaskModel from "./TaskModal";
import { useSelector, useDispatch } from "react-redux";
import {
  fetch_EmpTask,
  addEmpTask as addEmpTaskAction,
  deleteEmpTask as deleteEmpTaskAction,
  updateEmpTask as updateEmpTaskAction,
} from "../features/EmployeeTaskSlicer";
import { fetch_Task, addTask, updateTask } from "../features/TaskSlicer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
export default function Task() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.EmployeeTasks.isLoading);
  const error = useSelector((state) => state.EmployeeTasks.error);
  const { data } = useSelector((state) => state.login);
  //console.log("data", data);
  const [currentEmpTask, SetCurrentEmpTask] = useState(null);
  const [currentTask, SetCurrentTask] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showMainModal, setshowMainModal] = useState(false);
  useEffect(() => {
    fetchTask();
  }, []);

  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const Task = useSelector((state) => state.Tasks.task_data);
  const addEmpTask = async (newEmpTask) => {
    try {
      const response = await fetch(
        "http://localhost:8000/Taskapi/emptasks/addemptask/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmpTask),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server Error:", errorText);
        return;
      }

      const data = await response.json();

      dispatch(addEmpTaskAction(data.Success));
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  const handleDelete = async (pk) => {
    try {
      const response = await fetch(
        `http://localhost:8000/Taskapi/emptasks/${pk}/ `,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server Error:", errorText);
        return;
      }
      dispatch(deleteEmpTaskAction(pk));
    } catch (err) {
      console.log(err);
    }
  };

  const updateEmpTask = async (pk, updatedData) => {
    if (currentEmpTask) {
      try {
        const response = await fetch(
          `http://localhost:8000/Taskapi/emptasks/${pk}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.log("Server Error:", errorText);
          return;
        }

        const data = await response.json();

        dispatch(updateEmpTaskAction(data));
      } catch (err) {
        console.log(err);
      }

      SetCurrentEmpTask(null);
    }
  };
  const handleEmpTaskEdit = (empTask) => {
    SetCurrentEmpTask(empTask);
    setShowEmployeeModal(true);
  };

  const fetchTask = async () => {
    try {
      const response = await fetch(`http://localhost:8000/Taskapi/tasks/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server Error:", errorText);
        return;
      }

      const data = await response.json();
      dispatch(fetch_Task(data));
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  const add_Task = async (newTask) => {
    try {
      const response = await fetch(
        "http://localhost:8000/Taskapi/tasks/addtask/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server Error:", errorText);
        return;
      }
      const data = await response.json();
      console.log("data", data);

      dispatch(addTask(data));
      fetchTask();
    } catch (err) {}
  };
  const update_Task = async (pk, updatedData) => {
    if (currentTask) {
      console.log("Calling update_Task with:", pk);
      try {
        const response = await fetch(
          `http://localhost:8000/Taskapi/tasks/updatetask/${pk}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.log("Server Error:", errorText);
          return;
        }

        const data = await response.json();
        // console.log("table:", data);
        dispatch(updateTask(data));
      } catch (err) {
        console.log(err);
      }

      SetCurrentTask(null);
    }
  };

  const handleTaskEdit = (Task) => {
    console.log("Calling handleTaskEdit with:", Task);
    SetCurrentTask(Task);
    setshowMainModal(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching tasks.</p>;

  const role = localStorage.getItem("role");

  const userTask = Task.filter((task) =>
    task.username.some((user) => user.username === data.username)
  );
  // console.log("userTask == ", userTask);
  const renderUsernames = (rowData) => {
    if (!rowData.username) return "";
    if (Array.isArray(rowData.username)) {
      return rowData.username.map((user) => user.username).join(", ");
    }
    return "";
  };

  const handleview = (task) => {
    navigate("/task-details", { state: { task: task } });
  };
  return (
    <div className="container">
      <div className="header d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h1 className="col mb-3 mb-md-0">Task Entry</h1>
        <div className="d-flex">
          <Link to="/customer" className="btn btn-secondary mx-2">
            CustomerPage
          </Link>
          <Link to="/Employee" className="btn btn-secondary">
            EmployeePage
          </Link>
        </div>
      </div>
      <div
        className="col"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <InputText
          className="p-inputtext-sm mt-2 mx-2"
          onInput={(e) =>
            setFilter({
              global: {
                value: e.target.value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            })
          }
          placeholder="Search"
        />

        <TaskModel
          addEmpTask={addEmpTask}
          updateEmpTask={updateEmpTask}
          currentEmpTask={currentEmpTask}
          add_Task={add_Task}
          update_Task={update_Task}
          currentTask={currentTask}
          showMainModal={showMainModal}
          setshowMainModal={setshowMainModal}
          showEmployeeModal={showEmployeeModal}
          setShowEmployeeModal={setShowEmployeeModal}
          SetCurrentTask={SetCurrentTask}
        />
      </div>
      <div>
        {Task.length === 0 ? (
          <div>No task available</div>
        ) : (
          <DataTable
            value={
              role === "Computer Technician" || role === "Camera Technician"
                ? userTask.map((task, index) => ({
                    ...task,
                    SNO: index + 1,
                  }))
                : Task.map((task, index) => ({
                    ...task,
                    SNO: index + 1,
                  }))
            }
            filters={filter}
            className="mt-2"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            responsiveLayout="scroll"
          >
            <Column field="SNO" header="#" />
            <Column field="OrganisationName" header="Organisation" />
            <Column field="username" header="Employee" body={renderUsernames} />
            <Column field="TaskDetails" header="Details" />
            <Column field="DueDate" header="Due Date" sortable />
            <Column field="SetPriority" header="Priority" sortable />
            <Column
              header="Action"
              body={(rowData) => (
                <div>
                  <Button
                    variant="info"
                    onClick={() => handleview(Task[rowData.SNO - 1])}
                  >
                    View
                  </Button>
                  {role === "Computer Technician" ||
                  role === "Camera Technician" ? null : (
                    <Button
                      variant="secondary mx-2"
                      onClick={() => handleTaskEdit(Task[rowData.SNO - 1])}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              )}
              bodyStyle={{ textAlign: "center", verticalAlign: "middle" }}
            />
          </DataTable>
        )}
      </div>
    </div>
  );
}
