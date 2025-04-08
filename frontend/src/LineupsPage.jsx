import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';


// Fetches and Displays the User's Lineups
const LineupsPage = ({ user, setActiveComponent }) => {
    const [userLineups, setUserLineups] = useState([]);
    const [activeLineupTabs, setActiveLineupTabs] = useState("Open");

    const filteredLineups = userLineups.filter(lineup =>
        activeLineupTabs === "Open"
            ? !lineup.evaluated
            : lineup.evaluated
    );

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
        // Main Container for the Entire Lineups Page
        <Box className="lineups-page"
            sx={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                overflowY: "auto",
            }}
        >
 
            {/* Funds Header */}
            <h1 className="flex items-center flex-col justify-center font-mono">
                Lineups
            </h1>

            {/* Lineups Page Content Container */}
            <Box className="lineups-page-content-container"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: "3%",
                    height: "100%",
                }}
            >
                {/* User Info Box Container */}
                <Box className="user-info-box"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        width: "30%",
                        height: "38%",
                        padding: 2,
                        borderRadius: "1rem",
                        border: "1px solid white",
                    }}
                >
                    {/* User's First and Last Name w/ Lineups Header Container */}
                    <Box className="user-info-name"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginBottom: "10%",
                        }}
                    >
                        {/* User's First and Last Name */}
                        <Typography
                            sx={{
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                                fontSize: "1.5rem",
                            }}
                        >
                            {user.first_name} {user.last_name}
                        </Typography>
                    </Box>

                    {/* Deposit Button */}
                    <button
                    onClick={() => setActiveComponent("funds")}
                        style={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        Deposit
                    </button>
                </Box>

                {/* Lineups Section Container */}
                <Box className="lineups-section"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "60%",
                        gap: 2,
                        marginLeft: "3%",
                    }}>

                    {/* Lineups Tabs Container */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            width: "80%",
                            marginBottom: "3%",
                        }}
                    >
                        <button
                            style={{
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                                cursor: "pointer",
                                borderRadius: "2rem",
                                width: "100%",
                                border: "1px solid white",
                            }}
                            onClick={() => setActiveLineupTabs("Open")} className={activeLineupTabs === "Open" ? "active-tab" : ""}>
                            Open
                        </button>

                        <button
                            style={{
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                                cursor: "pointer",
                                borderRadius: "2rem",
                                width: "100%",
                                border: "1px solid white",
                            }}
                            onClick={() => setActiveLineupTabs("Past")} className={activeLineupTabs === "Past" ? "active-tab" : ""}>
                            Past
                        </button>
                    </Box>
                    
            
                    {filteredLineups.map((lineup, idx) => (
                        <LineupBox key={idx} lineup={lineup} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

const LineupBox = ({ lineup }) => {
    const [lineupExpanded, setLineupExpanded] = useState(false);
    const gameStatusColor = lineup.result === "WON" ? "green" : lineup.result === "LOST" ? "red" : "gray";

    return (

        // Lineup Box Container
        <Box className="lineup-box"
            onClick={() => setLineupExpanded(!lineupExpanded)}
            sx={{
                borderRadius: "1rem",
                cursor: "pointer",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "80%",
                border: "1px solid white",
            }}
        >

            {/* Lineup Entry Header */}
            <Box className="lineup-header"
                sx={{
                    paddingTop: "4%",
                    paddingBottom: "2%",
                }}
            >

                {/* Lineup Entry Type and Amount */}
                <Typography
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                    }}>
                        {lineup.entries.length}-Pick ${lineup.potential_payout.toFixed(2)}
                </Typography>

                {/* Lineup Entry Type */}
                <Typography
                    sx={{
                        fontFamily: "monospace",
                        color: "white",
                        marginBottom: "4%",
                    }}
                >
                    ${lineup.entry_amount} {lineup.entry_type}
                </Typography>

                {/* Divider Line */}
                <Box
                    sx={{
                        borderBottom: "1px solid white",
                        width: "100%",
                        margin: "0.5rem auto",
                    }}
                />
            </Box>
            
            {/* Player Pictures and Entry Status Container */}
            <Box className="player-pictures-entry-status"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3%",
                    width: "100%",
                    flexWrap: "nowrap",
                }}
            >

                {/* Lineup Player Pictures Container */}
                <Box className="lineup-pictures"
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: 1,
                        paddingLeft: "1rem",
                    }}
                >
                    {lineup.entries.map((entry, idx) => (

                        // Player Pictures
                        <img
                            key={idx}
                            src={entry.player_picture}
                            alt={entry.player_name}
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                width: "5rem",
                                border: `2px solid ${entry.status === 'hit' ? 'green' : entry.status === 'miss' ? 'red' : 'gray'}`,
                                borderRadius: "10rem",
                                objectFit: "cover",
                                imageRendering: "auto",
                            }}
                        />
                    ))}
                </Box>

                {/* Lineup Entry Status Container */}
                <Box
                    sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingRight: "5%",
                    }}>
                    <Typography
                        sx={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            color: gameStatusColor,
                            fontSize: "1.3rem",
                        }}
                    >
                        {lineup.result || "Live"}
                    </Typography>
                </Box>
            </Box>

            {/* Lineup Details Container When Expanded */}
            {lineupExpanded && (
                <Box className="lineup-details"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
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
    const { player_name, line_category, projected_line, live_value, users_pick, status } = entry;
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
                {player_name} • {line_category} • {users_pick} • {projected_line}
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

