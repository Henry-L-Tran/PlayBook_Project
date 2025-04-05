import { Box, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


// Lineups Component For Lines Page/Popup
function Lineups({lineup, expand, onSubmit, onClose, isExpanded, pickUpdate}) {
    
    const [showLineupBuilderPopup, setShowLineupBuilderPopup] = useState(false);
    const [entryType, setEntryType] = useState(" ");

    // Function to Determine User Payout Depending On Amount of Legs and Flex or Power Play
    const calculatePayoutMultiplier = (entryType, totalLegs, correctLegs) => {
        if(entryType === "Flex Play") {
            if(totalLegs === 3) {
                if(correctLegs === 3) {
                    return 2.25;
                }
                if(correctLegs === 2) {
                    return 1;
                }
            }
            else if (totalLegs === 4) {
                if(correctLegs === 4) {
                    return 5;
                }
                if(correctLegs === 3) {
                    return 1.5;
                }
            }
            else if (totalLegs === 5) {
                if(correctLegs === 5) {
                    return 10;
                }
                if(correctLegs === 4) {
                    return 2;
                }
                if(correctLegs === 3) {
                    return 0.4;
                }
            }
            else if (totalLegs === 6) {
                if(correctLegs === 6) {
                    return 25;
                }
                if(correctLegs === 5) {
                    return 2;
                }
                if(correctLegs === 4) {
                    return 0.4;
                }
            }
        }
        else if (entryType === "Power Play") {
            if(totalLegs === 2) {
                if(correctLegs === 2) {
                    return 3;
                }
            }
            else if (totalLegs === 3) {
                if(correctLegs === 3) {
                    return 5;
                }
            }
            else if (totalLegs === 4) {
                if(correctLegs === 4) {
                    return 10;
                }
            }
            else if (totalLegs === 5) {
                if(correctLegs === 5) {
                    return 20;
                }
            }
            else if (totalLegs === 6) {
                if(correctLegs === 6) {
                    return 37.5;
                }
            }
        }

        return 1; 
    };

    const showPayoutMultipliers = (type, totalLegs) => {
        if(type === "Power Play") {
            return [totalLegs];
        }
        else if(type === "Flex Play") {
            if(totalLegs === 3) {
                return [3, 2];
            }
            if(totalLegs === 4) {
                return [4, 3];
            }
            if(totalLegs === 5) {
                return [5, 4, 3];
            }
            if(totalLegs === 6) {
                return [6, 5, 4];
            }
        }
        
        return [];

    }
    

    return (
        <>
            {/* Outer Container for the Lineups Bar */}
            <Box
                sx= {{
                    position: "fixed",
                    bottom: 0,
                    backgroundColor: "#111",
                    padding: "0.5 rem, 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #444",
                    width: "65rem",
                    height: "6rem",
                    borderRadius: "10rem", 
                    border: "2px solid white",
                    marginBottom: "1rem",
                }}
            >
                {/* Lineups Content */}
                <Box
                    sx={{
                        display: "flex",
                        gap: "0.5rem",
                        marginLeft: "1.5rem",
                    }}
                >
                    {lineup.map((entry, index) => (

                        // Player Pictures
                        <img
                            key={index}
                            src={entry.player_picture}
                            alt={entry.player_name}
                            style={{
                                width: "6rem",
                        
                                border: "2px solid white",
                                borderRadius: "10rem",
                                objectFit: "cover",
                                imageRendering: "auto",
                            }}
                        />
                    ))}
                </Box>

                {/* "Finalize Picks" Button */}
                <Button 
                    disableRipple
                    disableElevation
                    onClick={() => setShowLineupBuilderPopup(true)}
                    variant="text"
                    sx={{
                        backgroundColor: "transparent",
                        color: "white",
                        fontFamily: "monospace",
                        fontSize: "1rem",
                        textTransform: "none",
                        padding: 0,
                        minWidth: 0,
                        border: "none",
                        boxShadow: "none",
                        marginRight: "2rem",
                        "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                        },
                        "&:focus": {
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        },
                    }}
                >
                    Finalize Picks
                </Button>
            </Box>

        
            {/* Finalized Lineups Popup */}
            {showLineupBuilderPopup && (
                <>
                    {/* Overlay Background */}
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                        }}
                    />

                    {/* Lineup Builder Popup */}
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: "1rem",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "65rem",
                            height: "95%",
                            backgroundColor: "#111",
                            border: "2px solid white",
                            borderRadius: "1rem",
                            fontFamily: "monospace",
                            color: "white",
                            overflowY: "auto",
                        }}
                    >
                        {/* Lineup Builder Header */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography variant="h6">
                                Current Lineup
                            </Typography>
                            <Button
                                onClick={() => setShowLineupBuilderPopup(false)}
                                sx={{
                                    color: "white",
                                    fontSize: "1.5rem",
                                    textTransform: "none",
                                    padding: 0,
                                    minWidth: 0,
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        textDecoration: "underline",
                                    },
                                    "&:focus": {
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Close
                            </Button>

                            <Button
                                onClick={() => pickUpdate(null, "Clear All")}
                                sx = {{
                                    color: "white",
                                    fontSize: "1.5rem",
                                    fontFamily: "monospace",
                                    textTransform: "none",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        textDecoration: "underline",
                                    },
                                
                                }}
                            >
                                Clear All
                            </Button>
                        </Box>
    
                        {/* Player Square Lines */}
                        <Box 
                            sx={{
                                marginTop: "2rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                            }}
                        >
                            {lineup.map((player, index) => (
                                <Box
                                    key={index}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                        backgroundColor: "#222",
                                        borderRadius: "1rem",
                                        padding: "0.75rem 1rem",
                                    }}
                                >
                                    {/* Player Picture and Info Container */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            alignItems: "center",
                                        }}
                                    >
                                        <img
                                            src={player.player_picture}
                                            alt={player.player_name}
                                            style={{
                                                width: "4rem",
                                                borderRadius: "0.5rem",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Box>
                                            <Typography>
                                                {player.player_name}
                                            </Typography>

                                            <Typography>
                                                {player.team_tri_code} - {player.line_category}
                                            </Typography>

                                            <Typography>
                                                {player.projected_line} {player.line_category}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Over/Under Buttons Container */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {/* Over Button */}
                                        <Button
                                            onClick={() => pickUpdate(player.player_id, "Over")}
                                            sx={{
                                                backgroundColor: player.users_pick === "Over" ? "green" : "#222",
                                                color: "white",
                                                fontFamily: "monospace",
                                                textTransform: "none",
                                                padding: "0.5rem",
                                                border: "1px solid gray",
                                            }}
                                        >
                                            ↑ Over
                                        </Button>

                                        {/* Under Button */}
                                        <Button
                                            onClick={() => pickUpdate(player.player_id, "Under")}
                                            sx={{
                                                backgroundColor: player.users_pick === "Under" ? "green" : "#222",
                                                color: "white",
                                                fontFamily: "monospace",
                                                textTransform: "none",
                                                padding: "0.5rem 1rem",
                                                border: "1px solid gray",
                                            }}
                                        >
                                            ↓ Under
                                        </Button>

                                        <IconButton
                                            onClick={() => pickUpdate(player.player_id, "Remove")}
                                                sx={{
                                                    color: "white",
                                                    fontSize: "1.2rem",
                                                    "&:hover": {
                                                        backgroundColor: "transparent",
                                                        textDecoration: "#ff4d4d",
                                                    },
                                                }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                            
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Payout Multiplier Display */}
                        {entryType && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    textAlign: "center",
                                    marginTop: "2%",
                                    width: "90%",
                                    borderRadius: "1rem",
                                    padding: "1rem",
                                }}
                            >
                                {/* Flex/Power Play Buttons */}
                                {lineup.length < 2 ? (
                                    <Typography
                                        sx={{
                                            fontSize: "1.5rem",
                                            fontWeight: "bold",
                                            color: "red",
                                            fontFamily: "monospace",
                                            textAlign: "center",
                                        }}
                                    >
                                        Must select at least 2 plays to submit an entry
                                    </Typography>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            width: "90%",
                                        }}
                                    >

                                        {lineup.length === 2 ? (
                                            // If 2 Legs, Only Show Power Play
                                            <Button
                                                onClick={() => setEntryType("Power Play")}
                                                sx={{
                                                    backgroundColor: entryType === "Power Play" ? "green" : "#222",
                                                    color: "white",
                                                    fontFamily: "monospace",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    border: entryType === "Power Play" ? "2px solid white" : "1px solid gray",
                                                    "&:hover": {
                                                        backgroundColor: entryType === "Power Play" ? "green" : "#333",
                                                    },
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Power Play
                                                </Typography>
                                                {[...showPayoutMultipliers("Power Play", lineup.length)].map((correctLegs) => (
                                                    <Box
                                                        key={`Power-${correctLegs}`}
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: "0.5rem 1rem",
                                                            borderRadius: "1rem",
                                                            marginBottom: "1rem",
                                                        }}
                                                    >
                                                        <Typography>
                                                            {correctLegs} Correct
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                backgroundColor: entryType === "Power Play" ? "#a855f9" : "#555",
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                padding: "0.25rem 0.75rem",
                                                                borderRadius: "1rem",
                                                                fontSize: "0.875rem"
                                                            }}
                                                        >
                                                            {/* Payout Multiplier for Power Play */}
                                                            Payout Multiplier: {calculatePayoutMultiplier("Power Play", lineup.length, correctLegs)}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Button>
                                        ) : (

                                            // If There's More Than 2 Legs, Show Both Flex and Power Play
                                            ["Flex Play", "Power Play"].map((type) => (
                                                <Button
                                                    key={type}
                                                    onClick={() => setEntryType(type)}
                                                    sx={{
                                                        backgroundColor: entryType === type ? "green" : "#222",
                                                        color: "white",
                                                        fontFamily: "monospace",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        border: entryType === type ? "2px solid white" : "1px solid gray",
                                                        "&:hover": {
                                                            backgroundColor: entryType === type ? "green" : "#333",
                                                        },
                                                    }}
                                                >
                                                    {/* Button Title */}
                                                    <Typography
                                                        sx={{
                                                            fontWeight: "bold",
                                                        }}
                                                        >
                                                        {type}
                                                    </Typography>

                                                    {/* Flex/Power Payout Tiers */}
                                                    {showPayoutMultipliers(type, lineup.length).map((correctLegs) => (
                                                        <Box
                                                            key={`${type}-${correctLegs}`}
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                padding: "0.5rem 1rem",
                                                                borderRadius: "1rem",
                                                                marginBottom: "1rem",
                                                            }}
                                                        >
                                                            <Typography>
                                                                {correctLegs} Correct
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    backgroundColor: entryType === type ? "#a855f9" : "#555",
                                                                    color: "#fff",
                                                                    fontWeight: "bold",
                                                                    padding: "0.25rem 0.75rem",
                                                                    borderRadius: "1rem",
                                                                    fontSize: "0.875rem"
                                                                }}
                                                            >
                                                                Payout Multiplier: {calculatePayoutMultiplier(type, lineup.length, correctLegs)}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Button>
                                            ))
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Submit Button Container */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "2rem",
                            }}
                        >
                            {/* Submit Lineup Button */}
                            <button
                                onClick={onSubmit}
                                style={{
                                backgroundColor: "rgba(0, 0, 0, 0.3)",
                                color: "white",
                                outline: "1px solid white",
                                fontFamily: "monospace",
                                fontSize: "1rem",
                                padding: "0.75rem 2rem",
                                borderRadius: "2rem",
                                border: "none",
                                cursor: "pointer",
                                marginBottom: "2%",
                                }}
                            >
                                Submit Lineup
                            </button>
                        </Box>
                    </Box>
                </>
            )}
        </>
        
    );
}

export default Lineups;