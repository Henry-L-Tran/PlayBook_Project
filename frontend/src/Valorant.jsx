// Valorant.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

function Valorant() {
  // Initialize state as an empty array, since the backend returns an array.
  const [valScores, setValScores] = useState([]);

  useEffect(() => {
    const fetchValScores = async () => {
      try {
        const response = await fetch("http://localhost:8000/VALROANT/scores");
        const data = await response.json();
        if (data.message) {
          setValScores([]);
        } else {
          const scores = data.gameData ? data.gameData : data;
          setValScores(scores);
        }
      } catch (error) {
        console.error("Error fetching VALORANT scores:", error);
      }
    };

    fetchValScores();
    const interval = setInterval(fetchValScores, 30000);
    return () => clearInterval(interval);
  }, []);

  if (valScores.length === 0) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <Typography variant="h6" align="center" sx={{ fontFamily: "monospace" }}>
          No Valorant live scores available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontFamily: "monospace" }}>
        VALORANT Live Scores
      </Typography>
      {valScores.map((match, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: "2px solid red",
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
                  left: "30px", // shift left
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
                  right: "30px", // shift right
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Valorant;
