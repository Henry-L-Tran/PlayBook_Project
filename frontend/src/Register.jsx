import { useState, useEffect } from 'react'
import './Register.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function Register() {
  const [message, setMessage] = useState(0);
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    birthday: "",
    payment_info: {
      credit_card: false,
      bank_account: false,
    card_type: "",
    card_number: "",
    expiration_date: "",
    cvv: "",
    }
  });

  const navigator = useNavigate();

  useEffect(() => {
    const backendCheck = async () => {
      try {
        const response = await fetch('http://localhost:8000/check');
        const data = await response.json();
        setMessage(data.status);
      }
      catch (error) {
        console.error("Backend Check Failed: ", error);
      }
    };

    backendCheck();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const requestBody = {
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      email: registerData.email,
      password: registerData.password,
      address: registerData.address,
      birthday: registerData.birthday,
      payment_info: {
        credit_card: registerData.payment_info.credit_card ?? false,
        bank_account: registerData.bank_account ?? false,
        card_type: registerData.card_type ?? "",
        card_number: registerData.card_number ?? "",
        expiration_date: registerData.expiration_date ?? "",
        cvv: registerData.cvv ?? "",
      }
    };

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      /*If the Server Status is 200, It'll Bring the User to the Login Page*/
      if(response.status === 200) {
        console.log("Registration Successful");
        navigator('/login');
      }
      else {
        console.log("Registration Failed");
      }
    }
    catch (error) {
      console.error("Registration Failed: ", error);
    }
  }

  const handleUserInput = (e) => {
    const {name, value} = e.target;
    setRegisterData({ ...registerData, [name]: value});
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div className="first-name">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={registerData.first_name}
            onChange={handleUserInput}
            required
          />  
        </div>

        <div className="last-name">
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={registerData.last_name}
          onChange={handleUserInput}
          required
        />
        </div>
        
        <div className="email">
          <label>Email</label>
          <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerData.email}
          onChange={handleUserInput}
          required
        />  
        </div>

        <div className="password">
          <label>password</label>
          <input
          type="password"
          name="password"
          placeholder="Password"
          value={registerData.password}
          onChange={handleUserInput}
          required
        />
        </div>

        <div className="confirm-password">
          <label>Confirm-Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="address">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={registerData.address}
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="birthday">
          <label>Date of Birth</label>
          <input
          type="date"
          name="birthday"
          placeholder="Birthday"
          value={registerData.birthday}
          onChange={handleUserInput}
          required
        />
        </div>
        
        <div className="create-account-button"><button type="submit">Create Account</button></div>
        

      </form>
    </div>
  );
}

export default Register;

