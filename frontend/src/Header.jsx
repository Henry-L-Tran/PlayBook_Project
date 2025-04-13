import { Typography, Button, Box, Link, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState, useEffect } from "react";
import { useRef } from "react";

// Handles the Header Component & Routing
// eslint-disable-next-line react/prop-types
const Header = ({ onNavigate }) => {
  // React Router Navigation
  const navigate = useNavigate();

  // Navigation Options
  const navItems = ["Lineups", "Promos", "Funds"];

  // Logs The User Out and Redirects to Login Page
  const handleUserLogout = () => {
    // Removes Local Storage Key for Current User
    localStorage.removeItem("currUser");
    console.log("User Sucessfully Logged Out");
    navigate("/login");
  };

  // Stores Current User Information
  const [currUser, setCurrUser] = useState(null);
  const [showUserProfileDropdown, setShowUserProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem("currUser");
    if (user) {
      setCurrUser(JSON.parse(user));
    }
  }, []);

  const toggleDropdown = () => {
    setShowUserProfileDropdown((prev) => !prev);
  };

  const handleSettings = () => {
    console.log("Settings Accessed");
    setShowUserProfileDropdown(false);
  };

  const handleHelpCenter = () => {
    console.log("Help Center Accessed");
    setShowUserProfileDropdown(false);
  };

  // Closes the Dropdown When Clicking Outside of It
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowUserProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Main Container for Header Component
    <div className="w-full sm:py-6 sm:px-12">
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

          <Box
          ref={dropdownRef}
            sx={{
              position: "relative",
              zIndex: 1000,
            }}
          >
            {/* User Profile and Dropdown Icon Container */}
            <Box
              onClick={toggleDropdown}
              sx={{
                display: "flex",
                gap: 1.5,
                cursor: "pointer",
              }}
            >
              {/* User Profile Container */}
              <Box
                sx={{
                  border: "2px solid white",
                  borderRadius: "5rem",
                  width: "3rem",
                  height: "3rem",
                  textAlign: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}>

                {/* User Initials Text */}
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "1.3rem", 
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    marginTop: "0.45rem",
                  }}
                >
                  {currUser?.first_name?.charAt(0) ?? ""}
                  {currUser?.last_name?.charAt(0) ?? ""}
                </Typography>
              </Box>

              {/* Dropdown Arrow Icon */}
              <Typography
                  sx={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  }}
                >
                  ⌄
                </Typography>
            </Box>

            {/* User Profile Dropdown Menu Container */}
            {showUserProfileDropdown && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  border: "1px solid white",
                  backgroundColor: "transparent",
                  borderRadius: "0.5rem",
                  marginTop: "30%",
                  backgroundColor: "black",
                }}
              >
                {/* Settings Option Container */}
                <Box
                  onClick={handleSettings}
                  sx={{
                    padding: "1rem",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >

                  {/* Settings Option Text */}
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    Settings
                  </Typography>
                </Box>

                <Divider
                  sx={{
                    bgcolor: "gray",
                    height: "1px",
                  }}
                  flexItem
                />

                {/* Help Center Option Container */}
                <Box
                  onClick={handleHelpCenter}
                  sx={{
                    padding: "1rem",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {/* Help Center Option Text */}
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    Help Center
                  </Typography>
                </Box>

                <Divider
                  sx={{
                    bgcolor: "gray",
                    height: "1px",
                  }}
                  flexItem
                />

                {/* Logout Option Container */}
                <Box
                  onClick={handleUserLogout}
                  sx={{
                    padding: "1rem",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {/* Logout Option Text */}
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    Logout
                  </Typography>
                </Box>
              </Box>
          )}
          </Box>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default Header;
