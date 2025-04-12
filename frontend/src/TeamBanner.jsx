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


function TeamBanner({nbaSelectedGame}) {


    return (
        <Box>
            {/* Team Banner */}
            <h2 style={{ textAlign: "center", color: "white" }}></h2>
            <div className="banner-container">
            <div className="banner green">
                <div className="banner-top"></div>
                <div className="banner-icon">{nbaSelectedGame.awayTeam.teamTriCode}</div>
            </div>
            <div className="banner blue">
                <div className="banner-top"></div>
                <div className="banner-icon">{nbaSelectedGame.homeTeam.teamTriCode}</div>
            </div>
            </div>
        </Box>
    );
}

export default TeamBanner

