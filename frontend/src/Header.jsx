import { Typography, Button, Box, Link, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

// Handles the Header Component & Routing
// eslint-disable-next-line react/prop-types
const Header = ({ onNavigate }) => {
  // React Router Navigation
  const navigate = useNavigate();

  // Navigation Options
  const navItems = ["Lineups", "Promos", "Social", "Funds"];

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
        <Link
          underline="none"
          sx={{
            textDecoration: "none",
          }}
        >
          <Box
            className="flex items-center gap-4 min-w-1/4"
            onClick={() => onNavigate("Dashboard")}
            sx={{
              cursor: "pointer",
            }}
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
          </Box>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-8 min-w/3/4 flex-col sm:flex-row">
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
          <Box className="flex flex-col items-center text-center">
            <Typography
              sx={{
                color: "white",
                fontSize: "1rem", 
                fontFamily: "monospace",
              }}
            >
              Current Funds:
            </Typography>
            <Typography
              sx={{
                color: "white",
                fontSize: "1rem", 
                fontFamily: "monospace",
              }}
            >
              ${"50.00"}
            </Typography>
          </Box>

          {/* Logout Button */}
          <button
            className=" px-4 py-2 mb-4 sm:mb-0"
            onClick={handleUserLogout}
          >
            Logout
          </button>

          {/* Help Icon Button at the very end */}
          <IconButton
            color="inherit"
            onClick={() => console.log("Help Icon Clicked")}
            sx={{
              marginLeft: "auto", 
              fontSize: "2rem",
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: "inherit" }} />
          </IconButton>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default Header;
