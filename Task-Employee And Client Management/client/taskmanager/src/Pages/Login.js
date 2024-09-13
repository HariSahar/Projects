import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../features/LoginSlicer";
import { useDispatch } from "react-redux";
import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const [formdata, setformdata] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [Success, SetSuccess] = useState(false);
  const [Error, SetError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/account/login/",
        formdata
      );
      if (res.status === 200) {
        console.log("Login Success!", res.data);
        SetSuccess("Logged in Successfully");
        localStorage.setItem("accessToken", res.data.tokens.access);
        localStorage.setItem("refreshToken", res.data.tokens.refresh);
        localStorage.setItem("loginData", JSON.stringify(res.data));
        setIsLoading(false);
        navigate("/");
        dispatch(login(res.data));
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        SetError("Invalid username or password");
      } else {
        SetError("Invalid username or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setformdata({
      username: "",
      password: "",
    });
    SetError(false);
    SetSuccess(false);
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your login and password!
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        name="username"
                        value={formdata.username}
                        onChange={handleChange}
                        placeholder="Username"
                      />
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        name="password"
                        value={formdata.password}
                        onChange={handleChange}
                        placeholder="Password"
                      />
                    </div>

                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </button>
                  </form>

                  {Error && (
                    <p style={{ color: "red", marginTop: "10px" }}>{Error}</p>
                  )}
                  {Success && (
                    <p style={{ color: "green", marginTop: "10px" }}>
                      {Success}
                    </p>
                  )}

                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white">
                      <i className="fab fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-google fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
