import { Box, Typography, Divider } from "@mui/material";
import "./TeamBanner.css";
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

    const slices = Array.from({length: 80});

    return (
        <Box
            sx ={{
                position: "sticky",
                top: "22%",
            }}
        >
            {/* Team Banner */}
            <div className="banner-container">
                <div className="banner-wrapper-vertical banner-border"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        borderColor: awayColors.secondary
                }}>
                    {slices.map((_, i) => (
                        <div
                        className="banner-row"
                        key={`away-${i}`}
                        style={{
                            "--i": i,
                            backgroundColor: awayColors.primary,
                        }}
                        ></div>
                    ))}

                    <div className="banner-label" style={{ color: awayColors.secondary }}>
                        <TeamLogo teamTriCode={awayTriCode} size={180} />
                        {awayTriCode}
                    </div>
                </div>
                
                <div className="flex mt-115 ml-1 text-4xl text-white font-bold">V.S.</div>

                <div className="banner-wrapper-vertical banner-border"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        borderColor: homeColors.secondary
                }}>
                    {slices.map((_, i) => (
                        <div
                        className="banner-row"
                        key={`home-${i}`}
                        style={{
                            "--i": i,
                            backgroundColor: homeColors.primary,
                        }}
                        ></div>
                    ))}

                    <div className="banner-label" style={{ color: homeColors.secondary }}>
                        <TeamLogo teamTriCode={homeTriCode} size={180} />
                        {homeTriCode}
                    </div>
                </div>
            </div>
        </Box>
    );
}

export default TeamBanner

