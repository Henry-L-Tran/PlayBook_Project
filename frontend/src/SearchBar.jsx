import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const SearchBar = ({ playersPlayingToday, playerSelected }) => {
    const [expanded, setExpanded] = useState(false);

    // Stores the Search Term That the User Types
    const [searchTerm, setSearchTerm] = useState("");

    // Filtered Players Based on Search Term
    const [filteredPlayers, setFilteredPlayers] = useState(playersPlayingToday);

    // Focuses the Input Field When It's Expanded
    const inputRef = useRef();

    // Sets the Input Field to Focus When Expanded
    useEffect(() => {
        if (expanded) {
            inputRef.current?.focus();
        }
    }, [expanded]);

    // Filters the Players Based on the Search Term, If Search Term is Empty, It's Set Empty
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredPlayers([]);
        }
        else {
            const filtered = playersPlayingToday.filter(player => {
                return (
                    player.name &&
                    player.name.toLowerCase().startsWith(searchTerm.toLowerCase())
                );
            });
            setFilteredPlayers(filtered);
        }
    }, [searchTerm, playersPlayingToday]);


    // Handles the Click Event When a Player is Selected
    const handlePlayerSelect = (player) => {
        setSearchTerm("");
        setExpanded(false);
        setFilteredPlayers([]);
        playerSelected(player);
    };

    return (
        // Search Bar Component Container
        <Box
            sx={{
                position: "relative",
                width: expanded ? "100%" : "3rem", transition: "width 1s ease" 
            }}
        >
            {/* Search Icon & User Input Bar Container */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "black",
                    borderRadius: "5rem",
                    padding: expanded ? "0.5rem 1rem" : "0.5rem",
                }}
            >
                {/* Search Icon Button */}
                <IconButton
                    onClick={() => setExpanded(!expanded)}
                >
                    <SearchIcon />
                </IconButton>

                {/* Search Input Bar */}
                {expanded && (
                    <InputBase
                        inputRef={inputRef}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for players..."
                        sx={{
                            flex: 1,
                            marginLeft: "1rem",
                        }}
                    />
                )}
            </Box>

            {/* Results Dropdown Container */}
            {filteredPlayers.length > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "black",
                        maxHeight: "20%",
                        overflowY: "auto",
                    }}
                >
                    {/* Maps Through Filtered Players and Displays the Searched Content */}
                    {filteredPlayers.map((player => (
                        <Box
                            key={player.id}
                            onClick={() => handlePlayerSelect(player)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0.5rem 1rem",
                                borderBottom: "1px solid white",
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            {/* Player Picture */}
                            <img
                                src={entry.player_picture}
                                alt={entry.player_name}
                                style={{
                                    width: "6rem",
                                    borderRadius: "5rem",
                                    marginRight: "1rem",
                                    border: `2px solid ${barColor}`,
                                }}
                            />

                            {/* Player Name and Team Tricode */}
                            <Typography
                                sx={{
                                    fontFamily: "monospace",
                                }}
                            >
                                {player.name} ({player.teamTricode})
                            </Typography>
                        </Box>
                    )))}
                </Box>
            )}
        </Box>
    )
}


export default SearchBar;

