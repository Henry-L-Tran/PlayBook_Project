import { useState, useEffect } from 'react'
import './App.css'
import Register from './Register.jsx'
import Login from './Login.jsx'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function App() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const backendCheck = async () => {
      const response = await fetch("http://localhost:8000/check");
      const data = await response.json();
      setMessage(data.status);
    };

    backendCheck();
    }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
