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
import "./TeamBanner.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import * as NBAIcons from "react-nba-logos";
import TeamColor from "./TeamColor";

const TeamLogo = ({ teamTriCode, size }) => {
    const Logo = NBAIcons[teamTriCode];
    return Logo ? <Logo size = {size} /> : <p></p>
};

const GameCard = ({ home, away }) => {
    return(
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <TeamLogo tricode={home} />
          <TeamLogo tricode={away} />
        </div>
    );
};

function TeamBanner({ nbaSelectedGame}) {

    const awayTriCode = nbaSelectedGame.awayTeam.teamTriCode;
    const homeTriCode = nbaSelectedGame.homeTeam.teamTriCode;

    const awayColors = TeamColor[awayTriCode] || { primary: "gray", secondary: "white" };
    const homeColors = TeamColor[homeTriCode] || { primary: "gray", secondary: "white" };

    


    return (
        <Box
            sx ={{
                position: "sticky",
                top: "22%",
            }}
        >
            {/* Team Banner */}
            <div className="banner-container">
                <div className="banner"
                    style={{
                        backgroundColor: awayColors.primary,
                        borderTopColor: awayColors.secondary,
                        borderLeftColor: awayColors.secondary,
                        borderRightColor: awayColors.secondary,
                        borderBottomColor: awayColors.secondary,
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <TeamLogo teamTriCode={nbaSelectedGame.awayTeam.teamTriCode} size={180} />
                    <div className="banner-icon"
                        style ={{
                            color: awayColors.secondary,
                        }}
                    >{nbaSelectedGame.awayTeam.teamTriCode}</div>
                </div>
                
                <div className="flex mt-115 text-3xl">V.S.</div>

                <div className="banner"
                    style={{
                        backgroundColor: homeColors.primary,
                        borderTopColor: homeColors.secondary,
                        borderLeftColor: homeColors.secondary,
                        borderRightColor: homeColors.secondary,
                        borderBottomColor: homeColors.secondary,
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <TeamLogo teamTriCode={nbaSelectedGame.homeTeam.teamTriCode} size={180} />
                    <div className="banner-icon"
                        style ={{
                            color: homeColors.secondary,
                        }}
                    >{nbaSelectedGame.homeTeam.teamTriCode}</div>
                </div>
            </div>
        </Box>
    );
}

export default TeamBanner

