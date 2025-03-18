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
    <Box className="flex items-center flex-col justify-center min-h-screen"
      sx={{
        width: "100vw",
        height: "auto",
        display: "flex",
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflowY: "auto",
        overflowX: "hidden",
      }}>
      
      <img
        src="/images/logo.png"
        alt="PlayBook Logo"
        style={{
          width: "110px", 
          height: "110px",
          alignSelf: "center",
          marginTop: "5rem",
          marginBottom: "6rem",
        }}
      />

      <Card 
        className="w-full sm:w-3/5" 
        variant="outlined"
        sx={{
          width: "500px",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          marginTop: "-3rem",
          paddingBottom: "5rem",
        }}
        >
        <CardContent className="border-3 border-white rounded-md">
          <Typography
            className="text-center py-8 text-white"
            fontWeight={"600"}
            fontSize={"4rem"}
            fontFamily={"monospace"}
          >
            PlayBook
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
              sx={{ 
                marginBottom: "2rem",
                "& label.Mui-focused": { color: "white" },
                "& input": { color: "white" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "gray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" }, 
               },
              }}
            />
            <TextField
              label="Last Name"
              name="last_name"
              fullWidth
              value={registerData.last_name}
              onChange={handleUserInput}
              sx={{ 
                marginBottom: "2rem",
                "& label.Mui-focused": { color: "white" },
                "& input": { color: "white" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "gray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" }, 
               },
              }}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              value={registerData.email}
              onChange={handleUserInput}
              sx={{ 
                marginBottom: "2rem",
                "& label.Mui-focused": { color: "white" },
                "& input": { color: "white" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "gray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" }, 
               },
              }}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              value={registerData.password}
              onChange={handleUserInput}
              sx={{ 
                marginBottom: "2rem",
                "& label.Mui-focused": { color: "white" },
                "& input": { color: "white" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "gray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" }, 
               },
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              name="confirm_password"
              fullWidth
              value={registerData.confirm_password}
              onChange={handleUserInput}
              sx={{ 
                marginBottom: "2rem",
                "& label.Mui-focused": { color: "white" },
                "& input": { color: "white" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "gray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" }, 
               },
              }}
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={registerData.address}
              onChange={handleUserInput}
              sx={{ 
                marginBottom: "2rem",
                "& label.Mui-focused": { color: "white" },
                "& input": { color: "white" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "gray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" }, 
               },
              }}
            />
            <TextField
              label="Date of Birth"
              type="date"
              name="birthday"
              fullWidth
              value={registerData.birthday}
              onChange={handleUserInput}
              InputLabelProps={{ shrink: true }}
              sx={{ 
                marginBottom: "2rem",
                "& label.Mui-focused": { color: "white" },
                "& input": { color: "white" }, 
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" }, 
                  "&:hover fieldset": { borderColor: "gray" }, 
                  "&.Mui-focused fieldset": { borderColor: "white" }, 
               },
              }}
            />
            <div className="flex flex-col gap-4 mb-4">
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                    borderColor: "white",
                  },
                }}
              >
                Register
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                    borderColor: "white",
                  },
                }}
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
