import { Box, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { calculatePayoutMultiplier, showPayoutMultipliers } from './payoutMultiplier';  


// Lineups Component For Lines Page/Popup
function Lineups({
    lineup, 
    expand,
    onSubmit, 
    onClose, 
    isExpanded, 
    pickUpdate,
    entryType,
    setEntryType,
    entryAmount,
    setEntryAmount}) {
    
    const [showLineupBuilderPopup, setShowLineupBuilderPopup] = useState(false);
    

    return (
        <>
            {/* Outer Container for the Lineups Bar */}
            <Box
                sx= {{
                    position: "absolute",
                    bottom: "0.5vh",
                    backgroundColor: "#111",
                    padding: "0.5rem, 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #444",
                    width: "45vw",
                    height: "9vh",
                    borderRadius: "10rem", 
                    border: "2px solid white",
                    marginBottom: "1rem",
                    zIndex: 1300,
                    left: "27vw",
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
                            zIndex: 1350,
                        }}
                    />

                    {/* Lineup Builder Popup */}
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: "2.5vh",
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
                            zIndex: 1350,
                        }}
                    >
                        {/* Lineup Builder Header */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            padding="1vh"
                            
                        >
                            <Typography 
                                sx = {{
                                    color: "white",
                                    fontSize: "1.5rem",
                                    fontFamily: "monospace",
                                    paddingLeft: "1.2vw",
                                }}
                            >
                                Current Lineup: {lineup.length}
                            </Typography>
                            <Button
                                onClick={() => setShowLineupBuilderPopup(false)}
                                sx={{
                                    color: "white",
                                    fontSize: "1.5rem",
                                    fontFamily: "monospace", 
                                    marginRight: "4vw",
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
                                    marginRight: "0.7vw",
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
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.2vh",
                                padding: "2%",
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
                                        border: "1px solid gray",
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
                                                width: "7rem",
                                                borderRadius: "0.5rem",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx = {{
                                                    fontSize:"1.2rem",
                                                    fontWeight: "bold",
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                {player.player_name}
                                            </Typography>

                                            <Typography
                                                sx = {{
                                                    fontSize:"1.2rem",
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                {player.team_tri_code} - {player.line_category}
                                            </Typography>

                                            <Typography
                                                sx = {{
                                                    fontSize:"1.2rem",
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                <span style={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.2rem"
                                                }}
                                                > 
                                                    {player.projected_line} </span> {player.line_category}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box>
                                        {}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "0.2vw",
                                            marginLeft: "auto",
                                            
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

                                    {/* Over/Under Buttons Container */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            position: "relative",
                                            bottom: "1vh",
                                            left: "0.3vw",
                                            flexDirection: "column",
                                            marginBottom: "5vh"
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => pickUpdate(player.player_id, "Remove")}
                                                sx={{
                                                    color: "white",
                                                    fontSize: "1.5rem",

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
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                textAlign: "center",
                                marginTop: "2%",
                                width: "100%",
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
                                    Must select at least 2 plays to submit an entry.
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
                                                backgroundColor: "#222",
                                                color: "white",
                                                fontFamily: "monospace",
                                                display: "flex",
                                                flexDirection: "column",
                                                border: entryType === "Power Play" ? "2px solid green" : "1px solid gray",
                                                "&:hover": {
                                                    borderColor: entryType === "Power Play" ? "green" : "#333",
                                                },
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.2rem",
                                                    fontFamily: "monospace",
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
                                                        gap: "0.5vw",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "1.2rem",
                                                            fontFamily: "monospace",
                                                        }}
                                                    >
                                                        {correctLegs} Correct
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            backgroundColor: entryType === "Power Play" ? "#a855f9" : "#555",
                                                            color: "#fff",
                                                            fontWeight: "bold",
                                                            padding: "0.25rem 0.75rem",
                                                            borderRadius: "1rem",
                                                            fontSize: "0.875rem",
                                                            fontFamily: "monospace",
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
                                                    backgroundColor: "#222",
                                                    color: "white",
                                                    fontFamily: "monospace",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    border: entryType === type ? "2px solid green" : "1px solid gray",
                                                    "&:hover": {
                                                        backgroundColor: "#333",
                                                        borderColor: entryType === type ? "green" : "white",
                                                    },
                                                    "&:active": {
                                                        borderColor: "green",
                                                    }
                                                }}
                                            >
                                                {/* Button Title */}
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: "1.2rem",
                                                        fontFamily: "monospace",
                                                        marginBottom: "1vh",
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
                                                            padding: "0.2rem 1rem",
                                                            borderRadius: "1rem",
                                                            marginBottom: "1rem",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: "1.2rem",
                                                                fontFamily: "monospace",
                                                            }}
                                                        >
                                                            {correctLegs} Correct
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                backgroundColor: entryType === type ? "#a855f9" : "#555",
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                padding: "0.25rem 0.75rem",
                                                                borderRadius: "1rem",
                                                                fontSize: "0.875rem",
                                                                marginLeft: "0.5vw",
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
                        

                        {/* Entry Amount Input Container */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "4%",
                                marginLeft: "3.5%",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginLeft: "8%"
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "monospace",
                                        fontSize: "1.3rem",
                                        marginRight: "0.5vw",
                                        marginTop: "2%",
                                    }}
                                >
                                    Entry Amount:
                                </Typography>

                                <input
                                    type="number"
                                    value={entryAmount}
                                    min="1"
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setEntryAmount(inputValue === "" ? "" : Number(inputValue));
                                    }}
                                    placeholder="Enter Amount"
                                    style={{
                                        backgroundColor: "#222",
                                        color: "white",
                                        border: "1px solid gray",
                                        borderRadius: "1rem",
                                        width: "12rem",
                                        fontSize: "1.1rem",
                                        padding: "0.5rem 1rem",
                                        paddingLeft: "0.5vw",
                                    }}
                                />
                            </Box>
                            
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    marginRight: "5.5%",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "monospace",
                                        fontSize: "1.3rem",
                                        marginRight: "0.3vw",
                                        marginTop: "0.5vh",
                                    }}
                                >
                                    To Win:
                                </Typography>

                                {/* Potential Winnings Display Contianer */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "0.5rem 1rem",
                                        border: "1px solid gray",
                                        borderRadius: "1rem",
                                        backgroundColor: "#222",
                                        width: "10vw",
                                        marginRight: "3.2vw"
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "1.1rem",
                                            textAlign: "center",
                                            color: "white",
                                        }}
                                    >
                                        {(entryAmount * calculatePayoutMultiplier(entryType, lineup.length, lineup.length)).toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>       

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
                                fontSize: "1.3rem",
                                padding: "0.75rem 2rem",
                                borderRadius: "2rem",
                                border: "none",
                                cursor: "pointer",
                                marginTop: "2vh",
                                marginBottom: "2%",
                                width: "78%",
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