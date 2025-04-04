import { Box, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useState } from 'react';


// Lineups Component For Lines Page/Popup
function Lineups({lineup, expand, onSubmit, onClose, isExpanded, pickUpdate}) {
    const [showLineupBuilderPopup, setShowLineupBuilderPopup] = useState(false);
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
                <Box
                    sx={{
                        position: "fixed",
                        bottom: "1rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "65rem",
                        height: "55rem",
                        backgroundColor: "#111",
                        border: "2px solid white",
                        borderRadius: "1rem",
                        fontFamily: "monospace",
                        color: "white",
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
                                </Box>
                            </Box>
                        ))}
                    </Box>
                                
                    {/* Submit Button */}
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
                            }}
                        >
                            Submit Lineup
                        </button>
                    </Box>
                </Box>
            )}
        </>
        
    );
}

export default Lineups;