import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Box, Typography } from "@mui/material"
import Header from './Header'

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
        <>
                <div className="font-mono mb-80">
                    {/* Logout Button */}
                    <button className="absolute top-30 right-12 px-4 py-2"
                        onClick={handleUserLogout}>Logout
                    </button> 

                    <h1 className="flex items-center flex-col justify-center font-mono">Funds</h1>

                        <p className="flex items-center flex-col justify-center mt-10 text-2xl font-mono">Balance: ${user?.balance || 0}</p>

                        <div className="flex flex-wrap justify-center mt-5 gap-3 font-mono">
                            <button onClick={() => setCurrTab("card-info")} className="w-98">Card Information</button>
                            <button onClick={() => setCurrTab("deposit")} className="w-98">Deposit</button>
                            <button onClick={() => setCurrTab("withdraw")} className="w-98">Withdraw</button>
                        </div>

                    <Box className="flex justify-center flex-col mt-10 p-25"
                        sx={{
                            width: "100%",
                            maxWidth: "100%",
                            height: "100%",
                            minHeight: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            borderRadius: "1rem",
                        }}>

                        {currTab === "card-info" && (
                            <div>
                                <h2 className="text-3xl font-mono pb-10">Payment Information</h2>
                                <div className="flex flex-wrap justify-center gap-3 p-5">
                                    <input className="w-50 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono" 
                                        type="text" 
                                        name="card_type" 
                                        placeholder="Card Name" 
                                        value={user?.payment_info?.card_type || ""} 
                                        onChange={handleUserInput}
                                    />

                                    <input  
                                        className="w-50 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono"
                                        type="text" 
                                        name="card_number" 
                                        placeholder="Card Number" 
                                        value={user?.payment_info?.card_number || ""} 
                                        onChange={handleUserInput} 
                                    />

                                    <input
                                        className="w-50 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono"
                                        type="text" 
                                        name="expiration_date" 
                                        placeholder="Expiration Date" 
                                        value={user?.payment_info?.expiration_date || ""} 
                                        onChange={handleUserInput} 
                                    />

                                    <input 
                                        className="w-50 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono"
                                        type="text" 
                                        name="cvv" 
                                        placeholder="CVV" 
                                        value={user?.payment_info?.cvv || ""} 
                                        onChange={handleUserInput} 
                                    />
                                </div>
                                <button onClick={saveCardInfo} className="w-210 mt-10 font-mono">Save Card</button>
                            </div>
                        )}

                        {currTab === "deposit" && user?.payment_info?.card_number && (
                                <div>
                                <h2 className="text-3xl font-mono pb-10">Deposit Funds</h2>

                                <span className="text-gray-400 font-mono">$</span>
                                <input className="w-200 p-3 rounded bg-gray-900 text-white border border-gray-600 mt-5 font-mono"
                                    type="number" 
                                    placeholder="Amount" 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)} 
                                />

                                <div className="flex justify-center mt-5 gap-5 font-mono">
                                    {[10, 25, 50, 100, 250].map((amt) => (
                                        <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setAmount(amt)}
                                        className={`w-36 px-4 py-2 rounded-md border ${
                                            parseInt(amount) === amt
                                            ? "bg-white text-white font-bold"
                                            : "bg-gray-700 text-white"
                                        } `}
                                        >
                                        ${amt}
                                        </button>
                                    ))}
                                </div>

                                <div className="gap-10 mt-4 font-mono">
                                    <select 
                                        className="mt-10 px-3 py-3 rounded-md bg-gray-900"
                                        value={card} 
                                        onChange={(e) => setCard(e.target.value)}>
                                        <option value="">Select a Card</option>
                                        <option value={user.payment_info.card_number}>
                                            {user.payment_info.card_type} - {user.payment_info.card_number.slice(-4)}
                                        </option>
                                    </select>

                                    <input
                                        className="px-4 py-3 rounded-md bg-gray-900 text-white border-gray-600 font-mono"
                                        type="text"
                                        name="cvv"
                                        placeholder="CVV"
                                        maxLength="4"
                                        value={user?.payment_info?.cvv ||""}
                                        onChange={handleUserInput}
                                    />
                                </div>
                                
                                <div>
                                    <button onClick={() => userTransactions("deposit")} className="w-200 px-4 py-3 rounded-md bg--600 text-white mt-10">Confirm</button> 
                                </div>
                            </div>
                        )}

                        {currTab === "withdraw" && user?.payment_info?.card_number && (
                            <div>
                                <h2 className="text-3xl font-mono pb-10">Withdraw Funds</h2>
                                    <div>
                                        <span className="text-gray-400 font-mono">$</span>
                                        <input className="w-200 p-3 rounded bg-gray-900 text-white border border-gray-600 mt-5 font-mono"
                                            type="number" 
                                            placeholder="Amount" 
                                            value={amount} 
                                            onChange={(e) => setAmount(e.target.value)} 
                                        />
                                    </div>

                                    <div className="flex justify-center gap-5">
                                        <select 
                                            className="w-98 mt-10 px-3 py-3 rounded-md bg-gray-900 font-mono"
                                            value={card} 
                                            onChange={(e) => setCard(e.target.value)}>
                                            <option value="">Select a Card</option>
                                            <option value={user.payment_info.card_number}>
                                                {user.payment_info.card_type} - {user.payment_info.card_number.slice(-4)}
                                            </option>
                                        </select>

                                        <button onClick={() => userTransactions("withdraw")} className="w-98 mt-10 font-mono">Confirm</button>
                                    </div>
                            </div>
                        )} 
                    </Box>

                </div>
    
            

        </>
    )
}

export default Funds