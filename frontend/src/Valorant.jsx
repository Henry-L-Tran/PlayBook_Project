import React, { useState, useEffect } from "react";
import { Box, Typography, Collapse, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import Lineups from "./Lineups";
import { calculatePayoutMultiplier } from "./payoutMultiplier";
import { format, parse, set } from "date-fns";
import SearchBar from "./SearchBar";
import CenteredModal from "./utilities/CenteredModal";
import ValorantLinesPopup from "./ValorantLinesPopup";

function Valorant() {
  // State for Valorant match data
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [matchResults, setMatchResults] = useState([]);

  // Toggle states for section collapse/expand
  const [openLive, setOpenLive] = useState(true);
  const [openUpcoming, setOpenUpcoming] = useState(true);
  const [openCompleted, setOpenCompleted] = useState(true);

  // State for the popup modal and the selected match
  const [selectedMatch, setSelectedMatch] = useState(null);

  // New state to store kills data for the selected match (fetched from /VALROANT/player_kills)
  const [selectedMatchKills, setSelectedMatchKills] = useState(null);

  // States and variables for the betting lines UI (used if match is not completed)
  const [valLiveGames, setValLiveGames] = useState({
    gameData: [],
  });
  const [valSelectedGame, setvalselectedGame] = useState(null);
  const [valPlayerStats, setvalPlayerStats] = useState([]);
  const [viewLineCategory, setViewLineCategory] = useState("Kills");
  const lineCategoryOptions = [
    "Maps 1-2 Kills",
  ];
  const [lineup, setLineup] = useState({});
  const currentLineup = lineup[viewLineCategory] || [];
  const [showLineupBar, setShowLineupBar] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [currUser, setCurrUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userTotalWon, setUserTotalWon] = useState(0);
  const [userTotalEntriesValue, setUserTotalEntriesValue] = useState(0);
  const [showBettingLines, setShowBettingLines] = useState(false);


  const getStatCategory = (player) => {
    // Placeholder: return player's stat value (update as needed)
    return player.line || 0;
  };

  // Helper for round values (if applicable)
  const getRoundValue = (roundCt, roundT) =>
    roundCt === "N/A" ? roundT : roundCt;

  // Fetch live matches from the VALORANT/scores endpoint
  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch("http://localhost:8000/VALROANT/scores");
        const data = await response.json();
        if (data.message) {
          setLiveMatches([]);
        } else {
          const scores = data.gameData ? data.gameData : data;
          setLiveMatches(scores);
        }
      } catch (error) {
        console.error("Error fetching VALORANT live scores:", error);
      }
    };
    fetchLiveMatches();
    const interval1 = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval1);
  }, []);

  // Fetch upcoming matches from the VALORANT/matches endpoint
  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      try {
        const response = await fetch("http://localhost:8000/VALROANT/matches");
        const data = await response.json();
        if (data.message) {
          setUpcomingMatches([]);
        } else {
          const matches = data.gameData ? data.gameData : data;
          setUpcomingMatches(matches);
        }
      } catch (error) {
        console.error("Error fetching VALORANT upcoming matches:", error);
      }
    };
    fetchUpcomingMatches();
    const interval2 = setInterval(fetchUpcomingMatches, 30000);
    return () => clearInterval(interval2);
  }, []);

  // Fetch match results (recently completed matches) from the VALORANT/results endpoint
  useEffect(() => {
    const fetchMatchResults = async () => {
      try {
        const response = await fetch("http://localhost:8000/VALROANT/results");
        const data = await response.json();
        if (data.message) {
          setMatchResults([]);
        } else {
          const results = data.gameData ? data.gameData : data;
          setMatchResults(results);
        }
      } catch (error) {
        console.error("Error fetching VALORANT match results:", error);
      }
    };
    fetchMatchResults();
    const interval3 = setInterval(fetchMatchResults, 30000);
    return () => clearInterval(interval3);
  }, []);

  // When a completed match is selected (has a time_completed property), fetch its kill data
  useEffect(() => {
    if (selectedMatch && selectedMatch.time_completed) {
      fetch("http://localhost:8000/VALROANT/player_kills")
        .then((response) => response.json())
        .then((data) => {
          // Find the kill record matching the selected match's match_id.
          // Force both to string to eliminate type mismatches.
          const killRecord = data.find(
            (record) =>
              String(record.match_id) === String(selectedMatch.match_id)
          );
          console.log("Kill record found:", killRecord);
          setSelectedMatchKills(killRecord);
        })
        .catch((err) => {
          console.error("Error fetching kill record:", err);
          setSelectedMatchKills(null);
        });
    } else {
      setSelectedMatchKills(null);
    }
  }, [selectedMatch]);

    // Function to Fetch Player Season Stats for the Selected Game (Gets the Averages)
    useEffect(() => {
      const fetchvalPlayerStats = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/VALROANT/player_stats"
          );
          const data = await response.json();
          console.log("Player Stats: ", data.data.segments);
          setvalPlayerStats(data.data.segments);
        } catch (error) {
          console.error("Error: ", error);
        }
      };
      fetchvalPlayerStats();
    }, []);

    // Handles the Select/Deselect of Players Over/Under
    const handleUserLines = (player, usersPick) => {
  
      setLineup((prevLines) => {
        const categoryLineup = prevLines[viewLineCategory] || [];
  
        // Prevents Duplicate Players in the Same Lineup
        const noDuplicatePlayers = Object.values(prevLines).flat();
        const playerAlreadyExists = noDuplicatePlayers.find(
          (entry) => entry.player === player
        );
  
        if (
          playerAlreadyExists &&
          playerAlreadyExists.line_category !== viewLineCategory
        ) {
          console.log("Cannot use the same player more than once in a lineup.");
          return prevLines;
        }
  
        const existing = categoryLineup.find(
          (entry) => entry.player === player
        );
  
        let newCategoryLineup;
  
        if (existing) {
          if (existing.users_pick === usersPick) {
            newCategoryLineup = categoryLineup.filter(
              (entry) => entry.player_id !== player
            );
          } else {
            // If Player is Selected but Over/Under is Changed, Update the Existing Entry
            newCategoryLineup = categoryLineup.map((entry) =>
              entry.player_id === player
                ? { ...entry, users_pick: usersPick }
                : entry
            );
          }
        } else {
          // If Player is Not Selected, Add the Player to the Lineup
          const newEntry = {
            player_id: player.player,
            player_name: player.playerName,
            team_tri_code: player.teamTriCode,
            player_picture: player.playerPicture,
            line_category: viewLineCategory,
            projected_line: parseFloat(getStatCategory(player)),
            users_pick: usersPick,
            matchup: `${valSelectedGame.awayTeam.teamTriCode} @ ${valSelectedGame.homeTeam.teamTriCode}`,
          };
  
          newCategoryLineup = [...categoryLineup, newEntry];
        }
  
        return {
          ...prevLines,
          [viewLineCategory]: newCategoryLineup,
        };
      });
    };
  
    // Function to Submit the Users' Lineup to Backend
    const submitLineup = async () => {
      const allEntries = Object.values(lineup).flat();
  
      if (allEntries.length < 2 || allEntries.length > 6) {
        setModalMessage("Lineup must be between 2 and 6 players.");
        setIsModalOpen(true);
        return;
      }
  
      const sameTeam =
        new Set(allEntries.map((player) => player.team_tri_code)).size === 1;
      if (sameTeam) {
        setModalMessage("Lineup cannot contain players from the same team.");
        setIsModalOpen(true);
        return;
      }
  
      const currUser = JSON.parse(localStorage.getItem("currUser"));
  
      if (!currUser || !currUser.email) {
        setModalMessage("User not logged in.");
        setIsModalOpen(true);
        return;
      }
  
      const entryId = `${currUser.email}_${Date.now()}_${uuidv4()}`;
  
      if (!entryType || !entryAmount || entryAmount <= 0) {
        setModalMessage(
          "Select a valid entry type and/or input a valid entry amount."
        );
        setIsModalOpen(true);
        return;
      }
  
      const calculatePayout = calculatePayoutMultiplier(
        entryType,
        allEntries.length,
        allEntries.length
      );
  
      try {
        const response = await fetch("http://localhost:8000/lineups/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currUser.email,
            category: activeCategoryTab,
            entry_id: entryId,
            entry_type: entryType,
            entry_amount: Number(entryAmount),
            potential_payout: entryAmount * calculatePayout,
            entries: allEntries,
          }),
        });
  
        if (response.status === 200) {
          setModalMessage("Lineup submitted successfully!");
          setIsModalOpen(true);
          setLineup({});
          setShowBettingLines(false);
        } else {
          setModalMessage("Error submitting lineup.");
          setIsModalOpen(true);
        }
      } catch (error) {
        setModalMessage("Error submitting lineup.");
        setIsModalOpen(true);
      }
    };
  
    // Function to Highlight the Selected Over/Under Buttons Green
    const selectedBetButton = (player, pick) => {
      return currentLineup.some(
        (entry) => entry.player_id === player && entry.users_pick === pick
      );
    };
  
    // Function to Highlight the Selected Player Card Green
    const selectedSquare = (player) => {
      return currentLineup.some((entry) => entry.player_id === player);
    };
  
    // Function to Update the Lineup with the Selected Player's Pick in the Lineup Builder Popup
    const userPickUpdate = (player, pick) => {
      if (pick === "Clear All") {
        setLineup({});
        return;
      }
  
      setLineup((prevLines) => {
        const newPick = {};
  
        for (const category in prevLines) {
          const categoryLineup = prevLines[category];
  
          if (pick === "Remove") {
            const filteredLineup = categoryLineup.filter(
              (entry) => entry.player_id !== player
            );
            if (filteredLineup.length > 0) {
              newPick[category] = filteredLineup;
            }
          } else {
            newPick[category] = prevLines[category].map((entry) =>
              entry.player_id === player
                ? { ...entry, users_pick: pick }
                : entry
            );
          }
        }
        return newPick;
      });
    };


    const playersInMatch = (match) => {
      const awayOrg = match.team1;
      const homeOrg = match.team2;
    
      return valPlayerStats.filter(
        (player) =>
          player.org?.toUpperCase() === awayOrg ||
          player.org?.toUpperCase() === homeOrg
      );
    };


    const team1 = selectedMatch?.team1?.toUpperCase();
    console.log("TARGETS: ", team1)

    const team2 = selectedMatch?.team2?.toUpperCase();
    console.log("TARGETS: ", team2)

    const awayPlayers = valPlayerStats.filter((player) => {
      const playerOrg = player.org?.toUpperCase();
      return playerOrg === team1
      
    });

    const homePlayers = valPlayerStats.filter((player) => {
      const playerOrg = player.org?.toUpperCase();
      return playerOrg === team2
      
    });

    console.log(awayPlayers)
    console.log(homePlayers)
    console.log(valPlayerStats.length)

  // Render the betting lines modal (identical style to your NBA view)
  const renderBettingModal = () => {
    // For the betting lines UI (used when the match is not completed)
    // In this snippet, we filter players based on teamTriCode from the selected match.

    return (
      <Box
        sx={{
          position: "fixed",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          justifyContent: "center",
          fontFamily: "monospace",
          width: "100%",
          maxHeight: "100vh",
          overflowY: "auto",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1100,
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: "1rem",
            position: "relative",
            paddingBottom: "1rem",
          }}
        >
          {/* Header: Away Team @ Home Team */}
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              paddingTop: "3rem",
              fontFamily: "monospace",
            }}
          >
            {selectedMatch.team1} vs {selectedMatch.team2} - 2 Maps
          </Typography>
          <IconButton
            sx={{
              position: "absolute",
              right: "1rem",
              top: "1rem",
              "&:hover": { background: "none" },
              "&:focus": { outline: "none" },
            }}
            onClick={() => {
              setShowBettingLines(false);
              setSelectedMatch(null);
            }}
          >
            <CloseIcon />
          </IconButton>
          {/* Betting Lines Category Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2rem",
              gap: "2rem",
            }}
          >
            {lineCategoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setViewLineCategory(category)}
                style={{
                  fontFamily: "monospace",
                  backgroundColor: viewLineCategory === category ? "white" : "transparent",
                  color: viewLineCategory === category ? "black" : "white",
                  border: "1px solid gray",
                  borderRadius: "5rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                {category}
              </button>
            ))}
          </Box>
          {/* If the match is completed, display the Kills Overview */}
          {selectedMatch.time_completed ? (
            selectedMatchKills ? (
              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    gap: 4,
                    mt: 2,
                  }}
                >
                  {/* Team A Column */}
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
                      {selectedMatch.team1}
                    </Typography>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const playerName = selectedMatchKills[`player${i}a`];
                      const playerKills = selectedMatchKills[`player${i}a_kills`];
                      return (
                        <Box
                          key={i}
                          sx={{
                            width: "14rem",
                            height: "18rem",
                            border: "2px solid gray",
                            borderRadius: "1rem",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "1rem",
                          }}
                        >
                          {/* Placeholder Image */}
                          <img
                            src="https://diamond-dapp.vercel.app/sidebar/logo2.png"
                            alt="placeholder"
                            style={{
                              width: "6rem",
                              height: "6rem",
                              borderRadius: "50%",
                              marginBottom: "0.5rem",
                            }}
                          />
                          {/* Player Name */}
                          <Typography
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              textAlign: "center",
                              fontSize: "1rem",
                            }}
                          >
                            {playerName}
                          </Typography>
                          {/* Player Kills */}
                          <Typography
                            sx={{
                              fontFamily: "monospace",
                              textAlign: "center",
                              fontSize: "1rem",
                              mt: "0.3rem",
                            }}
                          >
                            {playerKills} Kills
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  {/* Team B Column */}
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
                      {selectedMatch.team2}
                    </Typography>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const playerName = selectedMatchKills[`player${i}b`];
                      const playerKills = selectedMatchKills[`player${i}b_kills`];
                      return (
                        <Box
                          key={i}
                          sx={{
                            width: "14rem",
                            height: "18rem",
                            border: "2px solid gray",
                            borderRadius: "1rem",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "1rem",
                          }}
                        >
                          {/* Placeholder Image */}
                          <img
                            src="https://diamond-dapp.vercel.app/sidebar/logo2.png"
                            alt="placeholder"
                            style={{
                              width: "6rem",
                              height: "6rem",
                              borderRadius: "50%",
                              marginBottom: "0.5rem",
                            }}
                          />
                          {/* Player Name */}
                          <Typography
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              textAlign: "center",
                              fontSize: "1rem",
                            }}
                          >
                            {playerName}
                          </Typography>
                          {/* Player Kills */}
                          <Typography
                            sx={{
                              fontFamily: "monospace",
                              textAlign: "center",
                              fontSize: "1rem",
                              mt: "0.3rem",
                            }}
                          >
                            {playerKills} Kills
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography sx={{ textAlign: "center", mt: 4 }}>
                Loading kill data...
              </Typography>
            )
          ) : (
            // For matches that are not completed, render the standard betting lines interface
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ textAlign: "center", mt: 2 }}>
                Betting Lines Interface Here...
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => setOpenLive(!openLive)}
          >
            <Typography variant="h5" sx={{ fontFamily: "monospace", flex: 1 }} align="center">
              Live Matches
            </Typography>
            {openLive ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Box>
          <Collapse in={openLive} sx={{ mt: 2 }}>
            {liveMatches.map((match, index) => {
              const team1Round = getRoundValue(match.team1_round_ct, match.team1_round_t);
              const team2Round = getRoundValue(
                match.team2_round_ct,
                match.team2_round_ct === "N/A" ? match.team2_round_t : match.team2_round_ct
              );
              return (
                <Box
                  key={index}
                  onClick={() => {
                    setSelectedMatch(match);
                    setShowBettingLines(true);
                  }}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid red",
                    borderRadius: "1rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Left: Team 1 logo */}
                    <Box sx={{ width: "50px", position: "relative", height: "50px" }}>
                      <Box
                        component="img"
                        src={match.team1_logo}
                        alt={`${match.team1} logo`}
                        sx={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          left: "30px",
                        }}
                      />
                    </Box>
                    {/* Center: Match Information */}
                    <Box sx={{ textAlign: "center", flex: 1, mx: 2 }}>
                      <Typography variant="h5" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                        {match.team1} vs {match.team2}
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: "monospace", fontWeight: "bold", mt: 1 }}>
                        Score: {match.score1} - {match.score2}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", mt: 1 }}>
                        Map: {match.current_map}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: "monospace", mt: 0.5 }}>
                        Map Score: {team1Round} - {team2Round}
                      </Typography>
                    </Box>
                    {/* Right: Team 2 logo */}
                    <Box sx={{ width: "50px", position: "relative", height: "50px" }}>
                      <Box
                        component="img"
                        src={match.team2_logo}
                        alt={`${match.team2} logo`}
                        sx={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          right: "30px",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Collapse>
        </Box>
      )}

      {/* Upcoming Matches Section */}
      <Box sx={{ mt: liveMatches.length > 0 ? 4 : 0 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => setOpenUpcoming(!openUpcoming)}
        >
          <Typography variant="h5" sx={{ fontFamily: "monospace", flex: 1 }} align="center">
            Upcoming Matches
          </Typography>
          {openUpcoming ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Box>
        <Collapse in={openUpcoming} sx={{ mt: 2 }}>
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match, index) => (
              <Box
                key={index}
                onClick={() => {
                  setSelectedMatch(match);
                  setShowBettingLines(true);
                }}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid gray",
                  borderRadius: "1rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                  cursor: "pointer",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ textAlign: "center", flex: 1, mx: 2 }}>
                    <Typography variant="h5" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                      {match.team1} vs {match.team2}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", mt: 1 }}>
                      {match.match_event}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", mt: 0.5 }}>
                      {match.time_until_match}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body" align="center" sx={{ fontFamily: "monospace" }}>
              No upcoming matches available
            </Typography>
          )}
        </Collapse>
      </Box>

      {/* Recently Completed Matches Section */}
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => setOpenCompleted(!openCompleted)}
        >
          <Typography variant="h5" sx={{ fontFamily: "monospace", flex: 1 }} align="center">
            Recently Completed
          </Typography>
          {openCompleted ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Box>
        <Collapse in={openCompleted} sx={{ mt: 2 }}>
          {matchResults.length > 0 ? (
            matchResults.map((match, index) => (
              <Box
                key={index}
                onClick={() => {
                  setSelectedMatch(match);
                  setShowBettingLines(true);
                }}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid green",
                  borderRadius: "1rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                  cursor: "pointer",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ textAlign: "center", flex: 1, mx: 2 }}>
                    <Typography variant="h5" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                      {match.team1} vs {match.team2}
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: "monospace", mt: 1 }}>
                      Score: {match.score1} - {match.score2}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", mt: 0.5 }}>
                      Match Completed: {match.time_completed}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body" align="center" sx={{ fontFamily: "monospace" }}>
              No recent matches available
            </Typography>
          )}
        </Collapse>
      </Box>

      {showBettingLines && selectedMatch && !selectedMatch.time_completed ? (
        <ValorantLinesPopup
          selectedMatch={selectedMatch}
          setShowBettingLines={setShowBettingLines}
          valPlayerStats={valPlayerStats}
          awayPlayers={awayPlayers}
          homePlayers={homePlayers}
          viewLineCategory={viewLineCategory}
          setViewLineCategory={setViewLineCategory}
          handleUserLines={handleUserLines}
          selectedBetButton={selectedBetButton}
          selectedSquare={selectedSquare}
          getStatCategory={getStatCategory}
          lineCategoryOptions={lineCategoryOptions}
        />
      ) : showBettingLines && selectedMatch && renderBettingModal()}
    </Box>
  );
}

export default Valorant;
