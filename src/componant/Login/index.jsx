import { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { login } from "../Service/user-services";
import { dologin } from "../../auth";
import { useNavigate } from "react-router";


const Login = () => {
  const [formdata, setformdata] = useState({
    username: "",
    password: "",
  });
const navigate = useNavigate();

  const handlechange = async (event, field) => {
    event.preventDefault();

    let actualValue = event.target.value;

    setformdata({
      ...formdata,
      [field]: actualValue,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    // Validate input fields
    if (!formdata.username.trim() || !formdata.password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      login(formdata)
        .then((res) => {
          dologin(res);
          toast.success("login successfully...");
          navigate("/overview");
          
        })
        .catch((error) => {
          toast.error(error);
          
        });

      // Optionally, redirect or update app state here
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="loginpage">
      <form  onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={formdata.username}
            onChange={(e) => handlechange(e, "username")}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formdata.password}
            onChange={(e) => handlechange(e, "password")}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  );
};

export default Login;
