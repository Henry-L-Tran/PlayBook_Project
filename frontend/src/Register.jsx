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
    balance: 0,
    payment_info: {
      credit_card: false,
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
      balance: registerData.balance,
      payment_info: {
        credit_card: registerData.payment_info.credit_card ?? false,
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

  const handleNextStep = (e) => {
    e.preventDefault();

    if (step === 1 && (!registerData.first_name || !registerData.last_name)) {
    alert("Please enter your First and Last Name");
    return;
  }
  if (step === 2 && !registerData.email) {
    alert("Please enter your Email");
    return;
  }
  if (step === 3 && (!registerData.password || registerData.password !== registerData.confirm_password)) {
    alert("Passwords do not match!");
    return;
  }

  // Move to the next step
  setStep((prevStep) => prevStep + 1);

  // Scroll smoothly to the next section
  setTimeout(() => {
    sectionRefs[step]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

  

  return (
    <div className="register-container">
      <h1>PlayBook</h1>
      <form className="form-container-name" onSubmit={handleRegister}>
        <h2>Enter Your Full Name</h2>
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

        <div className="buttons">
          <button type="button" className="back-button">Back</button>
          <button type="button" className="next-button">Next</button>
        </div>
      </form>
      <form className="form-container-email" onSubmit={handleRegister}>  
        <h3>Enter Your Email</h3>
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

        <div className="buttons">
          <button type="button" className="back-button">Back</button>
          <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
        </div>
      </form>
      <form className="form-container-password" onSubmit={handleRegister}>
        <h4>Enter Your Password</h4>
        <div className="password">
          <label>Password</label>
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

        <div className="buttons">
          <button type="button" className="back-button">Back</button>
          <button type="button" className="next-button" onClick={handleNextStep}>Next</button>
        </div>
      </form>
      <form className="form-container-address-dob" onSubmit={handleRegister}>
        <h5>Enter Your Address & Date of Birth</h5>
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
        
        <div className="buttons">
          <button type="button" className="back-button">Back</button>
        </div>
        <button type="submit" className="create-account-button">Create Account</button>

      </form>
    </div>
  );
}

export default Register;

