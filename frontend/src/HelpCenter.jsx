import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import "./HelpCenter.css";

// Help Menu Categories
const helpCategories = [
  { id: 1, label: "Deposits & Withdrawals" },
  { id: 2, label: "Placing Entries" },
  { id: 3, label: "Lineup Details & Payouts" },
  { id: 4, label: "Promotions" },
  { id: 5, label: "FAQs" },
];

const HelpCenter = ({ isOpen, onClose }) => {
  const [activeSlide, setActiveSlide] = useState("menu");

  // NULL if Popup Is Not Open
  if (!isOpen) {
    return null;
  }

  return (
    
    // Main Container for the Help Center Fullscreen Popup
    <Box
      className="help-modal-backdrop"
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1350,
      }}
    >

      {/* Help Center Popup Container */}
      <Box
        className="help-center-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          border: "2px solid white",
          borderRadius: "1rem",
          boxShadow: "0 0 20px black",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          padding: "2rem",
          color: "white",
        }}
      >
        {/* Close Button */}
        <Button
          disableRipple
          onClick={onClose}
          sx={{
            textTransform: "none",
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "transparent",
            color: "white",
            fontWeight: "bold",
            fontFamily: "monospace",
            fontSize: "1.1rem",
            "&:hover": {
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
            },
            "&:focus": {
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            },
          }}
        >
          Close
        </Button>

        {/* Back Button Only Appears In Selected Help Tabs */}
        {activeSlide !== "menu" && (
          <Button
            disableRipple
            onClick={() => setActiveSlide("menu")}
            sx={{
              textTransform: "none",
              position: "absolute",
              top: "1rem",
              left: "1rem",
              backgroundColor: "transparent",
              color: "white",
              fontWeight: "bold",
              fontFamily: "monospace",
              fontSize: "1.1rem",
              "&:hover": {
                outline: "none",
                backgroundColor: "transparent",
              },
              "&:focus": {
                outline: "none",
                backgroundColor: "transparent",
              },
            }}
          >
            ← Back
          </Button>
        )}

        {/* Help Center Header */}
        <Box 
          sx={{ 
            marginBottom: "2rem", 
            marginTop: "2rem" 
          }}
        >
          {/* Help Center Title */}
          <Typography
            sx={{
              fontSize: "2rem",
              fontFamily: "monospace",
              textAlign: "center",
            }}
          >
            Help Center
          </Typography>
        </Box>

        {/* Help Center Main Menu */}
        {activeSlide === "menu" ? (
          <>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                fontFamily: "monospace",
                marginBottom: "2rem",
              }}
            >
              How Can PlayBook Help You?
            </Typography>

            {/* Help Categories List */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {helpCategories.map((topic) => (
                <Box
                  key={topic.id}
                  onClick={() => setActiveSlide(topic.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid white",
                    borderRadius: "0.5rem",
                    padding: "1rem 2rem",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {/* Help Topic Text */}
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {topic.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider
              sx={{
                width: "100%",
                backgroundColor: "white",
                margin: "2rem 0 1rem",
                height: "1px",
              }}
            />

            {/* Contact Support Box */}
            <Box
              sx={{
                border: "1px solid white",
                borderRadius: "0.5rem",
                padding: "2rem 3rem",
                width: "100%",
              }}
            >
              {/* Contact Support Header */}
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  marginBottom: "1rem",
                }}
              >
                Contact Support
              </Typography>

              {/* Contact Support Description */}
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "monospace",
                  marginBottom: "0.5rem",
                }}
              >
                If you didn't find what you're looking for, we're here to help.
              </Typography>

              {/* Contact Support Email (NOT REAL EMAIL) */}
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "monospace",
                }}
              >
                Email us at{" "}
                <a
                  href="mailto:support@playbook.com"
                  style={{ color: "#3399ff" }}
                >
                  support@playbook.com
                </a>
              </Typography>
            </Box>
          </>
        ) : (

          // Selected Help Topic Container
          <Box 
            sx={{ 
              width: "100%", 
              paddingTop: "1rem" 
            }}
          >
            {/* Selected Help Topic Header */}
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                fontFamily: "monospace",
                marginBottom: "1rem",
              }}
            >
              {
                helpCategories.find((topic) => topic.id === activeSlide)?.label
              }
            </Typography>

            {/* Deposit & Withdrawal Section */}
            {activeSlide === 1 && (
              <>
                <Typography>TESTING</Typography>
                <Typography>TESTING</Typography>
              </>
            )}

            {/* Placing Entries Section */}
            {activeSlide === 2 && (
              <>
                <Typography>TESTING</Typography>
                <Typography>TESTING</Typography>
              </>
            )}

            {/* Lineup Details & Payouts Section */}
            {activeSlide === 3 && (
              <>
                <Typography>TESTING</Typography>
                <Typography>TESTING</Typography>
              </>
            )}

            {/* Promotions Section */}
            {activeSlide === 4 && (
              <>
                <Typography>TESTING</Typography>
                <Typography>TESTING</Typography>
              </>
            )}

            {/* FAQs Section */}
            {activeSlide === 5 && (
              <>
                <Typography>TESTING</Typography>
                <Typography>TESTING</Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HelpCenter;
