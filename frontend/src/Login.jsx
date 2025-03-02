import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
// import "./index.css";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("currUser", data.user.email);
        console.log("Login Successful, User:", data.user.email);
        navigate("/home");
      } else {
        console.log("Login Failed");
      }
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  return (
    <Box className="flex items-center justify-center ">
      <Card className="w-96 shadow-lg" variant="outlined">
        <CardContent>
          <Typography variant="h5" className="text-black text-center mb-4">
            Login
          </Typography>
          <form onSubmit={handleLogin} className="space-y-4">
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              fullWidth
              value={loginData.email}
              onChange={handleUserInput}
              InputLabelProps={{ className: "text-gray-300" }}
              InputProps={{ className: "text-white" }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              fullWidth
              value={loginData.password}
              onChange={handleUserInput}
              InputLabelProps={{ className: "text-gray-300" }}
              InputProps={{ className: "text-white" }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-500 hover:bg-blue-600"
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              fullWidth
              className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
