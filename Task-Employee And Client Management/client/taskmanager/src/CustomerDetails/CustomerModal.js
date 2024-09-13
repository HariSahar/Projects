import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

function CustomerModal({
  addCustomer,
  updateCustomer,
  currentCustomer,
  ShowModal,
  setShowModal,
  SetCurrentCustomer,
}) {
  const [customername, setcustomername] = useState("");
  const [organisationName, setOrganisationName] = useState("");
  const [address, setaddress] = useState("");
  const [mobilenumber, setmobilenumber] = useState("");

  useEffect(() => {
    if (currentCustomer) {
      setOrganisationName(currentCustomer.OrganisationName);
      setcustomername(currentCustomer.CustomerName);
      setaddress(currentCustomer.Address);
      setmobilenumber(currentCustomer.MobileNo);
    } else {
      clearForm();
    }
  }, [currentCustomer]);

  const clearForm = () => {
    setOrganisationName("");
    setcustomername("");
    setaddress("");
    setmobilenumber("");
  };

  const handleClose = () => {
    clearForm();
    setShowModal(false);
    SetCurrentCustomer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const CustomerData = {
      CustomerName: customername,
      OrganisationName: organisationName,
      Address: address,
      MobileNo: mobilenumber,
    };

    if (currentCustomer) {
      updateCustomer(currentCustomer.id, CustomerData);
    } else {
      addCustomer(CustomerData);
    }

    handleClose(); // Close modal after submission
  };

  return (
    <>
      <Button
        variant="primary"
        className="mt-2"
        onClick={() => {
          setShowModal(true);
          SetCurrentCustomer(null);
        }}
      >
        {"Add Customer"}
      </Button>

      <Modal
        show={ShowModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCustomer ? "Edit Customer" : "Add Customer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              placeholder="Customer Name"
              value={customername}
              onChange={(e) => setcustomername(e.target.value)}
              required
              className="mb-3"
            />
            <Form.Control
              placeholder="Organisation Name"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              required
              className="mb-3"
            />

            <Form.Control
              placeholder="Address"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              required
              className="mb-3"
            />

            <Form.Control
              placeholder="Mobile Number"
              value={mobilenumber}
              onChange={(e) => setmobilenumber(e.target.value)}
              required
              className="mb-3"
            />

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                {currentCustomer ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomerModal;
