import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import "./SearchBar.css";


const SearchBar = ({ playersPlayingToday, playerSelected }) => {
    const [expanded, setExpanded] = useState(false);

    // Stores the Search Term That the User Types
    const [searchTerm, setSearchTerm] = useState("");

    // Filtered Players Based on Search Term
    const [filteredPlayers, setFilteredPlayers] = useState([]);

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
                    player.playerName &&
                    player.playerName.toLowerCase().startsWith(searchTerm.toLowerCase())
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

        // Main Search Bar Container
        <Box className="search-container" 
            sx={{ 
                display: "flex",
                alignItems: "flex-end", 
                flexDirection: "column",
                width: "100%",       
                maxWidth: "100%",      
            }}
        >
            {/* Search Form w/ Animated Icon */}
            <Box
                component="form"
                className={`search-form ${expanded || searchTerm ? "active" : ""}`}
                sx={{
                    position: "relative",
                    width: expanded ? "100%" : "2em",
                    transition: "all 0.6s ease",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {/* Input Container For User Input */}
                <input
                    type="text"
                    ref={inputRef}
                    className="search-input"
                    placeholder={expanded ? "Search for players..." : ""}
                    value={searchTerm}
                    onFocus={() => setExpanded(true)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Search Icon */}
                <Box 
                    className="caret">         
                </Box>

                {/* Cancel Button (Only Shows When Search Bar is Expanded) */}
                {expanded && (
                    <Button
                        className="cancel-button-inside"
                        onClick={() => {
                            setSearchTerm("");
                            setExpanded(false);
                            setFilteredPlayers([]);
                        }}
                        sx={{
                            position: "absolute",
                            right: "2%",
                            fontSize: "0.75rem",
                            backgroundColor: "transparent",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "transparent",
                                outline: "none"
                            },
                            "&:focus": {
                                outline: "none",
                                backgroundColor: "transparent",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                )}
            </Box>
      
            {/* Player Search Results Dropdown Container */}
            {filteredPlayers.length > 0 && (
                <Box
                    sx={{
                        position: "relative",   
                        top: "2%",            
                        width: "100%",          
                        backgroundColor: "transparent",
                        overflowY: "auto",        
                        marginBottom: "5%",    
                    }}
                >
                    {/* Player Search Results Individual Row Container */}
                    {filteredPlayers.map((player, index) => (
                        <Box
                            key={`${player.playerId || player.playerName}-${index}`}
                            onClick={() => handlePlayerSelect(player)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                padding: "1rem 1rem",
                                borderBottom: "1px solid white",
                                cursor: "pointer",
                                backgroundColor: "transparent",
                                "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            {/* Player Picture */}
                            <img
                                src={player.playerPicture}
                                alt={player.playerName}
                                style={{
                                width: "6rem",
                                borderRadius: "5rem",
                                marginRight: "2%",
                                border: "2px solid white",
                                }}
                            />

                            {/* Player Name and Team Tri Code */}
                            <Typography 
                                sx={{ 
                                    fontFamily: "monospace", 
                                    color: "white" 
                                }}
                            >
                                {player.playerName} - {player.teamTriCode}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}


export default SearchBar;

