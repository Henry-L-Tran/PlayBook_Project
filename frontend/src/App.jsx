import { useState, useEffect } from 'react'
import './App.css'
import Register from './Register.jsx'

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
      <div>
        <Register />
      </div>
  )
}

export default App
