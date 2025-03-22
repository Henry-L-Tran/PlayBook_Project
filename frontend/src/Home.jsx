import Header from "./Header";
import { useState } from "react";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

function Home() {

  const [nbaLiveGames, setNbaLiveGames] = useState({gameDate: "", gameData: []});

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


  return (
    
    <Box
      className="w-screen h-screen flex flex-col bg-cover bg-no-repeat"
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
      }}
    >

      <Header />

      <Box className="w-full p-8 text-white"
        sx={{
          width: "100%",
          maxWidth: "1200px",
          marginLeft: "3.5rem",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "rem",
        }}>
        <Typography variant="h4" className="font-mono mb-4">
          NBA Live Scores
        </Typography>
        
        <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                    width: "20rem",
                    paddingTop: "1rem",
                    marginLeft: "26rem",
                  }}> {nbaLiveGames.gameDate} 
          </Typography>

        {nbaLiveGames.length === 0 ? (
          <Typography> No scheduled games </Typography>
        ) : (
          nbaLiveGames.gameData.map((game, index) => (
            <Box key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "2rem",
                padding: "2rem",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                alignItems: "flex-start",
                textAlign: "left",
                paddingLeft: "10rem",
                gridTemplateColumns: "80px 80px 200px 80px",
              }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "80px 80px 240px 1fr",
                  alignItems: "center",
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
                          sx={{
                            fontFamily: "monospace",
                            gridTemplateColumns: "repeat(4, 40px) 60px",
                          }}
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
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "1.3rem",
                      }}> {game.awayTeam.score} </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "80px 80px 240px 1fr",
                  alignItems: "center",
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
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "1.3rem",
                      }}> {game.homeTeam.score} 
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  fontFamily: "monospace",
                  marginTop: "1rem",
                  
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                    width: "20rem",
                    marginLeft: "30rem",
                    marginTop: "-12rem",
                    textAlign: "right",

                  }}> {game.gameStatusText} 
                </Typography>

                {game.gameStatus === 2 && (
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      fontFamily: "monospace",
                      width: "20rem",
                      marginLeft: "30rem",
                      textAlign: "right",
                    }}> {gameClockConverter(game.gameClock)} 
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Home;
