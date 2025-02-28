import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'

function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    
    const navigator = useNavigate()

    const handleUserInput = (e) => {
        const {name, value} = e.target;
        setLoginData({ ...loginData, [name]: value});
      }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });
            
            if(response.status === 200) {
                console.log("Login Successful");
                navigator('/home');
            }
            else {
                console.log("Login Failed");
            }
        }

        catch (error) {
            console.error("Login Failed: ", error);
        }
    };


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className ="email">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={handleUserInput}
                    />
                </div>

                <div className="password">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleUserInput}
                    />
                </div>

                <div className="login-button">
                    <button type="submit">Sign In</button>
                </div>

                <div className="register-button">
                    <button type="button" onClick={() => navigator("/register")}>Register</button>
                </div>

                
            </form>
        </div>
    )
}

export default Login