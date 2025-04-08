import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LineupDetails = ({ lineup, onClose }) => {
    const gameStatusColor = lineup.result === "WON" ? "green" : lineup.result === "LOSS" ? "red" : "white";


    return (

        // Main Fullscreen Container for the Lineup Details Popup
        <Box className="lineup-details-page-container"
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
                top: 0,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
                
            {/* Lineup Details Box Container */}    
            <Box className="lineup-close-button-container"
                sx={{
                    display: "flex",
                    backgroundColor: "black",
                    borderRadius: "1rem",
                    width: "40%",
                    height: "80%",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid white",
                    overflowY: "auto",
                }}
                
            >
                <Typography>
                    Testing
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        backgroundColor: "black",
                        borderRadius: "1rem",
                    }}
                >

                    {/* Lineup Details Close Button */}
                    <IconButton
                        className="lineup-close-button"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default LineupDetails;
