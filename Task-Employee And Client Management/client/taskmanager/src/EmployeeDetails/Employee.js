import React, { useState, useEffect } from "react";
import EmployeeModal from "./EmployeeModal";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  fetchemployee,
  addEmployee as addEmployeeAction,
  deleteEmployee as deleteEmployeeAction,
  updateEmployee as updateEmployeeAction,
} from "../features/EmployeeSlicer";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Paginator } from "primereact/paginator";
import "bootstrap/dist/css/bootstrap.min.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
function Employee() {
  //const [employees, setEmployees] = useState([]);
  const [currentEmployee, SetCurrentEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees);
  const role = localStorage.getItem("role");
  useEffect(() => {
    dispatch(fetchemployee());
  }, []);
  const addEmployee = async (newEmployee) => {
    try {
      const response = await fetch("http://localhost:8000/account/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server Error:", errorText);
        return;
      }

      const data = await response.json();
      dispatch(addEmployeeAction(data));
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (pk) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/employees/${pk}/ `,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server Error:", errorText);
        return;
      }
      dispatch(deleteEmployeeAction(pk));
    } catch (err) {
      console.log(err);
    }
  };
  const updateEmployee = async (pk, updatedData) => {
    if (currentEmployee) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/employees/${pk}/`,
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
        console.log(data);
        dispatch(updateEmployeeAction(data));
      } catch (err) {
        console.log(err);
      }

      SetCurrentEmployee(null);
    }
  };
  const handleEdit = (employee) => {
    //console.log("employee == ", employee);
    //console.log("currentEmployeeId == ", employee.id);
    SetCurrentEmployee(employee);
    setShowModal(true);
  };
  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  //console.log(employees);
  return (
    <div className="container">
      <div className="header d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h1 className="col mb-3 mb-md-0">Employee Details</h1>
        <div className="d-flex">
          <Link to="/Customer" className="btn btn-secondary mx-2">
            CustomerPage
          </Link>
          <Link to="/Task" className="btn btn-primary">
            TaskPage
          </Link>
        </div>
      </div>
      <div
        className="col mt-3"
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
        <EmployeeModal
          addEmployee={addEmployee}
          updateEmployee={updateEmployee}
          currentEmployee={currentEmployee}
          SetCurrentEmployee={SetCurrentEmployee}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
      <DataTable
        className="mt-3"
        filters={filter}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        totalRecords={employees.data.length}
        value={employees.data.map((employee, index) => ({
          ...employee,
          SNO: index + 1,
        }))}
      >
        <Column field="SNO" header="#" />
        <Column field="username" header="Name" sortable />
        <Column field="ROLES" header="Designation" />
        <Column field="Mobile_No" header="Mobile No." />
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
        />
      </DataTable>
    </div>
  );
}

export default Employee;
