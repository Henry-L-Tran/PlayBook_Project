import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";

// eslint-disable-next-line react/prop-types
const Header = ({ onNavigate }) => {
  const navigate = useNavigate();
  // Navigation items
  const navItems = ["Dashboard", "Lineups", "Promos", "Social", "Funds"];

  const handleUserLogout = () => {
    localStorage.removeItem("currUser");
    console.log("User Sucessfully Logged Out");
    navigate("/login");
  };

  return (
    <div className="h-1/4 overflow-scroll sm:overflow-auto sm:h-auto w-full sm:py-6 sm:px-12">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full flex-wrap">
        {/* Logo and Brand Name */}
        <div
          className="flex items-center gap-4 min-w-1/4"
          onClick={() => navigate("/home")}
          onClick={() => navigate("/home")}
        >
          <img
            src="/images/logo.png"
            alt="PlayBook Logo"
            className="w-[90px] h-[90px]"
          />
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
        <div className="flex items-center gap-4 sm:gap-16 min-w/3/4 flex-col sm:flex-row">
          {navItems.map((item, index) => (
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
