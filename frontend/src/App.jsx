import { useState, useEffect } from "react";
import "./App.css";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Funds from "./Funds.jsx";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [message, setMessage] = useState(null);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

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
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          {/*<Route path="/lineups" element={<Lineups />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/social" element={<Social />} />*/}
          <Route path="/funds" element={<Funds />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
