import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";

// Handles the Header Component & Routing
const Header = ({ onNavigate }) => {

  // React Router Navigation
  const navigate = useNavigate();

  // Navigation Options
  const navItems = ["Dashboard", "Lineups", "Promos", "Social", "Funds"];

  // Logs The User Out and Redirects to Login Page
  const handleUserLogout = () => {

    // Removes Local Storage Key for Current User
    localStorage.removeItem("currUser");
    console.log("User Sucessfully Logged Out");
    navigate("/login");
  };

  return (
    // Main Container for Header Component
    <div className="h-1/4 overflow-scroll sm:overflow-auto sm:h-auto w-full sm:py-6 sm:px-12">
      
      {/* Header Container with Logo and Navigation Links */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full flex-wrap">
        {/* Logo and App Name */}
        <div
          className="flex items-center gap-4 min-w-1/4"
          onClick={() => navigate("/home")}
        >
          {/* Logo Image */}
          <img
            src="/images/logo.png"
            alt="PlayBook Logo"
            className="w-[90px] h-[90px]"
          />

          {/* App Name */}
          <Typography
            fontWeight="600"
            sx={{
              color: "white",
              fontSize: "2rem",
              fontFamily: "monospace",
            }}
          >
            PlayBook
          </Typography>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-16 min-w/3/4 flex-col sm:flex-row">
          {navItems.map((item, index) => (

            // Navigation Button for Each Link Category
            <Button
              key={index}
              variant="text"
              disableRipple
              onClick={() => onNavigate(item)}
              sx={{
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "600",
                textTransform: "none",
                fontFamily: "monospace",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
                "&:focus": {
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              {item}
            </Button>
          ))}
          
          {/* Logout Button */}
          <button
            className=" px-4 py-2 mb-4 sm:mb-0"
            onClick={handleUserLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default Header;
