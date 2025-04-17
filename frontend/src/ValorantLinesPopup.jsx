import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ValorantLinesPopup = ({
  selectedMatch,
  awayPlayers,
  homePlayers,
  valPlayerStats,
  viewLineCategory,
  setViewLineCategory,
  handleUserLines,
  selectedBetButton,
  selectedSquare,
  getStatCategory,
  setShowBettingLines,
  lineCategoryOptions,
}) => {

// Function to Round the Player's Line
  const lineRounding = (line) => {
    const lineInteger = parseFloat(line);
    const lineDecimal = lineInteger % 1;

    // If the Line is Less Than 0.3, or Greater Than 0.7, Use 0.5 Line
    if (lineDecimal >= 0.3 && lineDecimal <= 0.7) {
      return Math.floor(lineInteger) + 0.5;
    } else {
      // If Anything Else, Use Flat Line
      return Math.round(lineInteger).toString();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        width: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        overflowY: "auto",
        paddingBottom: "5%",
        fontFamily: "monospace",
      }}
    >
      <Box sx={{ padding: "2rem", position: "relative" }}>
        <IconButton
          sx={{ position: "absolute", top: 20, right: 20, color: "white" }}
          onClick={() => setShowBettingLines(false)}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" align="center" sx={{ color: "white", mb: 3 }}>
          {selectedMatch.team1} vs {selectedMatch.team2}
        </Typography>

        {/* Line category buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          {lineCategoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => setViewLineCategory(category)}
              style={{
                backgroundColor:
                  viewLineCategory === category ? "white" : "transparent",
                color: viewLineCategory === category ? "black" : "white",
                border: "1px solid white",
                borderRadius: "999px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              {category}
            </button>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {[{ label: selectedMatch.team1, players: awayPlayers }, { label: selectedMatch.team2, players: homePlayers }].map(
            (side, idx) => (
              <Box key={idx} sx={{ flex: 1, minWidth: "300px" }}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ color: "white", mb: 2 }}
                >
                  {side.label}
                </Typography>

                {side.players?.map((player, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: selectedSquare(player)
                        ? "2px solid green"
                        : "2px solid gray",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      padding: "1rem",
                      mb: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ color: "white", fontSize: "1.1rem" }}>
                      {player.player}
                    </Typography>
                    <Typography sx={{ color: "gray", fontSize: "0.9rem" }}>
                      {lineRounding(getStatCategory(player))} Kills
                    </Typography>

                    <Box sx={{ display: "flex", mt: 1, width: "100%" }}>
                      <button
                        onClick={() => handleUserLines(player, "Under")}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          backgroundColor: selectedBetButton(player, "Under") ? "green" : "transparent",
                          color: "white",
                          border: "1px solid gray",
                          borderRight: "none",
                          borderRadius: "0 0 0 10px",
                          cursor: "pointer",
                        }}
                      >
                        ↓ Under
                      </button>
                      <button
                        onClick={() => handleUserLines(player, "Over")}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          backgroundColor: selectedBetButton(player, "Over") ? "green" : "transparent",
                          color: "white",
                          border: "1px solid gray",
                          borderRadius: "0 0 10px 0",
                          cursor: "pointer",
                        }}
                      >
                        ↑ Over
                      </button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ValorantLinesPopup;
