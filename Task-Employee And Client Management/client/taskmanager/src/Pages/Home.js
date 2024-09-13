import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
//import { useSelector } from "react-redux";
// import { SelectUserRole } from "../features/LoginSlicer";
export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const { data } = await axios.get(
            "http://localhost:8000/account/user/",
            config
          );
          setUsername(data.username);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUsername("");
        }
      } catch (err) {
        console.log(err);
        setIsLoggedIn(false);
        setUsername("");
      }
    };
    checkLoggedInUser();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post("http://localhost:8000/account/logout/", {
          refresh: refreshToken,
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        setUsername("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Welcome {username}</h1>
          <p>Designation: {localStorage.getItem("role")}</p>
          <Button className="btn btn-primary mx-2" as={Link} to="/Task">
            Task
          </Button>
          {/* <Button onClick={handleLogout}>Logout</Button> */}
        </div>
      ) : (
        <h1>Please Login</h1>
      )}
    </div>
  );
}
