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
    <Box
      className="flex items-center flex-col justify-center min-h-screen"
      sx={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflowY: "auto",
      }}
    >
      <img
        src="/images/logo.png"
        alt="PlayBook Logo"
        style={{
          width: "110px",
          height: "110px",
          alignSelf: "center",
          marginBottom: "6rem",
        }}
      />

      <Card
        className="w-full sm:w-3/5 "
        variant="outlined"
        sx={{
          width: "36rem",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          marginTop: "-4rem",
        }}
      >
        <CardContent className=" border-3 border-white rounded-md">
          <Typography
            className="text-center py-8 text-white"
            fontWeight={"600"}
            fontSize={"4rem"}
            fontFamily={"monospace"}
          >
            PlayBook
          </Typography>
          <form onSubmit={handleLogin} className="space-y-4 px-2">
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              value={loginData.email}
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
              value={loginData.password}
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
                Sign In
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
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
