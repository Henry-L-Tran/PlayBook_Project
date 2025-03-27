import Header from "./Header";
import { useState } from "react";
import { useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { Box, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

function Home() {

  const [nbaLiveGames, setNbaLiveGames] = useState({gameDate: "", gameData: []});
  const [nbaPlayerStats, setnbaPlayerStats] = useState([]); 
  const [nbaSelectedGame, setnbaselectedGame] = useState(null);
  const [showBettingLines, setShowBettingLines] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState("NBA");


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

  const handleCategoryTabChange = (event, newValue) => {
    setActiveCategoryTab(newValue);
  }


  useEffect(() => {
    const fetchnbaPlayerStats = async () => {
      try {
        const response = await fetch("http://localhost:8000/nba/player_season_stats");
        const data = await response.json();
        setnbaPlayerStats(data.players);
      }

      catch (error) {
        console.error("Error: ", error);
      }
    }
    fetchnbaPlayerStats();
  }, []);


  const playersInGame = (game) => {
    return nbaPlayerStats.filter(player =>
      player.teamTriCode === game.awayTeam.teamTriCode || player.teamTriCode === game.homeTeam.teamTriCode
    )
  }

  useEffect(() => {
    if(showBettingLines) {
      document.body.style.overflow = "hidden";
    }
    else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    }
  }, [showBettingLines]);


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
          borderRadius: "1rem",
        }}>

        <Tabs
          value={activeCategoryTab}
          onChange={handleCategoryTabChange}
          centered
          textColor="inherit"
          slotProps={{
            indicator: {
              sx: {
                backgroundColor: "white",
                height: "0.25rem",
                borderRadius: "1rem",
                marginTop: "1rem",
                textDecorationColor: "white",
              },
            }
          }}

          sx={{
            marginTop: "1rem",
            textDecorationColor: "white",
          }}
        >
          <Tab label="NBA" value="NBA"
            disableRipple
            sx={{
              mx: 5,
              fontSize: "1.5rem",
              fontFamily: "monospace",
              textColor: "inherit",
              color: "white",
              outline: "none",
              "&.Mui-selected": {
                color: "white",
                fontWeight: "bold",
                outline: "none",
              },
              "&:focus": {
                outline: "none",
                color: "white",
              },
            }} />
          <Tab label="NFL" value="NFL"
            disableRipple
            sx={{
              mx: 5,
              fontSize: "1.5rem",
              fontFamily: "monospace",
              textColor: "inherit",
              color: "white",
              "&:focus": {
                outline: "none",
                color: "white",
                fontWeight: "bold",
              },
            }} />
          <Tab label="LoL" value="LoL"
            disableRipple
            sx={{
              textTransform: "none",
              mx: 5,
              fontSize: "1.5rem",
              fontFamily: "monospace",
              textColor: "inherit",
              color: "white",
              "&:focus": {
                outline: "none",
                color: "white",
                fontWeight: "bold",
              },
            }} />
          <Tab label="VAL" value="VAL" 
            disableRipple
            sx={{
              mx: 5,
              fontSize: "1.5rem",
              fontFamily: "monospace",
              textColor: "inherit",
              color: "white",
              "&:focus": {
                outline: "none",
                color: "white",
                fontWeight: "bold",
              },
            }} />
        </Tabs>
        
        {activeCategoryTab === "NBA" && (
          <>
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
                  onClick={() => {
                    if(game.gameStatus === 1) {
                      setnbaselectedGame(game);
                      setShowBettingLines(true);
                    }
                  }}
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
                    <Typography variant="h6"
                      sx={{
                        color: game.gameStatus === 3 && game.awayTeam.score > game.homeTeam.score ? "#10833C" : "white",
                      }}> {game.awayTeam.teamTriCode} </Typography>
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
                            color: game.gameStatus === 3 && game.awayTeam.score > game.homeTeam.score ? "#10833C" : "white",
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
                    <Typography variant="h6"
                      sx={{
                        color: game.gameStatus === 3 && game.homeTeam.score > game.awayTeam.score ? "#10833C" : "white",
                      }}> {game.homeTeam.teamTriCode} 
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                      }}> {game.homeTeam.wins} - {game.homeTeam.losses} 
                    </Typography>

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
                              color: game.gameStatus === 3 && game.homeTeam.score > game.awayTeam.score ? "#10833C" : "white",
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
                        fontWeight: "bold",
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
          </>
        )}
      </Box>

      {activeCategoryTab === "NBA" && showBettingLines && nbaSelectedGame && (() => {
        const awayPlayers = playersInGame(nbaSelectedGame).filter(
          (player) => player.teamTriCode === nbaSelectedGame.awayTeam.teamTriCode
        );

        const homePlayers = playersInGame(nbaSelectedGame).filter(
          (player) => player.teamTriCode === nbaSelectedGame.homeTeam.teamTriCode
        );

        return (

          <Box 
            sx={{
              position: "fixed",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: "1rem",
              justifyContent: "center",
              fontFamily: "monospace",
              width: "100%",
              maxHeight: "100vh",
              overflowY: "auto",

            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderRadius: "1rem",
              }}
            >

            <Typography variant="h6"
              sx={{
                textAlign: "center",
                paddingTop: "3rem",
                fontFamily: "monospace",
              }}> 
              {nbaSelectedGame.awayTeam.teamTriCode} @ {nbaSelectedGame.homeTeam.teamTriCode} 
            </Typography>

            <IconButton
              sx={{
                position: "absolute",
                right: "1rem",
                top: "1rem",
                "&:hover": {
                  background: "none",
                },
                "&:focus": {
                  outline: "none",
                }
              }}
              onClick={() => setShowBettingLines(false)}
            >
              <CloseIcon />
            </IconButton>
              
            

            <Box
              sx={{
                display: "flex",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  paddingBottom: "4rem",
               
                }}
                >
                <Typography variant="h6"
                  sx={{
                    textAlign: "center",
                    fontFamily: "monospace",
                    marginBottom: "2rem",
                    marginRight: "21rem",
                  }}
                >
                  {nbaSelectedGame.awayTeam.teamTriCode}
                </Typography>

                {awayPlayers.map((player, index) => (
                  <Box key={index}
                    sx={{
                        border: "2px solid gray",
                        borderRadius: "1rem",
                        padding: "1rem",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        marginBottom: "1rem",
                        width: "22rem",
                        marginLeft: "2rem",
                        height: "18rem",
                    }}>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> {player.playerName} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> PTS {player.points} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> REB {player.rebounds} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> AST {player.assists} </Typography>
                    <Typography
                      sx = {{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> STL {player.steals} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> BLK {player.blocks} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> TO {player.turnovers} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> 3PM {player["3ptMade"]} </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Typography variant="h6"
                  sx={{
                    textAlign: "center",
                    fontFamily: "monospace",
                    marginBottom: "2rem",
                    marginLeft: "19rem",
                  }}
                >
                  {nbaSelectedGame.homeTeam.teamTriCode}
                </Typography>
                {homePlayers.map((player, index) => (
                  <Box key={index}
                    sx={{
                      border: "2px solid gray",
                      borderRadius: "1rem",
                      padding: "1rem",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      marginBottom: "1rem",
                      width: "22rem",
                      marginLeft: "22rem",
                      height: "18rem",
                    }}>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> {player.playerName} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> PTS {player.points} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> REB {player.rebounds} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> AST {player.assists} </Typography>
                    <Typography
                      sx = {{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> STL {player.steals} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> BLK {player.blocks} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> TO {player.turnovers} </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        textAlign: "center",
                      }}> 3PM {player["3ptMade"]} </Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  })()}
</Box>
  );
}


export default Home;
