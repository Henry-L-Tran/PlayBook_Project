import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
  } from "@mui/material";

function Home() {

    const navigator = useNavigate();


    return (
        <Box
            className="flex items-center flex-col justify-center min-h-screen"
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                position: "relative",
            }}>

                <div
                    className="absolute flex items-center gap-2"
                    style={{
                        position: "absolute", 
                        top: "2rem", 
                        left: "6rem", 
                        display: "flex",
                        alignItems: "center",
                    }}>

                    <img
                        src="/images/logo.png"
                        alt="PlayBook Logo"
                        style={{
                            width: "90px",
                            height: "90px",
                            alignSelf: "left",
                        }}
                    />

                    <Typography
                        fontWeight={"600"}
                        sx={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: "2.5rem",
                            fontFamily: "monospace",
                        }}
                    >
                        PlayBook
                    </Typography>
                </div>


                <div
                    className="absolute"
                    style={{
                        position: "absolute",
                        top: "3.2rem",
                        right: "6rem",
                    }}
                >       
                    <Button
                        variant="text"
                        disableRipple
                        sx={{
                            color: "white",
                            fontSize: "2rem",
                            fontWeight: "600",
                            textTransform: "none",
                            border: "none",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            padding: "0",
                            fontFamily: "monospace",
                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: "underline",
                            },                
                            "&:focus": {
                                backgroundColor: "transparent",
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                            },
                        }}
                        onClick={() => navigator("/funds")}
                    >
                        Funds
                    </Button>
                </div>

                <div style={{
                    position: "absolute",
                        width: "108rem",
                        height: "4px",
                        backgroundColor: "white",
                        top: "8rem",
                    }}>
                    </div>
        </Box>
    )
}

export default Home