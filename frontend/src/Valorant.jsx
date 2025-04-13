// Valorant.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

function Valorant() {
  // State for live matches and upcoming matches
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

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

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Live Matches Section: Render only if liveMatches array has data */}
      {liveMatches.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontFamily: "monospace" }}
          >
            Live Scores
          </Typography>
          {liveMatches.map((match, index) => (
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
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
                    Map Score: {match.team1_round_ct} - {match.team2_round_t}
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
          ))}
        </Box>
      )}

      {/* Upcoming Matches Section: This section always appears */}
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontFamily: "monospace", mt: liveMatches.length > 0 ? 4 : 0 }}
      >
        Upcoming Matches
      </Typography>
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >

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
        <Typography
          variant="h6"
          align="center"
          sx={{ fontFamily: "monospace" }}
        >
          No upcoming matches available.
        </Typography>
      )}
    </Box>
  );
}

export default Valorant;
