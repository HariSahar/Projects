import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function TaskInfoModal({
  showModal,
  setShowModal,
  addEmpTask,
  selectedElement,
  task,
  handleFormSubmit,
  CurrentEmpTask,
  SetCurrentEmpTask,
  updateEmpTask,
}) {
  const [TimeIn, setTimeIn] = useState("");
  const [FreightCharges, setFreightCharges] = useState("");
  const [TimeOut, setTimeOut] = useState("");
  const [NatureOfWork, setNatureOfWork] = useState("");
  const [UsedItems, setUsedItems] = useState("");
  const [ReturnedItems, setReturnedItems] = useState("");
  const [AdditionalTask, setAdditionalTask] = useState("No");
  const [REMARKS, setRemarks] = useState("Pending");
  const handleClose = () => {
    setTimeIn("");
    setFreightCharges("");
    setTimeOut("");
    setNatureOfWork("");
    setUsedItems("");
    setReturnedItems("");
    setAdditionalTask("No");
    setRemarks("Pending");
    setShowModal(false);
    SetCurrentEmpTask(null);
  };
  const userId = (element) => {
    // if (typeof element === "number") {
    const empList = JSON.parse(localStorage.getItem("empName"));
    const user = empList.find((user) => user.username === element);
    return user ? user.id : element;
    // }

    // return element;
  };

  useEffect(() => {
    if (CurrentEmpTask) {
      setTimeIn(CurrentEmpTask.TimeIn);
      setFreightCharges(CurrentEmpTask.FreightCharges);
      setTimeOut(CurrentEmpTask.TimeOut);
      setNatureOfWork(CurrentEmpTask.NatureOfWork);
      setUsedItems(CurrentEmpTask.UsedItems);
      setReturnedItems(CurrentEmpTask.ReturnedItems);
      setAdditionalTask(CurrentEmpTask.AdditionalTask);
      setRemarks(CurrentEmpTask.REMARKS);
    } else {
      setTimeIn("");
      setFreightCharges("");
      setTimeOut("");
      setNatureOfWork("");
      setUsedItems("");
      setReturnedItems("");
      setAdditionalTask("No");
      setRemarks("Pending");
    }
  }, [CurrentEmpTask, showModal]);
  console.log("CurrentEmpTask", CurrentEmpTask);

  const handleSubmit = (e) => {
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
    if (CurrentEmpTask) {
      updateEmpTask(
        newEmpTaskInfo,
        CurrentEmpTask.task,
        userId(selectedElement)
      );
      console.log(updateEmpTask, selectedElement);
    } else {
      addEmpTask(newEmpTaskInfo, task.id, userId(selectedElement));
      console.log("task", task.id);
      handleFormSubmit();
      // console.log("taskId ===", task);
    }
    handleClose();
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{"Update Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Time In</Form.Label>
              <Form.Control
                type="time"
                value={TimeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Freight Charges</Form.Label>
              <Form.Control
                type="number"
                value={FreightCharges}
                onChange={(e) => setFreightCharges(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time Out</Form.Label>
              <Form.Control
                type="time"
                value={TimeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nature of Work</Form.Label>
              <Form.Control
                type="text"
                value={NatureOfWork}
                onChange={(e) => setNatureOfWork(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Used Items</Form.Label>
              <Form.Control
                type="text"
                value={UsedItems}
                onChange={(e) => setUsedItems(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Returned Items</Form.Label>
              <Form.Control
                type="text"
                value={ReturnedItems}
                onChange={(e) => setReturnedItems(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Additional Task</Form.Label>
              <Form.Select
                value={AdditionalTask}
                onChange={(e) => setAdditionalTask(e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Remarks</Form.Label>
              <Form.Select
                value={REMARKS}
                onChange={(e) => setRemarks(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="On-Progress">On-Progress</option>
                <option value="Partially Completed">Partially Completed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Hold">On Hold</option>
                <option value="Closed">Closed</option>
                <option value="ReOpened">ReOpened</option>
              </Form.Select>
            </Form.Group>

            <Modal.Footer className="mt-3">
              <Button variant="primary" type="submit">
                Update
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TaskInfoModal;
