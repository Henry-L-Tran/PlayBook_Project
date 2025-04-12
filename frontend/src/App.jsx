import { useState, useEffect } from "react";
import "./App.css";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Funds from "./Funds.jsx";
import Promos from "./Promos.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {

  // State to Hold Messages From the Backend
  const [message, setMessage] = useState(null);

  // Dark Theme for MUI
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  // Check Backend Connection on App Load
  useEffect(() => {
    const backendCheck = async () => {
      const response = await fetch("http://localhost:8000/check");
      const data = await response.json();
      setMessage(data.status);
    };

    backendCheck();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>

      {/*Applies the Global Dark Theme*/}
      <CssBaseline />

      {/*React Router for Navigation to Different Pages*/}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
