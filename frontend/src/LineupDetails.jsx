import React, { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { calculatePayoutMultiplier, showPayoutMultipliers } from "./payoutMultiplier";

const LineupDetails = ({ lineup, onClose, liveGames }) => {
    const gameStatusColor = lineup.result === "WON"
        ? "green"
        : lineup.result === "LOST"
        ? "red"
        : lineup.result === "REFUNDED"
        ? "gray"
        : "white";
    
    // Toggles the Payout Multiplier Display
    const [showPayoutDetails, setShowPayoutDetails] = useState(false);

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
                zIndex: 1100,
            }}
        >
                
            {/* Lineup Details Box Container */}    
            <Box className="lineup-details-container"
                sx={{
                    position: "relative",
                    display: "flex",
                    backgroundColor: "black",
                    borderRadius: "1rem",
                    width: "40%",
                    maxHeight: "90vh",          
                    overflowY: "auto",
                    flexDirection: "column",
                    border: "1px solid white",
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

                {/* Lineup Details Result Tag Container */}
                <Box
                    sx={{
                        fontWeight: "bold",
                        position: "absolute",
                        top: "1rem",
                        marginTop: "2%",
                        right: "15%",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "black",
                        borderRadius: "1rem",
                        border: "1px solid white",
                        color: gameStatusColor,
                        fontFamily: "monospace",
                        padding: "0.5rem 1rem",
                    }}
                >
                        {lineup.result || "In Progress"}
                </Box>
                
                {/* Lineup Details Header */}
                <Box 
                    sx={{
                        marginTop: "2%",
                        marginLeft: "10%", 
                        width: "100%",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "monospace",
                            color: "white",
                            marginBottom: "0.5rem",
                            fontSize: "1.2rem",
                        }}>
                            {lineup.entries.length}-Pick • ${lineup.entry_amount} {lineup.entry_type}
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: "monospace",
                            color: "white",
                            marginBottom: "1rem",
                            fontWeight: "bold",
                        }}>
                            ${lineup.entry_amount} to Win ${lineup.potential_payout}
                    </Typography>
                </Box> 

                {/* Divider Line */}
                <Box
                    sx={{
                        borderBottom: "1px solid white",
                        width: "100%",
                        display: "flex",
                        position: "relative",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* Payout Details Component Button For Divider */}
                    <Typography
                        component="button"
                        onClick={() => setShowPayoutDetails(prev => !prev)}
                        sx={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: "black",
                        color: "white",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        padding: "0 1rem",
                        border: "1px solid white",
                        borderRadius: "5rem",
                        cursor: "pointer",      
                        }}
                    >
                        {showPayoutDetails ? "Hide Details" : "Show Details"}
                    </Typography>
                </Box>

                {/* Payout Details Section Container */}
                {showPayoutDetails && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            backgroundColor: "black",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                            minHeight: "7em",
                            marginTop: "4%",
                        }}
                    >
                        {/* Payout Multiplier for Power Play Entries Container */}
                        {lineup.entry_type === "Power Play" ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    backgroundColor: "black",
                                    borderRadius: "1rem",
                                    border: "1px solid white",
                                    width: "25%",
                                    padding: "1.5rem",
                                    justifyContent: "center",

                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "limegreen",
                                        fontFamily: "monospace",
                                        fontWeight: "bold",
                                        fontSize: "1.3rem",
                                    }}
                                >
                                    ${parseFloat(lineup.potential_payout).toFixed(2)}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "white",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {lineup.entries.length} of {lineup.entries.length} • {`${(lineup.potential_payout / lineup.entry_amount).toFixed(1)}x`}
                                </Typography>
                            </Box>
                        ) : (

                            // Payout Multiplier for Flex Play Entries Container
                            showPayoutMultipliers(lineup.entry_type, lineup.entries.length).map((correctLegs, index) => {
                                const multiplier = calculatePayoutMultiplier(lineup.entry_type, lineup.entries.length, correctLegs);
                                if(multiplier === 0) {
                                    return null;
                                }
                                return (
                                    // Payout Multiplier Box for Each Correct Leg (Since Flex Play)
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            backgroundColor: "black",
                                            borderRadius: "1rem",
                                            border: "1px solid white",
                                            width: "25%",
                                            height: "80%",
                                            justifyContent: "center",
                                            padding: "1.5rem",
                                        }}
                                    >
                                        {/* Payout Multiplier for Each Correct Leg Display */}
                                        <Typography
                                            sx={{
                                                color: "limegreen",
                                                fontFamily: "monospace",
                                                fontWeight: "bold",
                                                fontSize: "1.3rem",
                                            }}
                                        >
                                            ${parseFloat(multiplier * lineup.entry_amount).toFixed(2)}
                                        </Typography>

                                        {/* Correct Legs and Multiplier Display */}
                                        <Typography
                                            sx={{
                                                color: "white",
                                                fontFamily: "monospace",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {correctLegs} of {lineup.entries.length} • {`${multiplier.toFixed(1)}x`}
                                        </Typography>
                                    </Box>
                                );
                            })
                        )}
                    </Box>
                )}              

                {/* Lineup Details Entries Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "1rem",
                        overflowY: "auto",
                        marginTop: "3%",
                        gap: 2.5,
                        marginBottom: "5%",
                    }}
                >
                    {lineup.entries.map((entry, index) => {
                        const percent = Math.min((entry.live_value / entry.projected_line) * 100, 100);

                        return (
                            // Progress Bar Container
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "black",
                                    borderRadius: "1rem",
                                    padding: "0.5rem",
                                    border: "white",
                                    width: "100%",
                                }}
                            >
                                {/* Player Picture */}
                                <img
                                    src={entry.player_picture}
                                    alt={entry.player_name}
                                    style={{
                                        width: "6rem",
                                        borderRadius: "5rem",
                                        marginRight: "1rem",
                                        border: `2px solid ${
                                            entry.status === "DNP" ? "gray" :
                                            (lineup.result === "WON" || lineup.result === "LOST")
                                              ? entry.status === "hit"
                                                ? "green"
                                                : entry.status === "miss"
                                                ? "red"
                                                : "white"
                                              : "white"
                                        }`,
                                        filter: entry.status === "DNP" ? "grayscale(50%) brightness(80%)" : "none",
                                        opacity: entry.status === "DNP" ? 0.90 : 1,
                                    }}
                                />

                                {/* Player Information Container */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                    }}
                                >
                                    {/* Player Name, Team Tri Code, w/ Game Matchup Container */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {/* Player Name and Team Tri Code */}
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                fontFamily: "monospace",
                                                color: "white",
                                            }}
                                        >
                                            {entry.player_name} - {entry.team_tri_code}
                                        </Typography>

                                        {/* Frozen Game Matchup */}
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                fontFamily: "monospace",
                                                color: "white",
                                                fontSize: "0.7rem",
                                                fontWeight: "bold",
                                            }}
                                        >   
                                            {entry.matchup}
                                        </Typography>
                                    </Box>


                                    {/* Progress Bar Container */}
                                    <Box
                                        sx={{
                                            position: "relative",
                                            backgroundColor: "rgba(0, 0, 0, 0.85)",
                                            height: "1rem",
                                            borderRadius: "5rem",
                                            overflow: "hidden",
                                            marginTop: "0.5rem",
                                            border: "1px solid white",
                                        }}
                                    >
                                        {/* Progress Bar w/ Filled Stat */}
                                        <Box
                                            sx={{
                                                width: entry.status === "DNP" ? "100%" : `${percent}%`,
                                                height: "100%",
                                                backgroundColor:
                                                    entry.status === "DNP" ? "#3f3f3f" :
                                                    (lineup.result === "WON" || lineup.result === "LOST")
                                                        ? entry.status === "hit"
                                                        ? "green"
                                                        : entry.status === "miss"
                                                        ? "red"
                                                        : "white"
                                                        : "white",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "white",
                                                fontFamily: "monospace",
                                                transition: "width 0.4s ease",
                                            }}
                                        />
                                            {entry.status === "DNP" && "DNP"}
                                    </Box>

                                    {/* Player Projection & User's Pick Arrow, w/ Stat Category Container */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            justifyContent: "center",
                                            marginTop: "-4rem",
                                        }}
                                    >
                                        {/* Player Projection and User's Pick Arrow */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "0.5rem",
                                            }}
                                        >
                                            {/* Player Name and Team Tri Code */}
                                            <Typography
                                                sx={{
                                                    fontFamily: "monospace",
                                                    fontWeight: "bold",
                                                }}>
                                                    {entry.users_pick === "Over" ? "↑" : entry.users_pick === "Under" ? "↓" : ""}
                                            </Typography>

                                            {/* Player Projected Line */}
                                            <Typography
                                                sx={{
                                                    fontFamily: "monospace",
                                                    fontWeight: "bold",
                                                }}>
                                                    {entry.projected_line ?? "-"}
                                            </Typography>
                                        </Box>

                                        {/* Player Stat Category Container */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: "monospace",
                                                    color: "white",
                                                    fontSize: "0.7rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {entry.line_category}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Player Live Stat Container */}
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: "100%",
                                            paddingTop: "1rem",
                                        }}
                                    >
                                        {/* Player Live Stat */}
                                        <Typography
                                                sx={{
                                                    position: "absolute",
                                                    fontFamily: "monospace",
                                                    left: `${percent}%`,
                                                    transform: "translateX(-90%)",
                                                    color: entry.status === "DNP"
                                                        ? "#3f3f3f"
                                                        : (lineup.result === "WON" || lineup.result === "LOST")
                                                            ? entry.status === "hit"
                                                            ? "green"
                                                            : entry.status === "miss"
                                                            ? "red"
                                                            : "white"
                                                            : "white",
                                                    fontWeight: "bold",
                                                }}>
                                                    {entry.live_value ?? "-"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Box>
    )
}

export default LineupDetails;
