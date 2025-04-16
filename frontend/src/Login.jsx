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
import CenteredModal from "./utilities/CenteredModal";

// Login Component for User Authentication
function Login() {
  // State to Track User Input for Email and Password
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // React Router Navigation
  const navigate = useNavigate();

  // Function to Handle User Input Changes for loginData
  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Function to Handle User Login on Form Submission
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
        localStorage.setItem("currUser", JSON.stringify(data.user));
        console.log("Login Successful, User:", data.user.email);
        navigate("/home");
      } else {
        setModalMessage("Login Failed: Incorrect email or password.");
        setIsModalOpen(true);
      }
    } catch (error) {
      setModalMessage("Login Failed: Server error or connection issue.");
      setIsModalOpen(true);
      console.error("Login Failed:", error);
    }
  };

  return (
    // Main Container for the Login Page (Entire Page)
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
        // Dark Layer Over Background Image
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflowY: "auto",
      }}
    >
      {/* Logo Image at the Top Left of the Login Page */}
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

      {/* Main Box Container for Login Form */}
      <Card
        className="w-full sm:w-3/5 "
        variant="outlined"
        sx={{
          width: "36rem",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          marginTop: "-4rem",
        }}
      >
        {/* Entire Box for Login Form */}
        <CardContent className=" border-3 border-white rounded-md">
          {/* PlayBook Text */}
          <Typography
            className="text-center py-8 text-white"
            fontWeight={"600"}
            fontSize={"4rem"}
            fontFamily={"monospace"}
          >
            PlayBook
          </Typography>

          {/* Login Form with Email and Password Fields */}
          <form onSubmit={handleLogin} className="space-y-4 px-2">
            {/* Email Input Field */}
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

            {/* Password Input Field */}
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

            {/* Container For Sign In Button and Register Button */}
            <div className="flex flex-col gap-4 mb-4">
              {/* Sign In Button */}
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

              {/* Register Button to Redirect to Registration Page */}
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
      <CenteredModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
        autoClose={true}
      />
    </Box>
  );
}

export default Login;
