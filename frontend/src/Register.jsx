import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

function Register() {
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    birthday: "",
    balance: 0,
    payment_info: {
      credit_card: false,
      card_type: "",
      card_number: "",
      expiration_date: "",
      cvv: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const backendCheck = async () => {
      try {
        const response = await fetch("http://localhost:8000/check");
        const data = await response.json();
        console.log("Backend status:", data.status);
      } catch (error) {
        console.error("Backend Check Failed:", error);
      }
    };
    backendCheck();
  }, []);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (response.status === 200) {
        console.log("Registration Successful");
        navigate("/login");
      } else {
        console.log("Registration Failed");
      }
    } catch (error) {
      console.error("Registration Failed:", error);
    }
  };

  return (
    <Box className="flex items-center flex-col justify-center">
      <Typography
        fontSize={"4rem"}
        fontWeight={"bold"}
        className="top-0 py-12 sticky text-blue-300"
      >
        Welcome to PlayBook
      </Typography>
      <Card className="w-full sm:w-3/5" variant="outlined">
        <CardContent className="border-3 border-blue-300 rounded-md">
          <Typography
            className="text-center py-8 text-blue-300"
            fontWeight={"600"}
            fontSize={"2rem"}
          >
            Register for PlayBook
          </Typography>
          <form
            onSubmit={handleRegister}
            className="space-y-4 px-2 flex flex-col gap-4"
          >
            <TextField
              label="First Name"
              name="first_name"
              fullWidth
              value={registerData.first_name}
              onChange={handleUserInput}
            />
            <TextField
              label="Last Name"
              name="last_name"
              fullWidth
              value={registerData.last_name}
              onChange={handleUserInput}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              value={registerData.email}
              onChange={handleUserInput}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              value={registerData.password}
              onChange={handleUserInput}
            />
            <TextField
              label="Confirm Password"
              type="password"
              name="confirm_password"
              fullWidth
              value={registerData.confirm_password}
              onChange={handleUserInput}
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={registerData.address}
              onChange={handleUserInput}
            />
            <TextField
              label="Date of Birth"
              type="date"
              name="birthday"
              fullWidth
              value={registerData.birthday}
              onChange={handleUserInput}
              InputLabelProps={{ shrink: true }}
            />
            <div className="flex flex-col gap-4 mb-4">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="bg-blue-500 hover:bg-blue-600"
              >
                Register
              </Button>
              <Button
                variant="outlined"
                fullWidth
                className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
