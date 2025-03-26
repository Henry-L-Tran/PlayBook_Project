import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";

function Header() {

  // Navigation Function
  const navigate = useNavigate();
  
  // Navigation items
  const navItems = [
    {name: "Lineups", path: "/lineups"},
    {name: "Promos", path: "/promos"},
    {name: "Social", path: "/social"},
    {name: "Funds", path: "/funds"},
  ];

  return (
    <div className=" w-full sm:py-6 sm:px-12">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full flex-wrap">
        {/* Logo and Brand Name */}
        <div
          className="flex items-center gap-4 min-w-1/4"
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
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="text"
              disableRipple
              onClick={() => navigate(item.path)}
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
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default Header;
