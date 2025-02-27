import { useState, useEffect } from 'react'
import './App.css'

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
      const data = await response.json();
      console.log("Response Data:", data);
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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={registerData.first_name}
          onChange={handleUserInput}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={registerData.last_name}
          onChange={handleUserInput}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerData.email}
          onChange={handleUserInput}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={registerData.password}
          onChange={handleUserInput}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={registerData.address}
          onChange={handleUserInput}
          required
        />
        <input
          type="date"
          name="birthday"
          placeholder="Birthday"
          value={registerData.birthday}
          onChange={handleUserInput}
          required
        />

        <button type="submit">Create Account</button>

      </form>
    </div>
  );
}

export default Register;

