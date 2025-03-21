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
    };

    fetchNbaLiveGames();
    const fetchTimer = setInterval(fetchNbaLiveGames, 30000);

    return () => {
      clearInterval(fetchTimer);
    }
  }, []);
    


  const gameClockConverter = (isoTime) => {
    if(!isoTime)
      return "00:00";

    const time = isoTime.match(/PT(\d+)M(\d+(\.\d*)?)S/);
    if(!time)
      return isoTime;

    let minutes = time[1].padStart(2, "0");
    let seconds = Math.floor(parseFloat(time[2])).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  const gameTimeConverter = (utcString) => {
    if(!utcString)
      return "N/A";

    const date = new Date(utcString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
    });
  };

  return (
    
    <Box
      className="w-screen h-screen flex flex-col bg-cover bg-no-repeat"
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
      }}
    >

      <Header />

      <Box className="w-full p-8 text-white">
        <Typography variant="h4" className="font-mono mb-4">
          NBA Live Scores
        </Typography>

        {nbaLiveGames.length === 0 ? (
          <Typography> No scheduled games </Typography>
        ) : (
          nbaLiveGames.map((game, index) => (
            <Box key={index} className="mb-4 p-4 bg-gray-900 rounded-lg">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "1rem",
                }}
                >
                <Typography variant="h6"> {game.awayTeam.teamTriCode} </Typography>
                <Typography 
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}> {game.awayTeam.wins} - {game.awayTeam.losses} </Typography>

                <Box className="mt-2">
                  <Box className="grid grid-cols-5 text-white gap-x-8 ml-40">
                    {game.awayTeam.periods.map((period, index) => (
                      <Box key={index} className="text-center">
                        <Typography 
                          sx={{fontFamily: "monospace"}}
                          className="text-center"
                          >
                          {period.period}
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                          }}
                          className="text-center"
                          >
                          {period.score}
                        </Typography>
                      </Box>                          
                    ))}
                    <Typography> {game.awayTeam.score} </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Typography variant="h6"> {game.homeTeam.teamTriCode} </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}> {game.homeTeam.wins} - {game.homeTeam.losses} </Typography>

              <Box className="mt-2">
                  <Box className="grid grid-cols-5 text-white gap-x-8 ml-40">
                    {game.homeTeam.periods.map((period, index) => (
                      <Box key={index} className="text-center">
                        <Typography 
                          sx={{fontFamily: "monospace"}}
                          className="text-center"
                          >
                          {period.period}
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                          }}
                          className="text-center"
                          >
                          {period.score}
                        </Typography>
                      </Box>                          
                    ))}
                    <Typography> {game.homeTeam.score} </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  fontFamily: "monospace",
                  marginLeft: "6rem",
                }}
              >
                <Typography> {game.gameStatusText} </Typography>
                <Typography> {gameClockConverter(game.gameClock)} </Typography>
                <Typography> {gameTimeConverter(game.gameTimeUTC)} </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Home;
