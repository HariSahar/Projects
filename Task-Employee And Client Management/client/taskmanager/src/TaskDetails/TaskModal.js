import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrganisationName } from "../features/CustomerSlicer";
import { fetchName } from "../features/EmployeeTaskSlicer";
import Select from "react-select";

function TaskModel({
  addEmpTask,
  currentEmpTask,
  updateEmpTask,
  add_Task,
  currentTask,
  update_Task,
  showMainModal,
  setshowMainModal,
  showEmployeeModal,
  setShowEmployeeModal,
  SetCurrentTask,
}) {
  //console.log("showMainModal", showMainModal);

  //const [showMainModal, setShowMainModal] = useState(false);
  //const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [OrganisationName, SetOrganisationName] = useState("");
  const [EmployeeName, SetEmployeeName] = useState([]);
  const [TaskDetails, SetTaskDetails] = useState("");
  const [DueDate, SetDueDate] = useState("");
  const [Priority, SetPriority] = useState("");
  const [TimeIn, SetTimeIn] = useState("");
  const [FreightCharges, SetFreightCharges] = useState();
  const [TimeOut, SetTimeOut] = useState("");
  const [NatureOfWork, SetNatureofWork] = useState("");
  const [UsedItems, SetUsedItems] = useState("");
  const [ReturnedItems, SetReturnedItems] = useState("");
  const [AdditionalTask, SetAdditionalTasks] = useState("No");
  const [REMARKS, SetRemarks] = useState("Pending");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrganisationName());
    fetchEmployeeName();
  }, []);

  const organizations = useSelector(
    (state) => state.customer.organisationNames
  );
  const empName = useSelector((state) => state.EmployeeTasks.empNameData);

  const handleShowMainModal = () => setshowMainModal(true);
  const handleCloseMainModal = () => {
    setshowMainModal(false);
    SetOrganisationName("");
    SetEmployeeName("");
    SetTaskDetails("");
    SetDueDate("");
    SetCurrentTask(null);
  };

  const handleShowEmployeeModal = () => setShowEmployeeModal(true);
  const handleCloseEmployeeModal = () => {
    setShowEmployeeModal(false);
    SetTimeIn("");
    SetFreightCharges();
    SetTimeOut("");
    SetNatureofWork("");
    SetUsedItems("");
    SetReturnedItems("");
    SetAdditionalTasks("No");
    SetRemarks("Pending");
  };

  useEffect(() => {
    if (currentEmpTask) {
      SetTimeIn(currentEmpTask.TimeIn);
      SetFreightCharges(currentEmpTask.FreightCharges);
      SetTimeOut(currentEmpTask.TimeOut);
      SetNatureofWork(currentEmpTask.NatureOfWork);
      SetUsedItems(currentEmpTask.UsedItems);
      SetReturnedItems(currentEmpTask.ReturnedItems);
      SetAdditionalTasks(currentEmpTask.AdditionalTasks);
      SetRemarks(currentEmpTask.REMARKS);
      // handleShowEmployeeModal();
    } else {
      SetTimeIn();
      SetFreightCharges();
      SetTimeOut();
      SetNatureofWork("");
      SetUsedItems("");
      SetReturnedItems("");
      SetAdditionalTasks("No");
      SetRemarks("Pending");
    }
  }, [currentEmpTask, setShowEmployeeModal]);

  useEffect(() => {
    if (currentTask) {
      SetOrganisationName(currentTask.OrganisationName);
      SetEmployeeName(currentTask.EmployeeName);
      SetTaskDetails(currentTask.TaskDetails);
      SetDueDate(currentTask.DueDate);
      // handleShowMainModal();
    } else {
      SetOrganisationName("");
      SetEmployeeName("");
      SetTaskDetails("");
      SetDueDate();
    }
  }, [currentTask, showMainModal]);

  const handleSubmit1 = (e) => {
    e.preventDefault();
    const newEmpTaskInfo = {
      TimeIn,
      FreightCharges,
      TimeOut,
      NatureOfWork,
      UsedItems,
      ReturnedItems,
      AdditionalTask,
      REMARKS,
    };
    if (currentEmpTask) {
      updateEmpTask(currentEmpTask.id, newEmpTaskInfo);
    } else {
      addEmpTask(newEmpTaskInfo);
    }
    handleCloseEmployeeModal();
  };

  const fetchEmployeeName = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/employees/EmpName/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log("Server Error:", await response.text());
        return;
      }

      const data = await response.json();
      dispatch(fetchName(data));
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };
  useEffect(() => {
    console.log("EmployeeName", EmployeeName);
    console.log("OrganisationName", OrganisationName);
    //console.log("currentTask", currentTask);
    //console.log("SetcurrentTask", SetcurrentTask.id);
  }, [EmployeeName, OrganisationName]);

  function getOrgId(orgName) {
    const organisationData =
      JSON.parse(localStorage.getItem("organisationNames")) || [];
    const organisation = organisationData.find(
      (org) => org.OrganisationName === orgName.value
    );
    return organisation ? organisation.id : null;
  }

  function getEmpId(EmpNames) {
    const EmployeeNameData = JSON.parse(localStorage.getItem("empName")) || [];
    const employeeIds = EmpNames.map((empName) => {
      const employee = EmployeeNameData.find(
        (emp) => emp.username === empName.value
      );
      return employee ? employee.id : null;
    });
    return employeeIds.filter((id) => id !== null);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTaskInfo = {
      OrganisationName: getOrgId(OrganisationName),
      user_ids: getEmpId(EmployeeName),
      TaskDetails,
      DueDate,
      SetPriority: Priority.value,
    };

    if (currentTask) {
      update_Task(currentTask.id, newTaskInfo);
    } else {
      add_Task(newTaskInfo);
    }
    console.log("newTask", newTaskInfo);
    handleCloseMainModal();
  };
  const role = localStorage.getItem("role");
  const handlechange = (value) => {
    SetEmployeeName(value);
  };

  const handleOrgChange = (value) => {
    SetOrganisationName(value);
  };

  const handlePriorityChange = (value) => {
    SetPriority(value);
  };

  const Priorities = ["High", "Medium", "Low"];

  useEffect(() => {
    if (currentTask && currentTask.username) {
      const initialValues = currentTask.username.map((user) => ({
        label: user.username,
        value: user.username,
      }));
      SetEmployeeName(initialValues);
    }
  }, [currentTask]);

  useEffect(() => {
    if (currentTask && currentTask.OrganisationName) {
      const initialValues = {
        label: currentTask.OrganisationName,
        value: currentTask.OrganisationName,
      };
      SetOrganisationName(initialValues);
    }
  }, [currentTask]);

  useEffect(() => {
    if (currentTask && currentTask.SetPriority) {
      const initialValues = {
        label: currentTask.SetPriority,
        value: currentTask.SetPriority,
      };
      SetPriority(initialValues);
    }
  }, [currentTask]);

  return (
    <>
      {role === "Computer Technician" || role === "Camera Technician" ? null : (
        <Button
          variant="primary"
          className="mt-2"
          onClick={handleShowMainModal}
        >
          Add Task
        </Button>
      )}

      <Modal show={showMainModal} onHide={handleCloseMainModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentTask ? "Update Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Organisation Name</Form.Label>
              <Select
                value={OrganisationName}
                onChange={handleOrgChange}
                options={organizations.map((org) => ({
                  label: org.OrganisationName,
                  value: org.OrganisationName,
                }))}
                placeholder="Select Organisation"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Employee Name</Form.Label>
              <Select
                isMulti
                value={EmployeeName}
                onChange={handlechange}
                options={empName.map((emp) => ({
                  label: emp.username,
                  value: emp.username,
                }))}
                placeholder="Select Employee"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Task Details</Form.Label>
              <Form.Control
                type="text"
                value={TaskDetails}
                onChange={(e) => SetTaskDetails(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={DueDate}
                onChange={(e) => SetDueDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Select
                value={Priority}
                onChange={handlePriorityChange}
                options={Priorities.map((priority) => ({
                  label: priority,
                  value: priority,
                }))}
                placeholder="Select Priority"
                required
              />
            </Form.Group>

            <Modal.Footer className="mt-3">
              <Button variant="primary" type="submit">
                {currentTask ? "Update Task" : "Add Task"}
              </Button>
              <Button variant="secondary" onClick={handleCloseMainModal}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* <Button
        variant="primary"
        className="mx-2"
        onClick={handleShowEmployeeModal}
      >
        Add Employee Task
      </Button> */}

      <Modal show={showEmployeeModal} onHide={handleCloseEmployeeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentEmpTask ? "Edit Employee Task" : "Add Employee Task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit1}>
            <Form.Group>
              <Form.Label>Time In</Form.Label>
              <Form.Control
                type="time"
                value={TimeIn}
                onChange={(e) => SetTimeIn(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Freight Charges</Form.Label>
              <Form.Control
                type="number"
                value={FreightCharges}
                onChange={(e) => SetFreightCharges(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time Out</Form.Label>
              <Form.Control
                type="time"
                value={TimeOut}
                onChange={(e) => SetTimeOut(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nature of Work</Form.Label>
              <Form.Control
                type="text"
                value={NatureOfWork}
                onChange={(e) => SetNatureofWork(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Used Items</Form.Label>
              <Form.Control
                type="text"
                value={UsedItems}
                onChange={(e) => SetUsedItems(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Returned Itmes</Form.Label>
              <Form.Control
                type="text"
                value={ReturnedItems}
                onChange={(e) => SetReturnedItems(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Additional Task</Form.Label>
              <Form.Select
                value={AdditionalTask}
                onChange={(e) => SetAdditionalTasks(e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Select
                value={REMARKS}
                onChange={(e) => SetRemarks(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="On-Progress">On-Progress</option>
                <option value="Pratially Completed">Pratially Completed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
                <option value="ReOpened">ReOpened</option>
              </Form.Select>
            </Form.Group>

            <Modal.Footer className="mt-3">
              <Button variant="primary" type="submit">
                {currentEmpTask ? "Update Employee Task" : "Add Employee Task"}
              </Button>
              <Button variant="secondary" onClick={handleCloseEmployeeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TaskModel;
