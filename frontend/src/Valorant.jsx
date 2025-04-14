// Valorant.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Valorant() {
  // State for live matches, upcoming matches and completed matches
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [matchResults, setMatchResults] = useState([]);

  // Toggle states for section collapse/expand
  const [openLive, setOpenLive] = useState(true);
  const [openUpcoming, setOpenUpcoming] = useState(true);
  const [openCompleted, setOpenCompleted] = useState(true);

  // Fetch live matches from the backend endpoint
  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await fetch("http://localhost:8000/VALROANT/scores");
        const data = await response.json();
        if (data.message) {
          setLiveMatches([]);
        } else {
          // Use the gameData property if available, otherwise assume data is the array
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

  // Fetch upcoming matches from the backend endpoint
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

  // Fetch match results from the backend endpoint
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

  // Helper function to choose correct round value for live matches
  const getRoundValue = (roundCt, roundT) => roundCt === "N/A" ? roundT : roundCt;

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
          <Collapse in={openLive}>
            {liveMatches.map((match, index) => {
              const team1Round = getRoundValue(match.team1_round_ct, match.team1_round_t);
              const team2Round = getRoundValue(match.team2_round_ct, match.team2_round_ct === "N/A" ? match.team2_round_t : match.team2_round_ct);
              return (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid red",
                    borderRadius: "1rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Left container for team1 logo */}
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
                    {/* Center: Live Match Information */}
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
                    {/* Right container for team2 logo */}
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
        <Collapse in={openUpcoming}>
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid white",
                  borderRadius: "1rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Center: Upcoming Match Information */}
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
            <Typography variant="h6" align="center" sx={{ fontFamily: "monospace" }}>
              No upcoming matches available.
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
        <Collapse in={openCompleted}>
          {matchResults.length > 0 ? (
            matchResults.map((match, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid green",
                  borderRadius: "1rem",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Center: Completed Match Information */}
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
            <Typography variant="h6" align="center" sx={{ fontFamily: "monospace" }}>
              No recent matches available.
            </Typography>
          )}
        </Collapse>
      </Box>
    </Box>
  );
}

export default Valorant;
