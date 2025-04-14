import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import LineupDetails from "./LineupDetails";



// Fetches and Displays the User's Lineups
const LineupsPage = ({ user, setActiveComponent }) => {
    const [userLineups, setUserLineups] = useState([]);
    const [activeLineupTabs, setActiveLineupTabs] = useState("Open");
    const [expandLineupDetails, setExpandLineupDetails] = useState(null);

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


    // ***Taking This Function From Dashboard.jsx and Using it Here For LineupDetails.jsx***
    const [nbaLiveGames, setNbaLiveGames] = useState({ gameData: [] });

    useEffect(() => {
    const fetchNbaLiveGames = async () => {
        try {
        const response = await fetch("http://localhost:8000/nba/scores");
        const data = await response.json();
        setNbaLiveGames(data);
        } catch (error) {
        console.error("Error fetching NBA live games:", error);
        }
    };

  fetchNbaLiveGames();
  const interval = setInterval(fetchNbaLiveGames, 30000);
  return () => clearInterval(interval);
}, []);


    return (
        <>
            {/* Main Container for the Entire Lineups Page */}
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
                        minheight: "100vh",
                        gap: 3,
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
                            position: "sticky",
                            top: "16%",
                        }}
                    >
                        {/* User's First and Last Name w/ Lineups Header Container */}
                        <Box className="user-info-name"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                marginBottom: "2%",
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
                                    marginTop: "15%",
                                }}
                            >
                                {user.first_name} {user.last_name}
                            </Typography>
                        </Box>

                        {/* Divider Line */}
                            <Box
                            sx={{
                                borderBottom: "1px solid white",
                                width: "85%",
                                margin: "0.5rem auto",
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {/* User's Wins */}
                            <Typography
                                sx={{
                                    fontFamily: "monospace",
                                    fontWeight: "bold",
                                    color: "green",
                                    textAlign: "center",
                                    fontSize: "1.5rem",
                                }}
                            >
                                {user?.wins ?? 0}
                            </Typography>
                            

                            {/* Entries Won Text */}
                            <Typography
                                sx={{
                                    fontFamily: "monospace",
                                    color: "white",
                                    textAlign: "center",
                                }}
                            >
                                Entries Won
                            </Typography>
                        </Box>


                        {/* Divider Line */}
                        <Box
                            sx={{
                                borderBottom: "1px solid white",
                                width: "85%",
                                margin: "0.5rem auto",
                            }}
                        /> 

                        {/* Deposit Button */}
                        <Button
                        onClick={() => setActiveComponent("funds")}
                            style={{
                                marginTop: "4%",
                                fontFamily: "monospace",
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                border: "2px solid white",
                                padding: "0.5rem 12rem",
                                borderRadius: "0.5rem",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                                "&:focus": {
                                    border: "none",
                                    outline: "none",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            Deposit
                        </Button>
                    </Box>

                    {/* Lineups Section Container */}
                    <Box className="lineups-section"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%",
                            gap: 2,
                            marginLeft: "3%",
                        }}>

                        {/* Lineups Open/Past Tabs Container */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                                width: "100%",
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
                                    border: activeLineupTabs === "Open" ? "3.5px solid white" : "1px solid white",
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
                                    border: activeLineupTabs === "Past" ? "3.5px solid white" : "1px solid white",
                                }}
                                onClick={() => setActiveLineupTabs("Past")} className={activeLineupTabs === "Past" ? "active-tab" : ""}>
                                Past
                            </button>
                        </Box>
                        
                        {/* Shows Filtered Lineups Based on the Selected Tab */}
                        <Box className="filtered-lineups"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 5,
                                width: "100%",
                            }}
                        >
                            {(() => {
                                const filteredLineups = userLineups.filter(lineup => {
                                    const entryFinal = lineup.evaluated === true || lineup.result === "WON" || lineup.result === "LOST";
                                    return activeLineupTabs === "Open" ? !entryFinal : entryFinal;
                            });
                        
                                return filteredLineups.length === 0 ? (
                                    <Typography
                                        sx={{
                                            fontFamily: "monospace",
                                            fontWeight: "bold",
                                            color: "white",
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* Shows No Open Lineups or No Past Lineups */}
                                        {activeLineupTabs === "Open" ? (
                                            <div style={{ textAlign: "center" }}>

                                                {/* Currently No Open Lineups Text */}
                                                <Typography
                                                    sx={{
                                                        fontFamily: "monospace",
                                                        fontSize: "1.2rem",
                                                        marginTop: "1rem",
                                                    }}
                                                >
                                                    Currently No Open Lineups!
                                                </Typography>

                                                {/* Place a Lineup Button */}
                                                <Button
                                                variant="contained"
                                                onClick={() => (setActiveComponent("lineup"))}
                                                sx={{
                                                    fontFamily: "monospace",
                                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                    border: "2px solid white",
                                                    padding: "1rem 5.5rem",
                                                    borderRadius: "0.5rem",
                                                    color: "white",
                                                    marginTop: "1rem",
                                                    fontWeight: "bold",
                                                    "&:hover": {
                                                    backgroundColor: "transparent",
                                                    color: "white",
                                                    },
                                                }}
                                                >
                                                Place a Lineup
                                                </Button>
                                            </div>
                                            ) : (
                                            <Typography
                                                sx={{
                                                fontFamily: "monospace",
                                                fontSize: "1.2rem",
                                                textAlign: "center",
                                                marginTop: "1rem",
                                                }}
                                            >
                                                Currently No Past Lineups!
                                            </Typography>
                                            )}
                                    </Typography>
                                ) : (
                                    filteredLineups.map((lineup, idx) => (
                                        <LineupBox 
                                            key={idx} 
                                            lineup={lineup} 
                                            onClick={() => setExpandLineupDetails(lineup)} 
                                        />
                                    ))
                                );
                            })()}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Lineup Details Popup */}
            {expandLineupDetails && (
                <LineupDetails
                    lineup={expandLineupDetails}
                    onClose={() => setExpandLineupDetails(null)}
                    liveGames={nbaLiveGames}
                />
            )}
        </>
    );
}

