import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const PieChart = ({ totalWon, totalEntriesValue, wins, losses }) => {
  const totalGames = wins + losses;
  const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  const lossPercentage = 100 - winPercentage;

  const [showTotalEntries , setShowTotalEntries] = useState(false);

  return (
    // Main Container for the Pie Chart
    <Box
        sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginLeft: "10%",
        }}
    >
        {/* Pie Chart and Legend Container */}
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Outer Circle for Win/Loss Percentage */}
            <Box className="pie-chart"
            sx={{
                width: "10rem",
                height: "10rem",
                borderRadius: "50%",
                background: showTotalEntries
                ? `conic-gradient(green 0% ${winPercentage}%, red ${winPercentage}% 100%)`
                : `conic-gradient(green 0% 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10%",
            }}
            >
                {/* Inner Circle for Balance Display Container */}
                <Box
                    sx={{
                    width: "8rem",
                    height: "8rem",
                    borderRadius: "50%",
                    backgroundColor: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    }}
                >
                    {/* Balance Text Display */}
                    <Typography
                        sx={{
                            fontFamily: "monospace",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                        }}
                    >
                        ${showTotalEntries ? totalEntriesValue.toFixed(2) : totalWon.toFixed(2)}
                    </Typography>
                </Box>
            </Box>

            {/* Win/Loss Label Container */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: "12%",
                    color: "white",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    borderRadius: "0.5rem",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                }}
            >
                {/* Win Container */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                    }}
                >
                    {/* Green Color Circle */}
                    <Box
                        sx={{
                            width: "1rem",
                            height: "1rem",
                            backgroundColor: "green",
                            borderRadius: "50%",
                        }}
                    />

                    {/* Win Count Text */}
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            color: "white",
                            fontFamily: "monospace",
                            fontWeight: "bold",
                        }}
                    >
                        Wins: {wins}
                    </Typography>
                </Box>

                {/* Loss Container (Only Shows When Total Entries Button is Toggled */}
                {showTotalEntries && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                        }}
                    >
                        {/* Red Color Circle */}
                        <Box
                            sx={{
                                width: "1rem",
                                height: "1rem",
                                backgroundColor: "red",
                                borderRadius: "50%",
                            }}
                        />

                        {/* Loss Count Text */}
                        <Typography
                            sx={{
                                fontSize: "0.75rem",
                                color: "white",
                                fontFamily: "monospace",
                                fontWeight: "bold",
                            }}
                        >
                            Losses: {losses}
                        </Typography>
                    </Box>
                )}    
            </Box>
        </Box>

        {/* Show Entries Toggle Buttons */}
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            {/* Won Entries Button */}
            <Button
                disableRipple
                disableFocusRipple
                variant={!showTotalEntries ? "contained" : "outlined"}
                onClick={() => setShowTotalEntries(false)}
                sx={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    textTransform: "none",
                    color: !showTotalEntries ? "black" : "white",
                    border: "1px solid white",
                    backgroundColor: !showTotalEntries ? "white" : "transparent",
                    "&:hover": {
                        backgroundColor: !showTotalEntries ? "white" : "transparent",
                        color: !showTotalEntries ? "black" : "white",
                        border: "1px solid white",
                  
                    },
                    "&:focus": {
                        outline: "none",
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid white",
                    },
                }}
            >
                Total Winnings
            </Button>

            {/* Total Entries Button */}
            <Button
                disableRipple
                disableFocusRipple
                variant={showTotalEntries ? "contained" : "outlined"}
                onClick={() => setShowTotalEntries(true)}
                sx={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    textTransform: "none",
                    color: showTotalEntries ? "black" : "white",
                    border: "1px solid white",
                    backgroundColor: showTotalEntries ? "white" : "transparent",
                    "&:hover": {
                        backgroundColor: showTotalEntries ? "white" : "transparent",
                        color: showTotalEntries ? "black" : "white",
                        border: "1px solid white",
                    },
                    "&:focus": {
                        outline: "none",
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid white",
                    },
                }}
            >
                Net Win-Loss
            </Button>
        </Box>
    </Box>
  );
};

export default PieChart;
