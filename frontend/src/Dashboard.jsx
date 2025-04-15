import { useState } from "react";
import { useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { Box, Typography, Divider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import Lineups from "./Lineups";
import { calculatePayoutMultiplier } from "./payoutMultiplier";
import { format, parse, set } from "date-fns";
import SearchBar from "./SearchBar";
import Valorant from "./Valorant";
import "./Dashboard.css";
import PieChart from "./PieChart";
import CenteredModal from "./utilities/CenteredModal";
import TeamBanner from "./TeamBanner";

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
  const [currUser, setCurrUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userTotalWon, setUserTotalWon] = useState(0);
  const [userTotalEntriesValue, setUserTotalEntriesValue] = useState(0);

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

  useEffect(() => {
    const fetchUpdatedUser = async () => {
      const user = JSON.parse(localStorage.getItem("currUser"));
      if (user?.email) {
        try {
          const response = await fetch(`http://localhost:8000/lineups/user/${user.email}`);
          const data = await response.json();
          const userLineups = data.lineups ?? [];

          let userWins = 0
          let userLosses = 0;
          let totalPayoutSum = 0;
          let totalEntryDeposit = 0;

          userLineups.forEach((lineup) => {
            const payout = parseFloat(lineup.actual_payout || 0);
            const entry = parseFloat(lineup.entry_amount);

            if(lineup.result === "WON" || lineup.result === "LOST") {
              totalEntryDeposit += entry;
            }

            if (payout > 0) {
              totalPayoutSum += payout;
            }
          });

          setUserTotalWon(totalPayoutSum);
          setUserTotalEntriesValue(totalPayoutSum - totalEntryDeposit);

          const updatedUser = await fetch(`http://localhost:8000/funds/user/${user.email}`).then(res => res.json());

          // Updates localStorage with the Updated User Data
          localStorage.setItem("currUser", JSON.stringify(updatedUser));
          setCurrUser(updatedUser);
        } catch (error) {
          console.error("Error fetching updated user data: ", error);
        }
      }
    };
    fetchUpdatedUser();
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

  // Function to Handle the Category Tab Change (NBA, NFL, VAL)
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

    if (allEntries.length < 2 || allEntries.length > 6) {
      setModalMessage("Lineup must be between 2 and 6 players.");
      setIsModalOpen(true);
      return;
    }

    const sameTeam =
      new Set(allEntries.map((player) => player.team_tri_code)).size === 1;
    if (sameTeam) {
      setModalMessage("Lineup cannot contain players from the same team.");
      setIsModalOpen(true);
      return;
    }

    const currUser = JSON.parse(localStorage.getItem("currUser"));

    if (!currUser || !currUser.email) {
      setModalMessage("User not logged in.");
      setIsModalOpen(true);
      return;
    }

    const entryId = `${currUser.email}_${Date.now()}_${uuidv4()}`;

    if (!entryType || !entryAmount || entryAmount <= 0) {
      setModalMessage(
        "Select a valid entry type and/or input a valid entry amount."
      );
      setIsModalOpen(true);
      return;
    }

    const calculatePayout = calculatePayoutMultiplier(
      entryType,
      allEntries.length,
      allEntries.length
    );

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
        setModalMessage("Lineup submitted successfully!");
        setIsModalOpen(true);
        setLineup({});
        setShowBettingLines(false);
      } 
      else {
        let errorMessage = "Error submitting lineup.";
      
        try {
          const errorData = await response.json();
          errorMessage = errorData?.detail || errorMessage;
        } 
        
        catch (jsonError) {
          const text = await response.text();
          if (text.includes("Insufficient balance")) {
            errorMessage = "Insufficient balance. Please deposit funds!";
          }
        }
      
        if (errorMessage === "Insufficient balance") {
          setModalMessage("Insufficient balance. Please deposit funds!");
        } 
        else if (errorMessage === "Lineups cannnot just contain players from the same team") {
          setModalMessage("Lineups cannot include players from only one team.");
        } 
        else {
          setModalMessage(errorMessage);
        }
      
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting lineup: ", error);
      setModalMessage("Error submitting lineup. Please try again.");
      setIsModalOpen(true);
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
    if (pick === "Clear All") {
      setLineup({});
      return;
    }

    setLineup((prevLines) => {
      const newPick = {};

      for (const category in prevLines) {
        const categoryLineup = prevLines[category];

        if (pick === "Remove") {
          const filteredLineup = categoryLineup.filter(
            (entry) => entry.player_id !== playerId
          );
          if (filteredLineup.length > 0) {
            newPick[category] = filteredLineup;
          }
        } else {
          newPick[category] = prevLines[category].map((entry) =>
            entry.player_id === playerId
              ? { ...entry, users_pick: pick }
              : entry
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
        const findPlayerSquare = document.getElementById(
          `player-${player.playerId}`
        );

        // Finding the Player Square, Scrolling to It Then Highlighting It
        if (findPlayerSquare) {
          findPlayerSquare.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          findPlayerSquare.classList.add("card-highlight");
        }
      }, 600);

      console.log("Selected Player: ", player);
    }
  };

  return (
    // Main Dashboard Container
    <Box
      className="flex w-full overflow-visible justify-center items-center flex-col md:flex-row"
      sx={{
        gap: "2%",
      }}
    >
      {/* Game Schedule Container */}
      <Box className="TESTING flex flex-col w-full  items-center justify-center md:w-2/3">
        {/* Outer Scoreboard Container */}
        <Box
          className="w-full p-2 md:p-8 text-white"
          sx={{
            maxWidth: "1200px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "1rem",
            border: "1px solid gray",
          }}
        >
          {/* Tabs (NBA, NFL, VAL) */}
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
            {/*Each Tab (NBA, NFL, VAL) */}
            {["NBA", "NFL", "VAL"].map((category) => (
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

          <Box sx={{ mt: 2 }}>
            {/* ------NBA Games Dashboard Display------ */}
            {activeCategoryTab === "NBA" && (
              <div className="flex flex-col w-full min-h-screen">
                {/* Search Bar Container */}
                <div className="relative overflow-visible min-h-24">
                  {/* Search Bar Component to Show Players Playing Today */}
                  <SearchBar
                    playersPlayingToday={nbaPlayerStats.filter((player) =>
                      nbaLiveGames.gameData.some(
                        (game) =>
                          player.teamTriCode === game.awayTeam.teamTriCode ||
                          player.teamTriCode === game.homeTeam.teamTriCode
                      )
                    )}
                    playerSelected={handlePlayerClick}
                  />
                </div>

                {nbaLiveGames.gameData.length === 0 ? (
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontFamily: "monospace",
                      textAlign: "center",
                    }}
                  >
                      No Scheduled Games
                  </Typography>
                ) : (
                  nbaLiveGames.gameData.map((game, index) => (
                    // Each Game Box
                    <div
                      key={index}
                      style={{
                        borderRadius: "1rem",
                      }}
                      onClick={() => {
                        if (game.gameStatus === 1) {
                          setnbaselectedGame(game);
                          setShowBettingLines(true);
                        }
                      }}
                      className="flex flex-col justify-center relative mb-4 p-4 md:p-8 md:pl-10 bg-black bg-opacity-50 rounded border border-gray-500 cursor-pointer"
                    >
                      {/* Game Status Display - Positioned Absolutely on the Right */}
                      <div className="absolute mr-8 md:mr-24 right-0 flex flex-col items-end text-center">
                        <Typography
                          sx={{ fontFamily: "monospace" }}
                          className="text-base md:text-3xl font-bold text-right"
                          fontSize={20}
                        >
                          {game.gameStatusText}
                        </Typography>

                        {game.gameStatus === 2 && (
                          <Typography
                            sx={{ fontFamily: "monospace" }}
                            className="text-base md:text-xl font-mono text-right"
                            fontSize={20}
                          >
                            {gameClockConverter(game.gameClock)}
                          </Typography>
                        )}
                      </div>

                      {/* Teams Container */}
                      <div className="flex flex-col space-y-8 w-full ">
                        {/* Away Team Row */}
                        <div className="flex flex-wrap items-center ">
                          <div className="w-3/4 flex justify-around ">
                            {/* Team Code and Record */}
                            <div className="flex items-center justify-center w-full gap-4 md:w-1/4 mb-2 md:mb-0 ">
                              <Typography
                                variant="h6"
                                sx={{ 
                                  fontFamily: "monospace",
                                  fontWeight: "bold",
                                }}
                                className={`mr-4 ${
                                  game.gameStatus === 3 &&
                                  game.awayTeam.score > game.homeTeam.score
                                    ? "text-green-700"
                                    : "text-white"
                                }`}
                              >
                                {game.awayTeam.teamTriCode}
                              </Typography>

                              <Typography
                                className="text-xs font-bold"
                                sx={{ 
                                  fontFamily: "monospace",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {game.awayTeam.wins} - {game.awayTeam.losses}
                              </Typography>
                            </div>

                            {/* Away Team Periods and Score */}
                            <div className="flex justify-between items-center w-full md:w-1/2 pl-0 md:pl-8"
                              style={{
                                visibility: game.gameStatus === 2 || game.gameStatus === 3 ? "visible" : "hidden",
                              }}
                              >
                              <div className="flex space-x-4 md:space-x-8">
                                {game.awayTeam.periods.map(
                                  (period, index) => (
                                    <div key={index} className="text-center">
                                      <Typography
                                        sx={{ fontFamily: "monospace" }}
                                      >
                                        {period.period}
                                      </Typography>
                                      <Typography
                                        sx={{ 
                                          fontFamily: "monospace",
                                          fontWeight: "bold", 
                                        }}
                                        className="text-xs"
                                      >
                                        {period.score}
                                      </Typography>
                                    </div>
                                  )
                                )}
                              </div>
                              {/* Away Team Score */}
                              <Typography
                                fontSize={20}
                                sx={{ 
                                  fontFamily: "monospace",
                                  fontWeight: "bold", 
                                }}
                                className={` text-xl ml-4 ${
                                  game.gameStatus === 3 &&
                                  game.awayTeam.score > game.homeTeam.score
                                    ? "text-green-700"
                                    : "text-white"
                                }`}
                              >
                                {game.awayTeam.score}
                              </Typography>
                            </div>
                          </div>
                        </div>

                        {/* Home Team Row */}
                        <div className="flex flex-wrap items-center">
                          <div className="w-3/4 flex justify-around ">
                            {/* Team Code and Record */}
                            <div className="flex items-center justify-center w-full gap-4 md:w-1/4 mb-2 md:mb-0">
                              <Typography
                                variant="h6"
                                sx={{ 
                                  fontFamily: "monospace",
                                  fontWeight: "bold", 
                                }}
                                className={`mr-4 ${
                                  game.gameStatus === 3 &&
                                  game.homeTeam.score > game.awayTeam.score
                                    ? "text-green-700"
                                    : "text-white"
                                }`}
                              >
                                {game.homeTeam.teamTriCode}
                              </Typography>

                              <Typography
                                sx={{ 
                                  fontFamily: "monospace",
                                  fontSize: "0.7rem",
                                }}
                                className="text-xs font-bold"
                              >
                                {game.homeTeam.wins} - {game.homeTeam.losses}
                              </Typography>
                            </div>

                            {/* Home Team Periods and Score */}
                            <div className="flex justify-between items-center w-full md:w-1/2 pl-0 md:pl-8"
                              style={{
                                visibility: game.gameStatus === 2 || game.gameStatus === 3 ? "visible" : "hidden",
                              }}
                            >
                              <div className="flex space-x-4 md:space-x-8">
                                {game.homeTeam.periods.map(
                                  (period, index) => (
                                    <div key={index} className="text-center">
                                      <Typography
                                        sx={{ fontFamily: "monospace" }}
                                      >
                                        {period.period}
                                      </Typography>
                                      <Typography
                                        sx={{ 
                                          fontFamily: "monospace",
                                          fontWeight: "bold",
                                        }}
                                        className="text-xs"
                                      >
                                        {period.score}
                                      </Typography>
                                    </div>
                                  )
                                )}
                              </div>

                              <Typography
                                fontSize={20}
                                sx={{ 
                                  fontFamily: "monospace",
                                  fontWeight: "bold", 
                                }}
                                className={`text-xl ml-4 ${
                                  game.gameStatus === 3 &&
                                  game.homeTeam.score > game.awayTeam.score
                                    ? "text-green-700"
                                    : "text-white"
                                }`}
                              >
                                {game.homeTeam.score}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ------NFL Games Dashboard Display (Visual Only)------ */}
            {activeCategoryTab === "NFL" && (
              <Box
                className="flex flex-col w-full h-full"
                sx={{
                  overflow: "visible",
                  position: "relative",
                  minHeight: "100vh",
                }}
              >
                {/* Search Bar Container (Visual Only) */}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "visible",
                    minHeight: "6rem",
                  }}
                >
                  {/* Search Bar Component (Visual Only) */}
                  <SearchBar
                    playersPlayingToday={[]}
                    playerSelected={() => {}}
                  />
                </Box>

                {/* No Scheduled Games Message (Defaulted) */}
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  No Scheduled Games
                </Typography>
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
                  zIndex: 1100,
                  paddingBottom: "10%",
                  alignItems: "center",
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
                      position: "sticky",
                      top: "0",
                      textAlign: "center",
                      paddingTop: "4vh",
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
                      position: "sticky",
                      top: "10%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "2.2vh",
                      gap: "1.3vw",
                      width: "100%",
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
                            (player) =>
                              parseFloat(getStatCategory(player)) !== 0
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
                                  onClick={() =>
                                    handleUserLines(player, "Under")
                                  }
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
                                  onClick={() =>
                                    handleUserLines(player, "Over")
                                  }
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

                      <Box>
                        <TeamBanner nbaSelectedGame={nbaSelectedGame} />
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
                            (player) =>
                              parseFloat(getStatCategory(player)) !== 0
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
                                  onClick={() =>
                                    handleUserLines(player, "Under")
                                  }
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
                                  onClick={() =>
                                    handleUserLines(player, "Over")
                                  }
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
            <Box
              className="flex flex-col w-full h-full"
              sx={{
                overflow: "visible",
                position: "relative",
                minHeight: "100vh",
              }}
            >
              {/* This is where the new Valorant component is rendered */}
              <Valorant />
            </Box>
          )}

          {/* ------Lineups Bar Popup Display------ */}
          {Object.values(lineup).flat().length >= 1 &&
            Object.values(lineup).flat().length <= 6 && (
              <Lineups
                lineup={Object.values(lineup).flat()}
                expand={() => setShowLineupBar(true)}
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
              onClose={() => setShowLineupBar(false)}
              onSubmit={submitLineup}
              isExpanded={showLineupBar}
              pickUpdate={userPickUpdate}
            />
          )}
        </Box>
      </Box>

      {/* Modal */}
      <CenteredModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />

      {/* ------Right Sidebar Display------ */}
      <Box
        className={`flex flex-col h-full rounded-2xl md:w-1/3 ${
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
          // width: "45%",
          marginRight: "2%",
          border: "1px solid gray",
          overflowX: "hidden",
        }}
      >
        {/* Date Container */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5%",
          }}
        >
          {/* Display the Date */}
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontFamily: "monospace",
              paddingBottom: "1rem",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {nbaLiveGames.gameDate && nbaLiveGames.gameDate !== "N/A"
              ? format(
                  new Date(`${nbaLiveGames.gameDate}T00:00:00`),
                  "MMMM d, yyyy"
                )
              : ""}
          </Typography>
        </Box>

        <Divider
          sx={{
            bgcolor: "gray",
            height: "1px",
          }}
          flexItem
        />

        {/* Earnings Container */}
        <Box
          className=" text-white rounded-t-lg flex flex-col items-center h-1/3"
          sx={{
            height: "18em",
            position: "relative",
            marginTop: "4%",
          }}
        >
          {/* Earnings Header Text */}
          <Typography
            className="text-xl font-bold"
            sx={{
              fontFamily: "monospace",
              textAlign: "center",
              color: "white",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            Earnings
          </Typography>

          {/* Earnings Pie Chart */}
          <PieChart
            totalWon={userTotalWon}
            totalEntriesValue={userTotalEntriesValue}
            wins={currUser?.wins ?? 0}
            losses={currUser?.losses ?? 0}
          />
        </Box>

        <Divider
          sx={{
            bgcolor: "gray",
            height: "1px",
          }}
          flexItem
        />

        {/* Game Highlights Header Container */}
        <Box className=" text-white rounded-b-lg p-4 h-1/3">
          {/* Game Highlights Header Text */}
          <Typography
            sx={{
              fontFamily: "monospace",
              textAlign: "center",
              color: "white",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            Game Highlights
          </Typography>

          {/* 1st Game Highlights Container (1st Row) */}
          <Box className="flex justify-between items-center rounded p-2 pl-6 mb-2 mt-2">
            {/* 1st Game Highlights Text (1st Row) */}
            <Typography
              sx={{
                fontFamily: "monospace",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              NYK vs LAL
            </Typography>

            {/* 1st Game Highlights Button (1st Row)*/}
            <button
              style={{
                fontFamily: "monospace",
                color: "white",
                fontSize: "1.2rem",
                backgroundColor: "transparent",
                borderRadius: "0.5rem",
                border: "1px solid white",
              }}
              onClick={() =>
                window.open(
                  "https://www.google.com/search?q=nyk+vs+lal&rlz=1C5CHFA_enUS944US952&oq=nyk+vs+lal&gs_lcrp=EgZjaHJvbWUyCQgAEEUYORiABDIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDM1MjZqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#sie=m;/g/11lmmffyw8;3;/m/05jvx;dt;fp;1;;;"
                )
              }
            >
              View
            </button>
          </Box>
          <Divider sx={{ bgcolor: "white", opacity: 0.3 }} />

          {/* 2nd Game Highlights Container (2nd Row) */}
          <Box className="flex justify-between items-center rounded p-2 pl-6 mb-2 mt-2">
            {/* 2nd Game Highlights Text (2nd Row) */}
            <Typography
              sx={{
                fontFamily: "monospace",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              DAL vs MIA
            </Typography>

            {/* 2nd Game Highlights Text (1nd Row) */}
            <button
              style={{
                fontFamily: "monospace",
                color: "white",
                fontSize: "1.2rem",
                backgroundColor: "transparent",
                borderRadius: "0.5rem",
                border: "1px solid white",
              }}
              onClick={() => {
                window.open(
                  "https://www.google.com/search?q=DAL+vs+MIA&sca_esv=7efe9108e6e32fec&rlz=1C5CHFA_enUS944US952&sxsrf=AHTn8zrEaDDdmDcZVD7guyebStxennkvvg%3A1744237313029&ei=AfP2Z5q3AankwN4PidblqQE&ved=0ahUKEwjau8mr_suMAxUpMtAFHQlrORUQ4dUDCBA&uact=5&oq=DAL+vs+MIA&gs_lp=Egxnd3Mtd2l6LXNlcnAiCkRBTCB2cyBNSUEyCxAAGIAEGJECGIoFMgcQLhiABBgKMgUQABiABDIHEAAYgAQYCjIFEAAYgAQyBxAuGIAEGAoyBxAAGIAEGAoyBxAAGIAEGAoyBxAAGIAEGAoyBxAAGIAEGApIjBxQAFj4GHABeACQAQGYAcYBoAHSCaoBAzkuNLgBA8gBAPgBAZgCDaACygjCAgQQIxgnwgIKECMYgAQYJxiKBcICEBAuGIAEGLEDGEMYgwEYigXCAgoQABiABBhDGIoFwgIKEC4YgAQYQxiKBcICDRAuGIAEGLEDGEMYigXCAggQLhiABBixA8ICEBAAGIAEGLEDGEMYgwEYigXCAgsQABiABBixAxiDAcICDhAAGIAEGLEDGIMBGIoFwgILEC4YgAQYsQMYgwGYAwCSBwQxMC4zoAeddLIHAzkuM7gHxQg&sclient=gws-wiz-serp#sie=m;/g/11wb07yms0;3;/m/05jvx;dt;fp;1;;;"
                );
              }}
            >
              View
            </button>
          </Box>
          <Divider sx={{ bgcolor: "white", opacity: 0.3 }} />

          {/* 3rd Game Highlights Container (3rd Row) */}
          <Box className="flex justify-between items-center rounded p-2 pl-6 mb-2 mt-2">
            {/* 3rd Game Highlights Text (3rd Row) */}
            <Typography
              sx={{
                fontFamily: "monospace",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              BOS vs CHI
            </Typography>

            {/* 3rd Game Highlights Text (3rd Row) */}
            <button
              style={{
                fontFamily: "monospace",
                color: "white",
                fontSize: "1.2rem",
                backgroundColor: "transparent",
                borderRadius: "0.5rem",
                border: "1px solid white",
              }}
              onClick={() => {
                window.open(
                  "https://www.google.com/search?q=BOS+vs+CHI&sca_esv=7efe9108e6e32fec&rlz=1C5CHFA_enUS944US952&sxsrf=AHTn8zqL60bwJFzCTIqYLTaAXKRm4f8Uxw%3A1744237434740&ei=evP2Z6_qLM7jwN4PytnF4Qw&ved=0ahUKEwivj87l_suMAxXOMdAFHcpsMcwQ4dUDCBA&uact=5&oq=BOS+vs+CHI&gs_lp=Egxnd3Mtd2l6LXNlcnAiCkJPUyB2cyBDSEkyCxAAGIAEGJECGIoFMgsQABiABBiRAhiKBTILEAAYgAQYkQIYigUyBRAAGIAEMgUQABiABDIFEAAYgAQyBxAAGIAEGAoyBRAAGIAEMgcQABiABBgKMgcQABiABBgKSO8OUABY5ApwAHgBkAEAmAGdAaAB1QeqAQM2LjS4AQPIAQD4AQGYAgqgAvkHwgIKECMYgAQYJxiKBcICBBAjGCfCAgoQABiABBhDGIoFwgIKEC4YgAQYQxiKBcICEBAuGIAEGLEDGEMYgwEYigXCAg4QABiABBixAxiDARiKBcICCxAAGIAEGLEDGIMBwgILEC4YgAQYsQMYgwHCAhAQABiABBixAxhDGIMBGIoFwgIQEAAYgAQYsQMYgwEYFBiHAsICChAAGIAEGBQYhwLCAgQQABgDwgIKEAAYgAQYsQMYCpgDAJIHAzYuNKAHzUiyBwM2LjS4B_kH&sclient=gws-wiz-serp#sie=m;/g/11wb08gz73;3;/m/05jvx;dt;fp;1;;;"
                );
              }}
            >
              View
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