const LineupBox = ({ lineup, onClick }) => {
    const gameStatusColor = lineup.result === "WON"
        ? "green"
        : lineup.result === "LOST"
        ? "red"
        : lineup.result === "REFUNDED"
        ? "gray"
        : "white";

    return (
        // Lineup Date and Box Container
        <Box className="lineup-content-container"
            onClick={onClick}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
            {/* Lineup Date Container */}
            <Box className="lineup-date"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "1%",
                }}
            >
                {/* Lineup Date */}
                <Typography
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    {lineup.time ? `${format(new Date(lineup.time), "MMMM d, yyyy")}` : "Lineup Date"}
                </Typography>
            </Box>


            {/* Lineup Box Container */}
            <Box className="lineup-box"
                onClick={onClick}
                sx={{
                    borderRadius: "1rem",
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    width: "100%",
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
                        {lineup.entries.map((entry, idx) => {

                            const refunded = lineup.result === "REFUNDED";
                            const inactivePlayer = entry.status === "DNP" || refunded;
                            
                            return (
                                // Player Pictures
                                <img
                                    key={idx}
                                    src={entry.player_picture}
                                    alt={entry.player_name}
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        width: "5rem",
                                        border: `2px solid ${
                                            entry.status === "DNP" ? "gray" :
                                            entry.status === "hit" ? "green" :
                                            entry.status === "miss" ? "red" :
                                            entry.live_value == null ? "white" :
                                            "white"
                                        }`,
                                        borderRadius: "10rem",
                                        objectFit: "cover",
                                        imageRendering: "auto",
                                        filter: inactivePlayer ? "grayscale(50%) brightness(80%)" : "none",
                                        opacity: inactivePlayer ? 0.9 : 1,
                                    }}
                                />
                            );
                        })}
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
            </Box>
        </Box>
    )
}

export default LineupsPage;

