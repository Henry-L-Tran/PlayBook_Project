import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';


// Fetches and Displays the User's Lineups
const LineupsPage = ({ user }) => {
    const [userLineups, setUserLineups] = useState([]);

    useEffect(() => {
        const fetchUserLineups = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/lineups/user/${user.email}`);
                // The Newest Lineups Will Be At the Top
                setUserLineups(response.data.lineups.reverse());
            }
            catch (error) {
                console.error("Error fetching user's lineups: ", error);
            }
        };

        fetchUserLineups();

        // Refreshes User's Lineups Every 20 Seconds
        const refreshTimer = setInterval(fetchUserLineups, 20000);
        return () => clearInterval(refreshTimer);
    }, [user.email]);


    return (
        <>

            {/* User Info Box Container */}
            <Box className="user-info-box"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "black",
                    width: "20%",
                    padding: 2,
                    borderRadius: "1rem",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "gray",
                        textAlign: "center",
                    }}
                >
                    {user.first_name} {user.last_name}
                </Typography>
            </Box>

            {/* Lineups Section Container */}
            <Box className="lineups-section"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    gap: 2,
                    backgroundColor: "gray",
                }}>
                {userLineups.map((lineup, idx) => (
                    <LineupBox key={idx} lineup={lineup} />
                ))}
            </Box>
        </>
    );
}

const LineupBox = ({ lineup }) => {
    const [lineupExpanded, setLineupExpanded] = useState(false);
    const gameStatusColor = lineup.result === "WON" ? "green" : lineup.result === "LOST" ? "red" : "gray";

    return (

        // LineupBox Container
        <Box className="lineup-box"
            onClick={() => setLineupExpanded(!lineupExpanded)}
            sx={{
                borderRadius: "1rem",
                cursor: "pointer",
                backgroundColor: "black",
                width: "40%",
            }}
        >

            {/* Lineup Entry Header */}
            <Box className="lineup-header">

                {/* Lineup Entry Type and Amount */}
                <Typography
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "gray",
                        textAlign: "center",
                    }}>
                        {lineup.entries.length}-Pick ${lineup.potential_payout.toFixed(2)}
                </Typography>

                {/* Lineup Entry Type */}
                <Typography
                    sx={{
                        fontFamily: "monospace",
                        color: "gray",
                    }}
                >
                    {lineup.entry_type}
                </Typography>

                {/* Lineup Entry Status Container */}
                <Box>
                    <Typography
                        sx={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            color: gameStatusColor,
                        }}
                    >
                        {lineup.result || "Live"}
                    </Typography>
                </Box>
            </Box>

            {/* Lineup Player Pictures Container */}
            <Box className="lineup-pictures"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {lineup.entries.map((entry, idx) => (

                    // Player Pictures
                    <img
                        key={idx}
                        src={entry.player_picture}
                        alt={entry.player_name}
                        style={{
                            width: "5rem",
                            border: `2px solid ${entry.status === 'hit' ? 'green' : entry.status === 'miss' ? 'red' : 'gray'}`,
                            borderRadius: "10rem",
                            objectFit: "cover",
                            imageRendering: "auto",
                        }}
                    />
                ))}
            </Box>

            {/* Lineup Details Container When Expanded */}
            {lineupExpanded && (
                <Box className="lineup-details"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "gray",
                    }}
                >
                    {lineup.entries.map((entry, idx) => (
                        <UserLineup
                        key={idx}
                            entry={entry}
                        />
                    ))}
                </Box>
            )}
        </Box>
    )
}


const UserLineup = ({ entry }) => {
    const { player_name, line_category, projected_line, live_value, user_pick, status } = entry;
    const percent = Math.min((live_value / projected_line) * 100, 100);
    const barColor = status === "hit" ? "green" : status === "miss" ? "red" : "gray";

    return (
        // User's Player Line Container
        <Box className="player-line"
            sx={{
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Player Stats */}
            <Typography
                sx={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                }}>
               {player_name} • {line_category} • {user_pick} {projected_line}
            </Typography>

            {/* Progress Bar Container */}
            <Box className="progress-bar-container">

                {/* Progress Bar */}
                <Box
                    className="progress-bar-fill"
                    style={{width: `${percent}%`, backgroundColor: barColor}}
                >
                </Box>

                {/* Player's Live Value */}
                <Typography className="live-value">
                    {live_value ?? "-"}
                </Typography>
            </Box>
        </Box>
    );
};



export default LineupsPage;

