import Header from "./Header";
import { useState } from "react";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

function Home() {

  const [nbaLiveGames, setNbaLiveGames] = useState([]);

  useEffect(() => {
    const fetchNbaLiveGames = async () => {
      try {
        const response = await fetch("http://localhost:8000/nba/scores");
        const data = await response.json();
        setNbaLiveGames(data);
      }
      catch (error) {
        console.error("Error: ", error);
    }
  }

  fetchNbaLiveGames();
  const fetchTimer = setInterval(fetchNbaLiveGames, 30000);

  return () => clearInterval(fetchTimer);
}, []);

  return (
    
    <Box
      className="w-screen h-screen flex flex-col bg-cover bg-no-repeat"
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
      }}
    >

      <Header />
        <div className="flex flex-col items-center justify-center sm:p-8">
          <h1 className="text-6xl text-white font-mono">Welcome to PlayBook</h1>
        </div>

      <Box className="w-full p-8 text-white">
        <Typography variant="h4" className="font-mono mb-4">
          NBA Live Scores
        </Typography>

        {nbaLiveGames === 0 ? (
          <Typography> No scheduled games </Typography>
        ) : (
          nbaLiveGames.map((game, index) => (
            <Box key={index} className="mb-4 p-4 bg-gray-900 rounded-lg">
              <Box
                sx={{
                  display: "flex",
                  jsutifuContent: "flex-start",
                  alignItems: "center",
                  gap: "1rem",
                  fontFamily: "monospace",
                }}
                >
                <Typography variant="h6"
                  sx={{
                    
                  }}> {game.awayTeam.teamTriCode} </Typography>
                <Typography 
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}> {game.awayTeam.wins} - {game.awayTeam.losses} </Typography>
                <Typography variant="h6"> {game.homeTeam.teamTriCode} </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}> {game.homeTeam.wins} - {game.homeTeam.losses} </Typography>
                <Typography> {game.awayTeam.score} </Typography>
                <Typography> {game.homeTeam.score} </Typography>
                <Typography> {game.gameStatus} </Typography>
                <Typography> {game.gameClock} </Typography>
                <Typography> {game.gameTimeUTC} </Typography>
                <Typography> {game.periods} </Typography>

                <Box className="mt-2">
                  <Box className="grid grid-cols-5 text-white">
                    {game.homeTeam.periods.map((period, index) => (
                      <Typography key={index} className="text-center">{period.period} </Typography>
                    ))}

                    {game.awayTeam.periods.map((period, index) => (
                      <Typography key={index} className="text-center">{period.period} </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Home;
