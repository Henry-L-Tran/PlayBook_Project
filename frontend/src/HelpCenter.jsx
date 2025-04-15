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

const HelpCenterModal = ({ isOpen, onClose }) => {
  const [activeSlide, setActiveSlide] = useState("menu");

  // NULL if Popup Is Not Open
  if (!isOpen) {
    return null;
  }

  return (

    // Main Container for the Help Center Full Screen Popup
    <Box className="help-modal-backdrop"
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >

      {/* Help Center Popup Container */}
      <Box className="help-center-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid white",
          borderRadius: "1rem",
          boxShadow: "0 0 20px black",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "hidden",
          position: "relative",
          padding: "2rem",
          color: "white",
        }}
      >

        {/* Close Button */}
        <Button className="close-btn"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: "0.5rem",
            "&:hover": {
              backgroundColor: "transparent",
              outline: "none",
              border: "2px solid white",
            },
            "&:focus": {
              outline: "none",
              backgroundColor: "transparent",
              border: "2px solid white",
            },
          }}
        >
          Close
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              color: "white",
              fontFamily: "monospace",
            }}
          >
            Help Center
          </Typography>
        </Box>

        {/* PlayBook Helper Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "white",
              fontFamily: "monospace",
              marginBottom: "15%",
            }}
          >
            How Can PlayBook Help You?
          </Typography>
        </Box>

        {/* Menu View */}
        {activeSlide === "menu" && (
          
          // Help Categories Menu Container
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}>
            {helpCategories.map((topic) => (

              // Each Help Category Option Container
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
                {/* Help Category Text */}
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {topic.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Divider
          sx={{
            width: "100%",
            backgroundColor: "white",
            margin: "1rem 0",
            height: "1px",
          }}
        />

        {/* Contact Us Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px solid white",
            borderRadius: "0.5rem",
            padding: "2rem 3rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "white",
              fontFamily: "monospace",
            }}
          >
            Contact Support
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              fontFamily: "monospace",
              color: "white",
            }}
          >
            If you didn't find what you're looking for, we're here to help.
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              fontFamily: "monospace",
              color: "white",
            }}
          >
            Email us at{" "}
            <Typography
              href="#"
              sx={{
                fontSize: "1rem",
                fontFamily: "monospace",
              }}
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "mailto:support@playbook.com",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="text-blue-600 hover:underline"
            >
              support@playbook.com
            </Typography>
          </Typography>
        </Box>

        {/* Detail Slide View */}
        {helpCategories.map((topic) =>
          activeSlide === topic.id ? (

            // Help Category Detail Slide Container
            <Box
              key={topic.id}
              sx={{ 
                padding: "1.5rem", 
                color: "white" 
              }}
            >
              <Button 
              onClick={() => setActiveSlide("menu")}
              sx={{
                position: "relative",
                top: 0,
                left: "1rem",
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid white",
                borderRadius: "0.5rem",
                "&:hover": {
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "2px solid white",
                },
                "&:focus": {
                  outline: "none",
                  backgroundColor: "transparent",
                  border: "2px solid white",
                },
              }}
              >
                ← Back
              </Button>

              <Typography variant="h5" fontWeight="bold" mb={2}>
                {topic.label}
              </Typography>

              {/* Content For Each Help Category */}
              {topic.id === 1 && (
                <>
                  <Typography>
                    Test
                  </Typography>
                  <Typography >
                    Test
                  </Typography>
                </>
              )}

              {topic.id === 2 && (
                <>
                  <Typography>
                    Test
                  </Typography>
                  <Typography >
                    Test
                  </Typography>
                </>
              )}

              {topic.id === 3 && (
                <>
                  <Typography>
                    Test
                  </Typography>
                  <Typography>
                    Test
                  </Typography>
                </>
              )}

              {topic.id === 4 && (
                <>
                  <Typography>
                    Test
                  </Typography>
                  <Typography>
                    Test
                  </Typography>
                </>
              )}

              {topic.id === 5 && (
                <>
                 <Typography>
                    Test
                  </Typography>
                  <Typography>
                    Test
                  </Typography>
                </>
              )}
            </Box>
          ) : null
        )}
      </Box>
    </Box>
  );
};

export default HelpCenterModal;
