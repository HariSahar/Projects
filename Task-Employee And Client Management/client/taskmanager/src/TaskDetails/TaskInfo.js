import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  fetch_EmpTask,
  addEmpTask as addEmpTaskAction,
  updateEmpTask as updateEmpTaskAction,
} from "../features/EmployeeTaskSlicer";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import TaskInfoModal from "./TaskInfoModal";

function TaskInfo() {
  const location = useLocation();
  const { task } = location.state;
  const { data } = useSelector((state) => state.login);
  const empTask = useSelector((state) => state.EmployeeTasks.data);
  const dispatch = useDispatch();
  const empList = JSON.parse(localStorage.getItem("empName"));
  const [TableData, setTabledata] = React.useState([]);
  const [errorText, setErrorText] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [selectedElement, setSelectedElement] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [CurrentEmpTask, SetCurrentEmpTask] = React.useState(null);

  const userId = (element) => {
    const user = empList.find((user) => user.username === element);
    return user ? user.id : element;
  };

  const fetchEmpTask = async (taskId, usernameId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/Taskapi/emptasks/${taskId}/${usernameId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setErrorText("Server Error: " + errorText);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setErrorText("Fetch Error: " + err.message);
      return null;
    }
  };
  useEffect(() => {
    const fetchAllUserTasks = async () => {
      if (task && task.username.length) {
        const taskId = task.id;
        const promises = task.username.map(async (user) => {
          const usernameId = userId(user.username);
          if (usernameId) {
            return fetchEmpTask(taskId, usernameId);
          }
          return null;
        });

        const results = await Promise.all(promises);
        const filteredResults = results.filter((res) => res !== null);
        const flattenedResults = filteredResults.flat();

        dispatch(fetch_EmpTask(flattenedResults));

        const empList = JSON.parse(localStorage.getItem("empName"));

        const updatedResults = flattenedResults.map((task) => {
          const user = empList.find(
            (storedUser) => storedUser.id === task.username
          );
          return {
            ...task,
            username: user ? user.username : task.username,
          };
        });

        setTabledata(updatedResults);
      }
    };

    fetchAllUserTasks();
  }, [task, showModal]);

  const handleUpdate = (element) => () => {
    SetCurrentEmpTask(null);
    setShowModal(true);
    setSelectedElement(element);
  };

  const addEmpTask = async (newEmpTask, taskId, usernameId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/Taskapi/emptasks/addemptask/${taskId}/${usernameId}/`,
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
      dispatch(addEmpTaskAction(data));
      setTabledata((prevData) => [...prevData, data]);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  const handleFormSubmit = () => {
    setIsSubmitted(true);
  };

  const handleEdit = (employee) => {
    SetCurrentEmpTask(employee);
    setShowModal(true);
    setSelectedElement(employee.username);
  };
  const updateEmpTask = async (updatedData, taskId, usernameId) => {
    if (CurrentEmpTask) {
      try {
        const response = await fetch(
          `http://localhost:8000/Taskapi/emptask/${taskId}/${usernameId}/`,
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

  return (
    <div>
      <h1 className="text-center">Task Details</h1>
      <div className="container">
        <Row>
          {task &&
            task.username.map((element, index) => (
              <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-3">
                <Card style={{ width: "100%", marginTop: "20px" }}>
                  <Card.Body>
                    <Card.Title>{element.username}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Organisation: {task.OrganisationName}
                    </Card.Subtitle>
                    <Card.Text>Task: {task.TaskDetails}</Card.Text>
                    <Card.Text>Due Date: {task.DueDate}</Card.Text>
                    <Card.Text>Priority: {task.SetPriority}</Card.Text>
                    <Button
                      variant="success mx-2"
                      onClick={handleUpdate(element.username)}
                      disabled={element?.username !== data.username}
                    >
                      Create-Updates
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
      <TaskInfoModal
        showModal={showModal}
        setShowModal={setShowModal}
        task={task}
        addEmpTask={addEmpTask}
        selectedElement={selectedElement}
        handleFormSubmit={handleFormSubmit}
        CurrentEmpTask={CurrentEmpTask}
        SetCurrentEmpTask={SetCurrentEmpTask}
        updateEmpTask={updateEmpTask}
      />
      <div className="container">
        <DataTable
          value={TableData.map((element, index) => ({
            ...element,
            SNO: index + 1,
          }))}
          responsiveLayout="scroll"
        >
          <Column field="SNO" header="#" />
          <Column field="username" header="Name" />
          <Column field="TimeIn" header="Time-In" />
          <Column field="TimeOut" header="Time-Out" />
          <Column field="FreightCharges" header="Freight Charges" />
          <Column field="UsedItems" header="Used Items" />
          <Column field="ReturnedItems" header="Returned Items" />
          <Column field="AdditionalTask" header="Additional Task" />
          <Column field="REMARKS" header="Remarks" />
          <Column
            header="Action"
            body={(rowData) => (
              <div>
                <Button
                  variant="info"
                  onClick={() => handleEdit(rowData)}
                  disabled={rowData.username !== data.username}
                >
                  Update
                </Button>
              </div>
            )}
            bodyStyle={{ textAlign: "center", verticalAlign: "middle" }}
          />
        </DataTable>
      </div>
    </div>
  );
}

export default TaskInfo;
