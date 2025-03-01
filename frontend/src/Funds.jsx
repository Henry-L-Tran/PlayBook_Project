import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function Funds() {

    const [user, setUser] = useState(null)
    const [currTab, setCurrTab] = useState("card-info")
    const [amount, setAmount] = useState("")
    const [card, setCard] = useState("")
    const navigator = useNavigate()


    useEffect(() => {
        getUserData();
    }, []);


    const getUserData = async () => {
        const currUser = localStorage.getItem("currUser");
    
        if (!currUser) {
            console.error("No User Logged In");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8000/funds/user/${currUser}`);
            const data = await response.json();
            setUser(data);
        } 
        
        catch (error) {
            console.error("Error Fetching User Data", error);
        }
    }

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
          ...prevUser,
          payment_info: { ...prevUser.payment_info, [name]: value },
        }))
    }

    const saveCardInfo = async () => {

        if(!user) {
            console.error("User Data Not Available")
            return;
        }

        const requestInfo = {
            email: user.email,
            card_type: user.payment_info.card_type,
            card_number: user.payment_info.card_number,
            expiration_date: user.payment_info.expiration_date,
            cvv: user.payment_info.cvv
        }

        try {
            const response = await fetch("http://localhost:8000/funds/add_card_info", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestInfo),
            })
    
            if(response.status === 200) {
                alert("Card Information Saved")
                getUserData()
            }
            else {
                alert("Failed to Save Card Information")
            }
        }
    
        catch (error) {
            console.error("Error Adding Card Information:", error)
        }
    }


    const userTransactions = async (type) => {
        if(!user) {
            console.error("Error Loading User Data")
            return
        }


        const requestInfo = {
            email: user.email,
            amount: amount,
            card_number: card
        }

        try {
            const response = await fetch(`http://localhost:8000/funds/${type}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestInfo)

            })

            const data = await response.json()
            if(response.status == 200) {
                alert(data.message)
                getUserData()
            }
            else {
                alert("Transction Failed")
            }
        }

        catch (error) {
            console.error(`${type} Failed:`, error)
        }
    }

    const handleUserLogout = () => {
        localStorage.removeItem("currUser")
        console.log("User Sucessfully Logged Out")
        navigator("/login")
    }


    return (
        <div>

            <button onClick={handleUserLogout}>Logout</button> 
            <h1>Funds</h1>
            <p>Balance: ${user?.balance || 0}</p>

            <div>
                <button onClick={() => setCurrTab("card-info")}>Card Information</button>
                <button onClick={() => setCurrTab("deposit")}>Deposit</button>
                <button onClick={() => setCurrTab("withdraw")}>Withdraw</button>
            </div>

            {currTab === "card-info" && (
                <div>
                    <h2>Payment Information</h2>
                    <input 
                        type="text" 
                        name="card_type" 
                        placeholder="Card Type" 
                        value={user?.payment_info?.card_type || ""} 
                        onChange={handleUserInput}
                    />

                    <input 
                        type="text" 
                        name="card_number" 
                        placeholder="Card Number" 
                        value={user?.payment_info?.card_number || ""} 
                        onChange={handleUserInput} 
                    />

                    <input
                        type="text" 
                        name="expiration_date" 
                        placeholder="Expiration Date" 
                        value={user?.payment_info?.expiration_date || ""} 
                        onChange={handleUserInput} 
                    />

                    <input 
                        type="text" 
                        name="cvv" 
                        placeholder="CVV" 
                        value={user?.payment_info?.cvv || ""} 
                        onChange={handleUserInput} 
                    />

                    <button onClick={saveCardInfo}>Save Card</button>
                </div>
            )}

            {currTab === "deposit" && user?.payment_info?.card_number && (
                    <div>
                    <h2>Deposit Funds</h2>

                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                    />

                    <select 
                        value={card} 
                        onChange={(e) => setCard(e.target.value)}>
                        <option value="">Select a Card</option>
                        <option value={user.payment_info.card_number}>
                            {user.payment_info.card_type} - {user.payment_info.card_number.slice(-4)}
                        </option>
                    </select>

                    <button onClick={() => userTransactions("deposit")}>Confirm</button>
                    </div>
            )}

                {currTab === "withdraw" && user?.payment_info?.card_number && (
                    <div>
                    <h2>Withdraw Funds</h2>

                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                    />

                    <select 
                        value={card} 
                        onChange={(e) => setCard(e.target.value)}>
                        <option value="">Select a Card</option>
                        <option value={user.payment_info.card_number}>
                            {user.payment_info.card_type} - {user.payment_info.card_number.slice(-4)}
                        </option>
                    </select>
                    
                    <button onClick={() => userTransactions("withdraw")}>Confirm</button>
                    </div>
            )} 

        </div>
    )
}

export default Funds