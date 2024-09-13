import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";

export default function EmployeeModal({
  addEmployee,
  updateEmployee,
  currentEmployee,
  setShowModal,
  showModal,
  SetCurrentEmployee,
}) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [Password1, setPassword1] = useState("");
  const [Password2, setPassword2] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (currentEmployee) {
      setName(currentEmployee.username);
      setDesignation(currentEmployee.ROLES);
      setMobileNumber(currentEmployee.Mobile_No);
      setEmail(currentEmployee.email);
      setPassword1(currentEmployee.password1);
      setPassword2(currentEmployee.password2);
    } else {
      setName("");
      setDesignation("");
      setMobileNumber("");
      setEmail("");
      setPassword1("");
      setPassword2("");
    }
  }, [currentEmployee, showModal]);

  // useEffect(() => {
  //   if (currentEmployee == null) {
  //     return;
  //   }
  //   console.log(currentEmployee.id);
  // }, [currentEmployee]);

  const handleClose = () => {
    setShowModal(false);
    SetCurrentEmployee(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const employeeData = {
      username: name,
      ROLES: designation,
      Mobile_No: mobileNumber,
      email: Email,
      password1: Password1,
      password2: Password2,
    };
    if (currentEmployee) {
      updateEmployee(currentEmployee.id, employeeData);
    } else {
      addEmployee(employeeData);
    }

    handleClose();
  };

  return (
    <>
      {role === "Computer Technician" || role === "Camera Technician" ? null : (
        <Button
          variant="primary"
          className="mt-2"
          onClick={() => {
            setShowModal(true);
            SetCurrentEmployee(null);
          }}
        >
          {"Add Employee"}
        </Button>
      )}
      <Modal
        key={currentEmployee ? currentEmployee.id : "new"}
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentEmployee ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                value={designation}
                as="select"
                onChange={(e) => setDesignation(e.target.value)}
                required
              >
                <option value="">Select a designation</option>
                <option value="Manager">Manager</option>
                <option value="Camera Technician">Camera Technician</option>
                <option value="Computer Technician">Computer Technician</option>
                {/* <option value="Admin">Admin</option> */}
                <option value="Front Desk Representative">
                  Front Desk Representative
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={Password1}
                onChange={(e) => setPassword1(e.target.value)}
                required={!currentEmployee}
              />
              {!currentEmployee && (
                <Form.Control.Feedback type="invalid">
                  Password is required
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password (confirm)</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password (confirm)"
                value={Password2}
                onChange={(e) => setPassword2(e.target.value)}
                required={!currentEmployee}
              />
              {!currentEmployee && (
                <Form.Control.Feedback type="invalid">
                  Password is required
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary mx-3" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                {currentEmployee ? "Update" : "Add"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
