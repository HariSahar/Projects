import React, { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAuthenticated } from "../Auth/Authenticate";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../features/LoginSlicer";
function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("role");
  const { data } = useSelector((state) => state.login);
  // console.log("login", data.ROLES);

  let userRole;

  if (data?.ROLES === "Admin") {
    userRole = "Admin";
  } else if (data?.ROLES === "Manager") {
    userRole = "Manager";
  } else if (data?.ROLES === "Camera Technician") {
    userRole = "Camera Technician";
  } else if (data?.ROLES === "Computer Technician") {
    userRole = "Computer Technician";
  } else if (data?.ROLES === "Front Desk Representative") {
    userRole = "Front Desk Representative";
  }
  if (userRole) {
    localStorage.setItem("role", userRole);
  } else if (storedRole) {
    userRole = storedRole;
  } else {
    userRole = "Unknown Role";
  }

  const handleLogout = async () => {
    window.alert("Are you sure you want to logout?");
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post("http://localhost:8000/account/logout/", {
          refresh: refreshToken,
        });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");

    if (
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload"
    ) {
      const loginData = localStorage.getItem("loginData");
      if (loginData) {
        dispatch(login(JSON.parse(loginData)));
      }
    }
  }, [dispatch]);
  return (
    <>
      {isAuthenticated() ? (
        <div>
          <header className="d-flex justify-content-between align-items-center p-3 bg-light">
            <h1>Welcome</h1>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </header>
          <Outlet />
        </div>
      ) : (
        <div>
          <header className="d-flex justify-content-between align-items-center p-3 bg-light">
            <h1>Welcome</h1>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </header>
          <Outlet />
        </div>
      )}
    </>
  );
}

export default Layout;
