import { useState } from "react";
import { useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { Box, Typography, Divider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import Lineups from "./Lineups";
import { calculatePayoutMultiplier } from "./payoutMultiplier";
import { format } from "date-fns";
import SearchBar from "./SearchBar";
import Valorant from "./Valorant";
import "./Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  // State to Hold the Live Games and Player Stats
  const [nbaLiveGames, setNbaLiveGames] = useState({
    gameDate: "",
    gameData: [],
  });
  const [nbaPlayerStats, setnbaPlayerStats] = useState([]);
  const [nbaSelectedGame, setnbaselectedGame] = useState(null);
  const [showBettingLines, setShowBettingLines] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState("NBA");
  const [viewLineCategory, setViewLineCategory] = useState("PTS");
  const [lineup, setLineup] = useState({});
  const currentLineup = lineup[viewLineCategory] || [];
  const [showLineupBar, setShowLineupBar] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [entryAmount, setEntryAmount] = useState("");


  // Function to Fetch Live NBA Games (Updates Every 30 Seconds)
  useEffect(() => {
    const fetchNbaLiveGames = async () => {
      try {
        const response = await fetch("http://localhost:8000/nba/scores");
        const data = await response.json();
        setNbaLiveGames(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchNbaLiveGames();
    const fetchTimer = setInterval(fetchNbaLiveGames, 30000);

    return () => {
      clearInterval(fetchTimer);
    };
  }, []);

  // Function to Convert ISO Time to Game Clock Format (MM:SS)
  const gameClockConverter = (isoTime) => {
    if (!isoTime) return "00:00";

    const time = isoTime.match(/PT(\d+)M(\d+(\.\d*)?)S/);
    if (!time) return isoTime;

    // Getting the Minutes and Seconds from the ISO Time
    let minutes = time[1].padStart(2, "0");
    let seconds = Math.floor(parseFloat(time[2])).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  // Function to Handle the Category Tab Change (NBA, NFL, LoL, VAL)
  const handleCategoryTabChange = (event, newValue) => {
    setActiveCategoryTab(newValue);
  };

  // Function to Fetch Player Season Stats for the Selected Game (Gets the Averages)
  useEffect(() => {
    const fetchnbaPlayerStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/nba/player_season_stats"
        );
        const data = await response.json();
        setnbaPlayerStats(data.players);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchnbaPlayerStats();
  }, []);

  // Filters NBA Players Based on the Selected Game
  const playersInGame = (game) => {
    return nbaPlayerStats.filter(
      (player) =>
        player.teamTriCode === game.awayTeam.teamTriCode ||
        player.teamTriCode === game.homeTeam.teamTriCode
    );
  };

  // Function to Handle the Scrolling When Betting Lines are Opened
  useEffect(() => {
    if (showBettingLines) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showBettingLines]);

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

  // All the Possible Line Categories for NBA
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

  // Determines Which Stat Category to Show
  const getStatCategory = (player) => {
    switch (viewLineCategory) {
      case "PTS":
        return lineRounding(player.points);
      case "REB":
        return lineRounding(player.rebounds);
      case "AST":
        return lineRounding(player.assists);
      case "BLKS + STLS":
        return lineRounding(player.blocks + player.steals);
      case "TO":
        return lineRounding(player.turnovers);
      case "3PM":
        return lineRounding(player["3ptMade"]);
      case "PTS + REB":
        return lineRounding(player.points + player.rebounds);
      case "PTS + AST":
        return lineRounding(player.points + player.assists);
      case "REB + AST":
        return lineRounding(player.rebounds + player.assists);
      case "PTS + REB + AST":
        return lineRounding(player.points + player.rebounds + player.assists);
      default:
        return 0;
    }
  };

  // Handles the Select/Deselect of Players Over/Under
  const handleUserLines = (player, usersPick) => {
    const playerId = player.playerId;

    setLineup((prevLines) => {
      const categoryLineup = prevLines[viewLineCategory] || [];

      // Prevents Duplicate Players in the Same Lineup
      const noDuplicatePlayers = Object.values(prevLines).flat();
      const playerAlreadyExists = noDuplicatePlayers.find(
        (entry) => entry.player_id === playerId
      );

      if (
        playerAlreadyExists &&
        playerAlreadyExists.line_category !== viewLineCategory
      ) {
        console.log("Cannot use the same player more than once in a lineup.");
        return prevLines;
      }

      const existing = categoryLineup.find(
        (entry) => entry.player_id === playerId
      );

      let newCategoryLineup;

      if (existing) {
        if (existing.users_pick === usersPick) {
          newCategoryLineup = categoryLineup.filter(
            (entry) => entry.player_id !== playerId
          );
        } else {
          // If Player is Selected but Over/Under is Changed, Update the Existing Entry
          newCategoryLineup = categoryLineup.map((entry) =>
            entry.player_id === playerId
              ? { ...entry, users_pick: usersPick }
              : entry
          );
        }
      } else {
        // If Player is Not Selected, Add the Player to the Lineup
        const newEntry = {
          player_id: player.playerId,
          player_name: player.playerName,
          team_tri_code: player.teamTriCode,
          player_picture: player.playerPicture,
          line_category: viewLineCategory,
          projected_line: parseFloat(getStatCategory(player)),
          users_pick: usersPick,
          matchup: `${nbaSelectedGame.awayTeam.teamTriCode} @ ${nbaSelectedGame.homeTeam.teamTriCode}`,
        };

        newCategoryLineup = [...categoryLineup, newEntry];
      }

      return {
        ...prevLines,
        [viewLineCategory]: newCategoryLineup,
      };
    });
  };

  // Function to Submit the Users' Lineup to Backend
  const submitLineup = async () => {
    const allEntries = Object.values(lineup).flat();

    // Lineup MUST Be Between 2 and 6 Players
    if (allEntries.length < 2 || allEntries.length > 6) {
      console.log("Lineup must be between 2 and 6 players.");
      return;
    }

    // Lineup Cannot Contain Players from the Same Team
    const sameTeam =
      new Set(allEntries.map((player) => player.team_tri_code)).size === 1;
    if (sameTeam) {
      console.log("Lineup cannot contain players from the same team.");
      return;
    }


    // Gets the Current User's Info from Local Storage
    const currUser = JSON.parse(localStorage.getItem("currUser"));

    if (!currUser || !currUser.email) {
      console.log("User not logged in.");
      return;
    }

    // Generate a Unique Entry ID for the Lineup 
    const entryId = `${currUser.email}_${Date.now()}_${uuidv4()}`;


    if(!entryType || !entryAmount || entryAmount <= 0) {
      console.log("Select a valid entry type and/or input a valid entry amount.");
      return;
    }

    const calculatePayout = calculatePayoutMultiplier(entryType, allEntries.length, allEntries.length);

    // Submit the Lineup to the Backend as JSON
    try {
      const response = await fetch("http://localhost:8000/lineups/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currUser.email,
          category: activeCategoryTab,
          entry_id: entryId,
          entry_type: entryType,
          entry_amount: Number(entryAmount),
          potential_payout: entryAmount * calculatePayout,
          entries: allEntries,
        }),
      });

      if (response.status === 200) {
        console.log("Lineup submitted successfully.");

        // Resets the Lineup State After Submitting Lineup
        setLineup({});
      } else {
        console.log("Error submitting lineup");
      }
    } catch (error) {
      console.error("Error submitting lineup", error);
    }
  };

  // Function to Highlight the Selected Over/Under Buttons Green
  const selectedBetButton = (playerId, pick) => {
    return currentLineup.some(
      (entry) => entry.player_id === playerId && entry.users_pick === pick
    );
  };

  // Function to Highlight the Selected Player Card Green
  const selectedSquare = (playerId) => {
    return currentLineup.some((entry) => entry.player_id === playerId);
  };

  // Function to Update the Lineup with the Selected Player's Pick in the Lineup Builder Popup
  const userPickUpdate = (playerId, pick) => {

    if(pick === "Clear All") {
      setLineup({});
      return;
    }

    setLineup((prevLines) => {
      const newPick = {};
    
      
      for(const category in prevLines) {
        const categoryLineup = prevLines[category];

        if(pick === "Remove") {
          const filteredLineup = categoryLineup.filter(entry => entry.player_id !== playerId);
          if(filteredLineup.length > 0) {
            newPick[category] = filteredLineup;
          }
        }

        else {
          newPick[category] = prevLines[category].map((entry) =>
          entry.player_id === playerId ? { ...entry, users_pick: pick } : entry
          );
        }
      }
      return newPick;

    });
  };

  // Function to Handle Player Selection in the Search Bar
  const handlePlayerClick = (player) => {
    const playerGame = nbaLiveGames.gameData.find(
      (game) =>
        game.awayTeam.teamTriCode === player.teamTriCode ||
        game.homeTeam.teamTriCode === player.teamTriCode
    );

    // If the Player is Playing Today, Show the Betting Lines Popup They Are In
    if (playerGame) {
      setnbaselectedGame(playerGame);
      setShowBettingLines(true);

      // Quick Delay to Allow for the Animation & Players to Load
      setTimeout(() => {
        const findPlayerSquare = document.getElementById(`player-${player.playerId}`);
        
        // Finding the Player Square, Scrolling to It Then Highlighting It 
        if (findPlayerSquare) {
          findPlayerSquare.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
          
          findPlayerSquare.classList.add("card-highlight");
          // setTimeout(() => {
          //   findPlayerSquare.remove("card-highlight");
          // }, 1000);
        }
      }, 600);

    console.log("Selected Player: ", player);
    };
  }


  const data = [
    // { name: "Oct", value: 35 },
    // { name: "Nov", value: 65 },
    { name: "Dec", value: 33 },
    { name: "Jan", value: 45 },
    { name: "Feb", value: 50 },
    { name: "Mar", value: 10 },
    { name: "Apr", value: 25 },
    { name: "May", value: 55 },
    { name: "Jun", value: 78 },
  ];

  return (
    
    // Main Dashboard Container 
    <Box className="flex w-full  overflow-scroll justify-center items-center"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: "2%",
      }}>

      {/* Date & Game Schedule Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "100%",
        }}
      >

      {/* Display the Date of the NBA Games */}
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontFamily: "monospace",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {nbaLiveGames.gameDate && nbaLiveGames.gameDate !== "N/A" ?
        format(new Date(`${nbaLiveGames.gameDate}T00:00:00`), "MMMM d, yyyy") :
        ""}
      </Typography>
      
      {/* Outer Scoreboard Container */}
      <Box
        className="w-full max-w-full p-2 md:p-8 text-white"
        sx={{
          maxWidth: "1200px",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "1rem",
        }}
      >
        {/* Tabs (NBA, NFL, LoL, VAL) */}
        <Tabs
          value={activeCategoryTab}
          onChange={handleCategoryTabChange}
          variant="fullWidth"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="inherit"
          slotProps={{
            indicator: {
              sx: {
                backgroundColor: "white",
                height: "0.25rem",
                borderRadius: "1rem",
                marginTop: "1rem",
              },
            },
            scrollButtons: {
              sx: {
                color: "white",
              },
            },
          }}
          sx={{
            marginTop: "1rem",
            width: "100%",
            maxWidth: "100%",
            "& .MuiTabs-flexContainer": {
              justifyContent: { xs: "flex-start", md: "center" },
            },
            "& .MuiTabs-scroller": {
              width: "100%",
              overflowX: "auto",
            },
          }}
        >

          {/*Each Tab (NBA, NFL, LoL, VAL) */}
          {["NBA", "NFL", "LoL", "VAL"].map((category) => (
          <Tab
            key={category}
            label={category}
            value={category}
            disableRipple
            sx={{
              mx: { xs: 0.5, sm: 1, md: 3 },
              px: { xs: 1, sm: 2, md: 2 },
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              fontFamily: "monospace",
              color: "white",
              minWidth: "fit-content",
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
            }}
          />
          ))}
        </Tabs>

        {/* ------NBA Games Dashboard Display------ */}
        {activeCategoryTab === "NBA" && (
          <Box className="flex flex-col w-full h-full"
            sx={{
              overflow: "visible",
              position: "relative",
              minHeight: "100vh",
            }}
            
          >
            {/* TESTING SEARCH BAR COMPONENT TEMPORARILY HERE */}
            <Box
              sx={{
                position: "relative",
                overflow: "visible",
                minHeight: "6rem",
              }}
            >
              {/* Search Bar Component to Show Players Playing Today */}
              <SearchBar 
                playersPlayingToday={nbaPlayerStats.filter((player) =>
                  nbaLiveGames.gameData.some(
                    (game) =>
                      player.teamTriCode === game.awayTeam.teamTriCode ||
                      player.teamTriCode === game.homeTeam.teamTriCode
                  )
                )}
                // Brings the User to the Player's Betting Lines Popup
                playerSelected={handlePlayerClick}
              />
            </Box>

            {nbaLiveGames.gameData.length === 0 ? (
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontFamily: "monospace",
                }}
              > 
                No Scheduled Games 
              </Typography>
            ) : (
              nbaLiveGames.gameData.map((game, index) => (

                // Each Game Box
                <Box
                  key={index}
                  onClick={() => {

                    // If the Game Hasn't Started, Show the Betting Lines Popup
                    if (game.gameStatus === 3) {
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
                    cursor: "pointer",
                  }}
                >
                  {/* Away Team Box */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "80px 80px 240px 1fr",
                      alignItems: "center",
                    }}
                  >
                    {/* Away Team Data */}
                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          game.gameStatus === 3 &&
                          game.awayTeam.score > game.homeTeam.score
                            ? "#10833C"
                            : "white",
                      }}
                    >
                      {" "}
                      {game.awayTeam.teamTriCode}{" "}
                    </Typography>

                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                        }}
                      >
                        {" "}
                        {game.awayTeam.wins} - {game.awayTeam.losses}{" "}
                      </Typography>

                      {/* Away Team Periods and Score */}
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
                              color:
                                game.gameStatus === 3 &&
                                game.awayTeam.score > game.homeTeam.score
                                  ? "#10833C"
                                  : "white",
                            }}
                          >
                            {" "}
                            {game.awayTeam.score}{" "}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Home Team Box*/}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "80px 80px 240px 1fr",
                        alignItems: "center",
                      }}
                    >
                      {/* Home Team Data */}
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            game.gameStatus === 3 &&
                            game.homeTeam.score > game.awayTeam.score
                              ? "#10833C"
                              : "white",
                        }}
                      >
                        {" "}
                        {game.homeTeam.teamTriCode}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                        }}
                      >
                        {" "}
                        {game.homeTeam.wins} - {game.homeTeam.losses}
                      </Typography>

                      {/* Home Team Periods and Score */}
                      <Box className="mt-2">
                        <Box className="grid grid-cols-5 text-white gap-x-8 ml-40">
                          {game.homeTeam.periods.map((period, index) => (
                            <Box key={index} className="text-center">
                              <Typography
                                sx={{ fontFamily: "monospace" }}
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
                              color:
                                game.gameStatus === 3 &&
                                game.homeTeam.score > game.awayTeam.score
                                  ? "#10833C"
                                  : "white",
                            }}
                          >
                            {" "}
                            {game.homeTeam.score}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Game Status and Clock Box */}
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
                      {/* Game Status Text */}
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                          width: "20rem",
                          marginLeft: "30rem",
                          marginTop: "-12rem",
                          textAlign: "right",
                        }}
                      >
                        {" "}
                        {game.gameStatusText}
                      </Typography>

                      {/* Game Clock Display */}
                      {game.gameStatus === 2 && (
                        <Typography
                          sx={{
                            fontSize: "1.2rem",
                            fontFamily: "monospace",
                            width: "20rem",
                            marginLeft: "30rem",
                            textAlign: "right",
                          }}
                        >
                          {" "}
                          {gameClockConverter(game.gameClock)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>

        {/* ------Betting Lines Popup Display------ */}
        {activeCategoryTab === "NBA" &&
          showBettingLines &&
          nbaSelectedGame &&
          (() => {
            // Filters Away Players Based on the Selected Game
            const awayPlayers = playersInGame(nbaSelectedGame).filter(
              (player) =>
                player.teamTriCode === nbaSelectedGame.awayTeam.teamTriCode
            );

            // Filters Home Players Based on the Selected Game
            const homePlayers = playersInGame(nbaSelectedGame).filter(
              (player) =>
                player.teamTriCode === nbaSelectedGame.homeTeam.teamTriCode
            );

            return (
              // Full Popup Screen for Betting Lines
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
                }}
              >
                {/* Header Away Team @ Home Team Box */}
                <Box
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderRadius: "1rem",
                  }}
                >
                  {/* Header Text (Away Team @ Home Team) */}
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      paddingTop: "3rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {nbaSelectedGame.awayTeam.teamTriCode} @{" "}
                    {nbaSelectedGame.homeTeam.teamTriCode}
                  </Typography>

                  {/* Exit ("X") Button In Top Right Corner*/}
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
                      },
                    }}
                    onClick={() => setShowBettingLines(false)}
                  >
                    <CloseIcon />
                  </IconButton>

                  {/* Betting Lines Buttons Header/Box */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "2rem",
                      gap: "2rem",
                    }}
                  >
                    {/* Betting Lines Category Buttons (PTS, REB, AST, etc.) */}
                    {lineCategoryOptions.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setViewLineCategory(category);
                        }}
                        style={{
                          fontFamily: "monospace",
                          backgroundColor:
                            viewLineCategory === category
                              ? "white"
                              : "transparent",
                          color:
                            viewLineCategory === category ? "black" : "white",
                          border: "1px solid white",
                          borderRadius: "5rem",
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
                      padding: "2rem 4rem",
                      width: "100%",
                      gap: "2rem",
                    }}
                  >
                    {/* Away Team Players Squares Column */}
                    <Box
                      sx={{
                        flex: 1,
                        paddingBottom: "4rem",
                      }}
                    >
                      {/* Away Team Tri-Code Header */}
                      <Typography
                        variant="h6"
                        sx={{
                          textAlign: "center",
                          width: "40%",
                          fontFamily: "monospace",
                          marginBottom: "1rem",
                        }}
                      >
                        {nbaSelectedGame.awayTeam.teamTriCode}
                      </Typography>

                    {/* Away Team Players Squares Green Selected Highlights */}
                    {awayPlayers
                      .filter(
                        (player) => parseFloat(getStatCategory(player)) !== 0
                      )
                      .map((player, index) => (
                        <Box
                          key={index}
                          id={`player-${player.playerId}`}
                          sx={{
                            border: selectedSquare(player.playerId)
                              ? "2px solid green"
                              : "2px solid gray",
                            borderRadius: "1rem",
                            padding: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            marginBottom: "1rem",
                            width: "22rem",
                            height: "18rem",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Player Square Top Header Section */}
                          <Box
                            sx={{
                              padding: "0.5rem",
                            }}
                          >
                            {/* Player Picture */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <img
                                src={player.playerPicture}
                                alt={player.playerName}
                                style={{
                                  width: "6rem",
                                  marginTop: "1rem",
                                }}
                              />
                            </Box>

                              {/* Player Team Tri-Code */}
                              <Typography
                                sx={{
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {player.teamTriCode}
                              </Typography>

                              {/* Player Name */}
                              <Typography
                                sx={{
                                  fontFamily: "monospace",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {player.playerName}
                              </Typography>

                              {/* Player Opponent Team & Game Status */}
                              <Typography
                                sx={{
                                  fontFamily: "monospace",
                                  textAlign: "center",
                                  fontSize: "0.8rem",
                                }}
                              >
                                vs {nbaSelectedGame.homeTeam.teamTriCode}{" "}
                                {nbaSelectedGame.gameStatusText}
                              </Typography>

                              {/* Player Square Lower Line Section */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {/* Player Projected Line */}
                                <Typography
                                  sx={{
                                    fontFamily: "monospace",
                                    textAlign: "center",
                                    marginTop: "0.5rem",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {getStatCategory(player)}
                                </Typography>

                                {/* Player Line Category (PTS, REB, AST, etc.) */}
                                <Typography
                                  sx={{
                                    display: "flex",
                                    fontFamily: "monospace",
                                    textAlign: "center",
                                    marginTop: "0.9rem",
                                    fontSize: "0.8rem",
                                    justifyContent: "right",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {viewLineCategory}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Player Square Lower Buttons Section */}
                            <Box
                              sx={{
                                display: "flex",
                                borderTop: "1px solid gray",
                                width: "100%",
                              }}
                            >
                              {/* Player Under Button */}
                              <button
                                onClick={() => handleUserLines(player, "Under")}
                                style={{
                                  flex: 1,
                                  backgroundColor: selectedBetButton(
                                    player.playerId,
                                    "Under"
                                  )
                                    ? "green"
                                    : "transparent",
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

                              {/* Player Over Button */}
                              <button
                                onClick={() => handleUserLines(player, "Over")}
                                style={{
                                  flex: 1,
                                  backgroundColor: selectedBetButton(
                                    player.playerId,
                                    "Over"
                                  )
                                    ? "green"
                                    : "transparent",
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

                    {/* Home Team Players Squares Column */}
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      {/* Home Team Tri-Code Header */}
                      <Typography
                        variant="h6"
                        sx={{
                          textAlign: "center",
                          width: "40%",
                          fontFamily: "monospace",
                          marginBottom: "1rem",
                        }}
                      >
                        {nbaSelectedGame.homeTeam.teamTriCode}
                      </Typography>

                    {/* Home Team Players Squares Green Selected Highlights */}
                    {homePlayers
                      .filter(
                        (player) => parseFloat(getStatCategory(player)) !== 0
                      )
                      .map((player, index) => (
                        <Box
                          key={index}
                          id={`player-${player.playerId}`}
                          sx={{
                            border: selectedSquare(player.playerId)
                              ? "2px solid green"
                              : "2px solid gray",
                            borderRadius: "1rem",
                            padding: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            marginBottom: "1rem",
                            width: "22rem",
                            height: "18rem",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Player Square Top Header Section */}
                          <Box
                            sx={{
                              padding: "0.5rem",
                            }}
                          >

                            {/* Player Picture */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "0.5rem",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <img
                                src={player.playerPicture}
                                alt={player.playerName}
                                style={{
                                  width: "6rem",
                                  marginTop: "1rem",
                                }}
                              />
                            </Box>

                              {/* Player Team Tri-Code */}
                              <Typography
                                sx={{
                                  fontFamily: "monospace",
                                  fontSize: "0.8rem",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {player.teamTriCode}
                              </Typography>

                              {/* Player Name */}
                              <Typography
                                sx={{
                                  fontFamily: "monospace",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                {player.playerName}
                              </Typography>

                              {/* Player Opponent Team & Game Status */}
                              <Typography
                                sx={{
                                  fontFamily: "monospace",
                                  textAlign: "center",
                                  fontSize: "0.8rem",
                                }}
                              >
                                vs {nbaSelectedGame.awayTeam.teamTriCode}{" "}
                                {nbaSelectedGame.gameStatusText}
                              </Typography>

                              {/* Player Square Lower Line Section */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {/* Player Projected Line */}
                                <Typography
                                  sx={{
                                    fontFamily: "monospace",
                                    textAlign: "center",
                                    marginTop: "0.5rem",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {getStatCategory(player)}
                                </Typography>

                                {/* Player Line Category (PTS, REB, AST, etc.) */}
                                <Typography
                                  sx={{
                                    display: "flex",
                                    fontFamily: "monospace",
                                    textAlign: "center",
                                    marginTop: "0.9rem",
                                    fontSize: "0.8rem",
                                    justifyContent: "right",
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  {viewLineCategory}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Player Square Lower Buttons Section */}
                            <Box
                              sx={{
                                display: "flex",
                                borderTop: "1px solid gray",
                                width: "100%",
                              }}
                            >
                              {/* Player Under Button */}
                              <button
                                onClick={() => handleUserLines(player, "Under")}
                                style={{
                                  flex: 1,
                                  backgroundColor: selectedBetButton(
                                    player.playerId,
                                    "Under"
                                  )
                                    ? "green"
                                    : "transparent",
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

                            {/* Player Over Button */}
                            <button
                              onClick={() => handleUserLines(player, "Over")}
                              style={{
                                flex: 1,
                                backgroundColor: selectedBetButton(
                                  player.playerId,
                                  "Over"
                                )
                                  ? "green"
                                  : "transparent",
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
        })()}

        {activeCategoryTab === "VAL" && (
          <Box className="flex flex-col w-full h-full" 
            sx={{
              overflow: "visible", 
              position: "relative", 
              minHeight: "100vh" 
            }}>
              {/* This is where the new Valorant component is rendered */}
              <Valorant />
            </Box>
          )}
      
        {/* ------Lineups Bar Popup Display------ */}
        {Object.values(lineup).flat().length >= 1 && 
        Object.values(lineup).flat().length <= 6 && (

          <Lineups
            lineup={Object.values(lineup).flat()}
            expand={() => setShowLineups(true)}
            onSubmit={submitLineup}
            pickUpdate={userPickUpdate}
            entryType={entryType}
            setEntryType={setEntryType}
            entryAmount={entryAmount}
            setEntryAmount={setEntryAmount}
          />
        )}

        {showLineupBar && (
          <Lineups
            lineup={Object.values(lineup).flat()}
            onClose={() => setShowLineups(false)}
            onSubmit={submitLineup}
            isExpanded={showLineupBar}
            pickUpdate={userPickUpdate}
          />
        )}
      </Box>

      {/* ------Right Sidebar Display------ */}
      <Box
        className={`flex flex-col h-full border-2 border-white rounded-2xl ${
          !(activeCategoryTab === "NBA" && showBettingLines && nbaSelectedGame)
            ? "sticky top-0"
            : "hidden"
        }`}
        sx={{ 
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          position: "sticky",
          alignSelf: "flex-start",
          height: "fit-content",
          overflowY: "auto",
          top: "1.65%",
          width: "45%",
          marginRight: "2%",
        }}
      >
        {/* Earnings */}
        <Box className=" text-white rounded-t-lg p-4 flex flex-col items-center justify-center h-1/3"
          sx={{
            height: "20em",
          }}
        >
          <Typography className="text-xl font-bold mb-2"
            sx={{
              fontFamily: "monospace",
              textAlign: "center",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}>
            Earnings
          </Typography>
          <div className="w-24 h-24 rounded-full border-8 border-gray-700 flex items-center justify-center mb-2">
            {/* Placeholder value for earnings */}
            <span className="text-2xl font-bold">$50.00</span>
          </div>
        </Box>

        <Divider
          sx={{
            bgcolor: "white",
            height: "2px", // for horizontal
          }}
          flexItem
        />

        {/* Monthly Progress */}
        <div className=" h-1/3 p-4">
          <h2 className="text-xl font-bold text-center mb-2">
            Monthly Progress
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Divider
          sx={{
            bgcolor: "white",
            height: "2px", // for horizontal
          }}
          flexItem
        />

        {/* Top Picks */}
        <div className=" text-white rounded-b-lg p-4 h-1/3">
          <h2 className="text-xl font-bold mb-4">Top Picks</h2>
          <div className="flex justify-between items-center  rounded p-2 pl-6 mb-2">
            <span>NYK vs LAL</span>
            <button
              className="px-3 py-1 rounded text-sm"
              onClick={() =>
                window.open(
                  "https://www.google.com/search?q=nyk+vs+lal&rlz=1C5CHFA_enUS944US952&oq=nyk+vs+lal&gs_lcrp=EgZjaHJvbWUyCQgAEEUYORiABDIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDM1MjZqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#sie=m;/g/11lmmffyw8;3;/m/05jvx;dt;fp;1;;;"
                )
              }
            >
              View
            </button>
          </div>
          <div className="flex justify-between items-center  rounded p-2 pl-6 mb-2">
            <span>DAL vs MIA</span>
            <button
              className="px-3 py-1 rounded text-sm"
              onClick={() => {
                window.open(
                  "https://www.google.com/search?q=DAL+vs+MIA&sca_esv=7efe9108e6e32fec&rlz=1C5CHFA_enUS944US952&sxsrf=AHTn8zrEaDDdmDcZVD7guyebStxennkvvg%3A1744237313029&ei=AfP2Z5q3AankwN4PidblqQE&ved=0ahUKEwjau8mr_suMAxUpMtAFHQlrORUQ4dUDCBA&uact=5&oq=DAL+vs+MIA&gs_lp=Egxnd3Mtd2l6LXNlcnAiCkRBTCB2cyBNSUEyCxAAGIAEGJECGIoFMgcQLhiABBgKMgUQABiABDIHEAAYgAQYCjIFEAAYgAQyBxAuGIAEGAoyBxAAGIAEGAoyBxAAGIAEGAoyBxAAGIAEGAoyBxAAGIAEGApIjBxQAFj4GHABeACQAQGYAcYBoAHSCaoBAzkuNLgBA8gBAPgBAZgCDaACygjCAgQQIxgnwgIKECMYgAQYJxiKBcICEBAuGIAEGLEDGEMYgwEYigXCAgoQABiABBhDGIoFwgIKEC4YgAQYQxiKBcICDRAuGIAEGLEDGEMYigXCAggQLhiABBixA8ICEBAAGIAEGLEDGEMYgwEYigXCAgsQABiABBixAxiDAcICDhAAGIAEGLEDGIMBGIoFwgILEC4YgAQYsQMYgwGYAwCSBwQxMC4zoAeddLIHAzkuM7gHxQg&sclient=gws-wiz-serp#sie=m;/g/11wb07yms0;3;/m/05jvx;dt;fp;1;;;"
                );
              }}
            >
              View
            </button>
          </div>
          <div className="flex justify-between items-center  rounded p-2 pl-6">
            <span>BOS vs CHI</span>
            <button
              className="px-3 py-1 rounded text-sm"
              onClick={() => {
                window.open(
                  "https://www.google.com/search?q=BOS+vs+CHI&sca_esv=7efe9108e6e32fec&rlz=1C5CHFA_enUS944US952&sxsrf=AHTn8zqL60bwJFzCTIqYLTaAXKRm4f8Uxw%3A1744237434740&ei=evP2Z6_qLM7jwN4PytnF4Qw&ved=0ahUKEwivj87l_suMAxXOMdAFHcpsMcwQ4dUDCBA&uact=5&oq=BOS+vs+CHI&gs_lp=Egxnd3Mtd2l6LXNlcnAiCkJPUyB2cyBDSEkyCxAAGIAEGJECGIoFMgsQABiABBiRAhiKBTILEAAYgAQYkQIYigUyBRAAGIAEMgUQABiABDIFEAAYgAQyBxAAGIAEGAoyBRAAGIAEMgcQABiABBgKMgcQABiABBgKSO8OUABY5ApwAHgBkAEAmAGdAaAB1QeqAQM2LjS4AQPIAQD4AQGYAgqgAvkHwgIKECMYgAQYJxiKBcICBBAjGCfCAgoQABiABBhDGIoFwgIKEC4YgAQYQxiKBcICEBAuGIAEGLEDGEMYgwEYigXCAg4QABiABBixAxiDARiKBcICCxAAGIAEGLEDGIMBwgILEC4YgAQYsQMYgwHCAhAQABiABBixAxhDGIMBGIoFwgIQEAAYgAQYsQMYgwEYFBiHAsICChAAGIAEGBQYhwLCAgQQABgDwgIKEAAYgAQYsQMYCpgDAJIHAzYuNKAHzUiyBwM2LjS4B_kH&sclient=gws-wiz-serp#sie=m;/g/11wb08gz73;3;/m/05jvx;dt;fp;1;;;"
                );
              }}
            >
              View
            </button>
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default Dashboard;
