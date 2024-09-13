import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import CustomerModal from "./CustomerModal";
import { Link } from "react-router-dom";
import {
  fetchcustomer,
  addCustomer as addCustomerAction,
  deleteCustomer as deleteCustomerAction,
  updateCustomer as updateCustomerAction,
} from "../features/CustomerSlicer";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Paginator } from "primereact/paginator";

function Customer() {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.data);
  const [ShowModal, setShowModal] = useState(false);
  const [currentCustomer, SetCurrentCustomer] = useState(null);

  useEffect(() => {
    dispatch(fetchcustomer());
  }, [dispatch]);

  const addCustomer = async (newCustomer) => {
    try {
      const response = await fetch(
        "http://localhost:8000/CustomerApi/customer/addcustomer/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server Error:", errorText);
        return;
      }

      const data = await response.json();
      dispatch(addCustomerAction(data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (pk) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/CustomerApi/customer/${pk}/`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.log("Server Error:", errorText);
          return;
        }

        dispatch(deleteCustomerAction(pk));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateCustomer = async (pk, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/CustomerApi/customer/${pk}/`,
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
      dispatch(updateCustomerAction(data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (customer) => {
    SetCurrentCustomer(customer);
    setShowModal(true);
  };
  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const role = localStorage.getItem("role");

  return (
    <div className="container">
      <div className="header d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h1 className="col mb-3 mb-md-0">Customer Details</h1>
        <div className="d-flex">
          <Link to="/Task" className="btn btn-primary mx-2">
            TaskPage
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
          placeholder="Search"
          onInput={(e) =>
            setFilter({
              global: {
                value: e.target.value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            })
          }
        />
        <CustomerModal
          addCustomer={addCustomer}
          updateCustomer={updateCustomer}
          currentCustomer={currentCustomer}
          SetCurrentCustomer={SetCurrentCustomer}
          ShowModal={ShowModal}
          setShowModal={setShowModal}
        />
      </div>
      {/* <Table className="table table-striped table-hover mt-5">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Organisation Name</th>
            <th>Address</th>
            <th>Mobile No.</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers && customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.CustomerName}</td>
                <td>{customer.OrganisationName}</td>
                <td>{customer.Address}</td>
                <td>{customer.MobileNo}</td>
                <td>
                  <Button
                    variant="secondary mx-2"
                    onClick={() => handleEdit(customer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No customers available.
              </td>
            </tr>
          )}
        </tbody>
      </Table> */}
      <DataTable
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        totalRecords={customers.length}
        filters={filter}
        className="mt-2"
        value={customers.map((customer, index) => ({
          ...customer,
          SNO: index + 1,
        }))}
      >
        <Column field="SNO" header="#" />
        <Column field="CustomerName" header="Customer Name" sortable />
        <Column field="OrganisationName" header="Organisation Name" sortable />
        <Column field="Address" header="Address" />
        <Column field="MobileNo" header="Mobile No." />
        <Column
          header="Actions"
          body={(rowData) => (
            <div>
              <Button
                variant="secondary mx-2"
                onClick={() => handleEdit(rowData)}
              >
                Edit
              </Button>
              {role === "Computer Technician" ||
              role === "Camera Technician" ? null : (
                <Button
                  variant="danger"
                  onClick={() => handleDelete(rowData.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
          bodyStyle={{ textAlign: "center", verticalAlign: "middle" }}
        />
      </DataTable>
    </div>
  );
}

export default Customer;
