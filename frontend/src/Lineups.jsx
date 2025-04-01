import { Box } from '@mui/material';


// Lineups Component For Lines Page/Popup
function Lineups({lineup, expand, onSubmit, onClose, isExpanded}) {
    return (

        // Outer Container for the Lineups Bar
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
                width: "55%",
                height: "10%",
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
            <button onClick={expand}
                sx={{
                    color: "white",
                }}
            >
                Finalize Picks
            </button>
        </Box>
    );
}

export default Lineups;