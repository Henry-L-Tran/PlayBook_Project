import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TeamBanner from "./TeamBanner";
import { valorantTeamLogo } from "./TeamColor";
import ValorantTeamBanner from "./ValorantTeamBanner";


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

  const TeamBanner = ({ selectedMatch }) => {
    return (
      <Box>
        <Box
          component="img"
          src={selectedMatch?.team1_logo}
          alt={selectedMatch?.team1}
          sx={{ width: "60px", height: "60px", objectFit: "contain", mb: 1 }}
        />
        <Typography sx={{ color: "white" }}>VS</Typography>
        <Box
          component="img"
          src={selectedMatch?.team2_logo}
          alt={selectedMatch?.team2}
          sx={{ width: "60px", height: "60px", objectFit: "contain", mt: 1 }}
        />
      </Box>
    );
  };

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
          {selectedMatch.team1} @ {selectedMatch.team2}
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

        {/* All Player Squares Main Box/Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1.5vh 3vw",
            width: "100%",
            gap: "1.5vw",
          }}
        >
          {/* Away Team Players Column */}
          <Box sx={{ flex: 1, paddingBottom: "1.8vh" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                width: "40%",
                fontFamily: "monospace",
                marginBottom: "1.2vh",
                marginLeft: "28%",
                color: "white"
              }}
            >
              {selectedMatch.team1}
            </Typography>

            {awayPlayers.map((player, index) => (
              <Box
                key={index}
                sx={{
                  border: selectedSquare(player) ? "2px solid green" : "2px solid gray",
                  borderRadius: "1rem",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  marginBottom: "1.3vh",
                  width: "14vw",
                  height: "25vh",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  marginLeft: "5vw",
                }}
              >
                <Box sx={{ padding: "0.5rem" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "0.8vh" }}>
                    <img
                      src={valorantTeamLogo[player.org]?.logo || valorantTeamLogo["N/A"]}
                      alt={player.org}
                      style={{ width: "6.5vh", paddingTop: "10%" }}
                    />
                  </Box>
                  <Typography sx={{ fontFamily: "monospace", fontSize: "1.2rem", textAlign: "center", color: "white" }}>
                    {player.player}
                  </Typography>
                  <Typography
                    sx={{ fontFamily: "monospace", fontSize: "0.8rem", textAlign: "center", color: "gray" }}
                  >
                    vs {selectedMatch.team2}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.8vw", fontWeight: "bold", marginTop: "0.6vh", color: "white" }}
                    >
                      {lineRounding(getStatCategory(player))}
                    </Typography>
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.6vw", marginTop: "1.1vh", marginLeft: "0.5rem", color: "gray" }}
                    >
                      Kills
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", borderTop: "1px solid gray", width: "100%" }}>
                  <button
                    onClick={() => handleUserLines(player, "Under")}
                    style={{
                      flex: 1,
                      backgroundColor: selectedBetButton(player, "Under") ? "green" : "transparent",
                      color: "white",
                      padding: "0.5rem",
                      fontFamily: "monospace",
                      border: "none",
                      borderRight: "1px solid gray",
                      cursor: "pointer",
                      borderRadius: "0 0 0 1rem",
                    }}
                  >
                    ↓ Under
                  </button>
                  <button
                    onClick={() => handleUserLines(player, "Over")}
                    style={{
                      flex: 1,
                      backgroundColor: selectedBetButton(player, "Over") ? "green" : "transparent",
                      color: "white",
                      padding: "0.5rem",
                      fontFamily: "monospace",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "0 0 1rem 0",
                    }}
                  >
                    ↑ Over
                  </button>
                </Box>
              </Box>
            ))}
          </Box>

          <Box>
            <ValorantTeamBanner
              homeTeam={selectedMatch.team2}
              awayTeam={selectedMatch.team1}
              logos={valorantTeamLogo}
            />
          </Box>

          {/* Home Team Players Column */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                width: "40%",
                fontFamily: "monospace",
                marginBottom: "1.2vh",
                marginRight: "27%",
                color: "white"
              }}
            >
              {selectedMatch.team2}
            </Typography>

            {homePlayers.map((player, index) => (
              <Box
                key={index}
                sx={{
                  border: selectedSquare(player) ? "2px solid green" : "2px solid gray",
                  borderRadius: "1rem",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  marginBottom: "1.3vh",
                  width: "14vw",
                  height: "25vh",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  marginRight: "5vw",
                }}
              >
                <Box sx={{ padding: "0.5rem" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "0.8vh" }}>
                    <img
                      src={valorantTeamLogo[player.org]?.logo || valorantTeamLogo["N/A"]}
                      alt={player.org}
                      style={{ width: "6.5vh", paddingTop: "10%",}}
                    />
                  </Box>
                  <Typography sx={{ fontFamily: "monospace", textAlign: "center", color: "white" }}>
                    {player.player}
                  </Typography>
                  <Typography
                    sx={{ fontFamily: "monospace", fontSize: "0.8rem", textAlign: "center", color: "gray" }}
                  >
                    vs {selectedMatch.team1}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.8vw", fontWeight: "bold", marginTop: "0.6vh", color: "white" }}
                    >
                      {lineRounding(getStatCategory(player))}
                    </Typography>
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.6vw", marginTop: "1.1vh", marginLeft: "0.5rem", color: "gray" }}
                    >
                      Kills
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", borderTop: "1px solid gray", width: "100%" }}>
                  <button
                    onClick={() => handleUserLines(player, "Under")}
                    style={{
                      flex: 1,
                      backgroundColor: selectedBetButton(player, "Under") ? "green" : "transparent",
                      color: "white",
                      padding: "0.5rem",
                      fontFamily: "monospace",
                      border: "none",
                      borderRight: "1px solid gray",
                      cursor: "pointer",
                      borderRadius: "0 0 0 1rem",
                    }}
                  >
                    ↓ Under
                  </button>
                  <button
                    onClick={() => handleUserLines(player, "Over")}
                    style={{
                      flex: 1,
                      backgroundColor: selectedBetButton(player, "Over") ? "green" : "transparent",
                      color: "white",
                      padding: "0.5rem",
                      fontFamily: "monospace",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "0 0 1rem 0",
                    }}
                  >
                    ↑ Over
                  </button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ValorantLinesPopup;