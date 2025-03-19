import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className=" w-full py-6 px-12">
      <div className="flex justify-between items-center w-full">
        {/* Logo and Brand Name */}
        <div
          className="flex items-center gap-4"
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
        <div className="flex items-center gap-16">
          {["Lineups", "Promos", "Social", "Funds"].map((item, index) => (
            <Button
              key={index}
              variant="text"
              disableRipple
              onClick={() => (item === "Funds" ? navigate("/funds") : null)}
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
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default Header;
