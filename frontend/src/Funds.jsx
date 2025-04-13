import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CenteredModal from "./utilities/CenteredModal";

function Funds() {
  const [user, setUser] = useState(null);
  const [currTab, setCurrTab] = useState("card-info");
  const [amount, setAmount] = useState("");
  const [card, setCard] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userCVV, setUserCVV] = useState("");

  // Check if User is Logged In and Fetch User Data
  useEffect(() => {
    getUserData();
  }, []);

  // Fetch User Data from Backend with Local Storage User ID
  const getUserData = async () => {
    const currUser = JSON.parse(localStorage.getItem("currUser"));

    // If No User is Logged In, Show Error
    if (!currUser || !currUser.email) {
      console.error("No User Logged In");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/funds/user/${currUser.email}`
      );
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error Fetching User Data", error);
    }
  };

  // Handle User Input for Payment Information
  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      payment_info: { ...prevUser.payment_info, [name]: value },
    }));
  };

  // Save Card Information to Backend
  const saveCardInfo = async () => {
    if (!user) {
      console.error("User Data Not Available");
      return;
    }

    const requestInfo = {
      email: user.email,
      card_type: user.payment_info.card_type,
      card_number: user.payment_info.card_number,
      expiration_date: user.payment_info.expiration_date,
      cvv: user.payment_info.cvv,
    };

    try {
      const response = await fetch(
        "http://localhost:8000/funds/add_card_info",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestInfo),
        }
      );

      if (response.status === 200) {
        setModalMessage("Card Information Saved");
        setIsModalOpen(true);
        getUserData();

      } 
      else {
        setModalMessage("Failed to Save Card Information");
        setIsModalOpen(true);
      }
    } 
    catch (error) {
      console.error("Error Adding Card Information:", error);
      setModalMessage("Failed to Save Card Information");
      setIsModalOpen(true);
    }
  };

  // helper function to capitalize first letter
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Handle User Transactions (Deposit/Withdraw)
  const userTransactions = async (type) => {
    if (!user) {
      console.error("Error Loading User Data");
      return;
    }

    const requestInfo = {
      email: user.email,
      amount: amount,
      card_number: card,
    };

    if (type === "deposit" && userCVV !== user.payment_info.cvv) {
      setModalMessage("Invalid CVV");
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/funds/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestInfo),
      });

      const data = await response.json();
      if (response.status === 200) {
        setModalMessage(`${capitalize(type)} successful`);
        setIsModalOpen(true);
        getUserData();

        // Clear Input Fields After Saving
        setAmount("");
        setCard("");
        setUserCVV("");
      } 
      else {
        setModalMessage(`${capitalize(type)} failed`);
        setIsModalOpen(true);
      }
    } 
    catch (error) {
      console.error(`${type} Failed:`, error);
      setModalMessage(`${capitalize(type)} failed`);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Funds Page Box (Entire Page) */}
      <div className="font-mono">
        {/* Funds Header */}
        <h1 className="flex items-center flex-col justify-center font-mono">
          Funds
        </h1>

        {/* User Balance */}
        <p className="flex items-center flex-col justify-center mt-10 text-2xl font-mono font-bold">
          Balance: ${user?.balance || 0}
        </p>

        {/* Container for Card Information, Deposit, and Withdraw Buttons */}
        <div className="flex flex-col items-center px-4 sm:px-0 sm:flex-row  flex-wrap justify-center mt-5 gap-3 font-mono">
          {/* Card Information Button */}
          <button
            onClick={() => setCurrTab("card-info")}
            className="w-fit sm:w-98"
          >
            Card Information
          </button>

          {/* Deposit Button */}
          <button
            onClick={() => setCurrTab("deposit")}
            className="w-fit sm:w-98"
          >
            Deposit
          </button>

          {/* Withdraw Button */}
          <button
            onClick={() => setCurrTab("withdraw")}
            className="w-fit sm:w-98"
          >
            Withdraw
          </button>
        </div>

        {/* Container for All Card Information, Deposit, and Withdraw Content */}
        <Box
          className="flex justify-center flex-col mt-10 p-25"
          sx={{
            width: "100%",
            maxWidth: "100%",
            height: "100%",
            minHeight: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: "1rem",
          }}
        >
          {currTab === "card-info" && (
            // Container for Payment Information
            <div>
              {/* Header for Payment Information */}
              <h2 className="text-3xl font-mono pb-10">Payment Information</h2>

              {/* Container for Card Information Inputs */}
              <div className="flex flex-col items-center sm:flex-row flex-wrap justify-center gap-3 p-5">
                {/* Card Type Input */}
                <input
                  className="w-50 md:w-1/5 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono"
                  type="text"
                  name="card_type"
                  placeholder="Card Name"
                  value={user?.payment_info?.card_type || ""}
                  onChange={handleUserInput}
                />

                {/* Card Number Input */}
                <input
                  className="w-50 md:w-1/5 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono"
                  type="text"
                  name="card_number"
                  placeholder="Card Number"
                  value={user?.payment_info?.card_number || ""}
                  onChange={handleUserInput}
                />

                {/* Expiration Date Input */}
                <input
                  className="w-50 md:w-1/5 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono"
                  type="text"
                  name="expiration_date"
                  placeholder="Expiration Date"
                  value={user?.payment_info?.expiration_date || ""}
                  onChange={handleUserInput}
                />

                {/* CVV Input */}
                <input
                  className="w-50 md:w-1/5 p-3 rounded-md bg-gray-900 text-white border border-gray-600 font-mono"
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={user?.payment_info?.cvv || ""}
                  onChange={handleUserInput}
                />
              </div>

              {/* Save Card Button */}
              <button
                onClick={saveCardInfo}
                className=" sm:w-4/5 mt-10 font-mono"
              >
                Save Card
              </button>
            </div>
          )}

          {currTab === "deposit" && user?.payment_info?.card_number && (
            // Container for Deposit Funds
            <div className="flex w-full flex-col items-center justify-center">
              {/* Header for Deposit Funds */}
              <h2 className="text-3xl font-mono  pb-10">Deposit Funds</h2>

              {/* Container for Deposit Amount Input */}
              <div className="relative w-full sm:w-4/5 flex items-center">
                {/* Dollar Sign Placeholder */}
                <span className="absolute inset-y-8 left-4 flex text-gray-400 font-mono font-bold">
                  $
                </span>

                {/* Deposit Amount Input */}
                <input
                  className="pl-9 w-full p-3 rounded bg-gray-900 text-white border border-gray-600 mt-5 font-mono"
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Container for Different Deposit Amount Buttons */}
              <div className="flex justify-center w-4/5 mt-5 sm:gap-5 font-mono">
                {[10, 25, 50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`w-full  py-2 rounded-md border ${
                      parseInt(amount) === amt
                        ? "bg-white text-white font-bold"
                        : "bg-gray-700 text-white"
                    } `}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Container for Card Selection and CVV Input */}
              <div className="flex w-4/5 flex-row justify-center items-center gap-5 mt-5 font-mono">
                {/* Card Selection Dropdown */}
                <select
                  className="w-1/2 h-12 px-3 py-3 rounded-md bg-gray-900"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                >
                  {/* Card Selection Dropdown */}
                  <option value="">Select a Card</option>

                  {/* Card Options */}
                  <option value={user.payment_info.card_number}>
                    {user.payment_info.card_type} -{" "}
                    {user.payment_info.card_number.slice(-4)}
                  </option>
                </select>

                {/* CVV Input */}
                <input
                  className="w-1/2 h-12 px-3 py-3 rounded-md bg-gray-900 text-white border-gray-600 font-mono"
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  maxLength="4"
                  value={userCVV}
                  onChange={(e) => setUserCVV(e.target.value)}
                />
              </div>

              {/* Confirm Deposit Button */}
              <button
                onClick={() => userTransactions("deposit")}
                className="w-4/5 px-4 py-3 rounded-md bg--600 text-white mt-8"
              >
                Confirm
              </button>
            </div>
          )}

          {currTab === "withdraw" && user?.payment_info?.card_number && (
            // Container for Withdraw Funds
            <div className="flex w-full flex-col items-center justify-center">
              {/* Header for Withdraw Funds */}
              <h2 className="text-3xl font-mono pb-10">Withdraw Funds</h2>

              {/* Container for Withdraw Amount Input */}
              <div className="relative w-full sm:w-4/5 flex items-center">
                {/* Dollar Sign Placeholder */}
                <span className="absolute inset-y-8 left-4 flex text-gray-400 font-mono font-bold">
                  $
                </span>

                {/* Withdraw Amount Input */}
                <input
                  className="pl-9 w-full p-3 rounded bg-gray-900 text-white border border-gray-600 mt-5 font-mono"
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Container for Selecting Card and Confirm Button*/}
              <div className="flex justify-center gap-5">
                {/* Card Selection Dropdown */}
                <select
                  className="w-fit sm:w-98 mt-10 px-3 py-3 rounded-md bg-gray-900 font-mono"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                >
                  {/* Card Selection Dropdown */}
                  <option value="">Select a Card</option>

                  {/* Card Options */}
                  <option value={user.payment_info.card_number}>
                    {user.payment_info.card_type} -{" "}
                    {user.payment_info.card_number.slice(-4)}
                  </option>
                </select>

                {/* Confirm Withdraw Button */}
                <button
                  onClick={() => userTransactions("withdraw")}
                  className="w-fit sm:w-98 mt-10 font-mono"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          {/* Modal */}
          <CenteredModal
            isOpen={isModalOpen}
            message={modalMessage}
            onClose={() => setIsModalOpen(false)}
          />
        </Box>
      </div>
    </>
  );
}

export default Funds;
