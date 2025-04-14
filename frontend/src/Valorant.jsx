import React, { useState, useEffect } from "react";
import { Box, Typography, Collapse, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";

function Valorant() {
  // State for Valorant match data
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [matchResults, setMatchResults] = useState([]);

  // Toggle states for section collapse/expand
  const [openLive, setOpenLive] = useState(true);
  const [openUpcoming, setOpenUpcoming] = useState(true);
  const [openCompleted, setOpenCompleted] = useState(true);

  // State for the popup modal and selected match
  const [showBettingLines, setShowBettingLines] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  // New state for the kills data corresponding to the selected match
  const [selectedMatchKills, setSelectedMatchKills] = useState(null);

  // States and variables for the betting lines UI (if match isn’t completed)
  const [viewLineCategory, setViewLineCategory] = useState("PTS");
  const lineCategoryOptions = [
    "PTS",
    "REB",
    "AST",
    "3PM",
    "TO",
    "PTS + REB",
    "PTS + AST",
    "REB + AST",
    "PTS + REB + AST",
    "BLKS + STLS",
  ];

  // Placeholder helper functions (adjust as needed for your Valorant data)
  const playersInGame = (match) => {
    return match.players || [];
  };

  const getStatCategory = (player) => {
    return player.stat || 0;
  };

  const selectedSquare = (playerId) => {
    return false;
  };

  const handleUserLines = (player, pick) => {
    console.log(`Player ${player.playerName} picked ${pick}`);
  };

  // Helper for round values (if applicable)
  const getRoundValue = (roundCt, roundT) =>
    roundCt === "N/A" ? roundT : roundCt;

  // When a match is selected and it is completed, fetch its kills data
  useEffect(() => {
    if (selectedMatch && selectedMatch.time_completed) {
      fetch("http://localhost:8000/VALROANT/player_kills")
        .then(response => response.json())
        .then(data => {
          // data is expected to be an array of kill records
          const killRecord = data.find(
            record => record.match_id === selectedMatch.match_id
          );
          setSelectedMatchKills(killRecord);
        })
        .catch(err => {
          console.error("Error fetching kill record", err);
          setSelectedMatchKills(null);
        });
    } else {
      setSelectedMatchKills(null);
    }
  }, [selectedMatch]);

  // Fetch live matches
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

  // Fetch upcoming matches
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
        console.error("Error fetching upcoming matches:", error);
      }
    };
    fetchUpcomingMatches();
    const interval2 = setInterval(fetchUpcomingMatches, 30000);
    return () => clearInterval(interval2);
  }, []);

  // Fetch match results (recently completed matches)
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
        console.error("Error fetching match results:", error);
      }
    };
    fetchMatchResults();
    const interval3 = setInterval(fetchMatchResults, 30000);
    return () => clearInterval(interval3);
  }, []);

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
                  border: "1px solid white",
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

      {/* Popup Modal for Betting Lines or Kills Overview */}
      {showBettingLines && selectedMatch && (
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
              margin: "2rem",
              padding: "2rem",
            }}
          >
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
            {/* If match is completed, try to display kills overview */}
            {selectedMatch.time_completed ? (
              selectedMatchKills ? (
                <Box>
                  <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    {selectedMatch.team1} vs {selectedMatch.team2} - Kills Overview
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
                    {/* Team A Column */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
                        {selectedMatch.team1}
                      </Typography>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Box key={i} sx={{ mt: 1, textAlign: "center" }}>
                          <Typography variant="body1">
                            {selectedMatchKills[`player${i}a`]} : {selectedMatchKills[`player${i}a_kills`]} Kills
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    {/* Team B Column */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
                        {selectedMatch.team2}
                      </Typography>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Box key={i} sx={{ mt: 1, textAlign: "center" }}>
                          <Typography variant="body1">
                            {selectedMatchKills[`player${i}b`]} : {selectedMatchKills[`player${i}b_kills`]} Kills
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ textAlign: "center" }}>Loading kill data...</Typography>
              )
            ) : (
              // Otherwise, display the betting lines interface
              <Box>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                  {selectedMatch.team1} @ {selectedMatch.team2}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", mt: 2 }}>
                  {lineCategoryOptions.map(category => (
                    <button
                      key={category}
                      onClick={() => setViewLineCategory(category)}
                      style={{
                        fontFamily: "monospace",
                        backgroundColor: viewLineCategory === category ? "white" : "transparent",
                        color: viewLineCategory === category ? "black" : "white",
                        border: "1px solid white",
                        borderRadius: "5rem",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </Box>
                <Typography sx={{ textAlign: "center", mt: 2 }}>
                  Betting Lines Interface Here...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Valorant;
