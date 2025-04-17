import { Box, Typography, Divider } from "@mui/material";
import "./TeamBanner.css";
import { valorantTeamLogo } from "./TeamColor";

function ValorantTeamBanner({ homeTeam, awayTeam, logos, colors }) {

    const homeLogo = valorantTeamLogo[homeTeam]?.logo;
    const awayLogo = valorantTeamLogo[awayTeam]?.logo;

    const homeColors = { primary: homeTeam.primary, secondary: homeTeam.secondary };
    const awayColors = { primary: awayTeam.primary, secondary: awayTeam.secondary };

    const slices = Array.from({length: 80});

    return (
        <Box
            sx ={{
                position: "sticky",
                top: "5%",
            }}
        >
            {/* Team Banner */}
            <div className="banner-container">
                <div className="banner-wrapper-vertical banner-border"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        borderColor: "silver"
                }}>
                    {slices.map((_, i) => (
                        <div
                        className="banner-row"
                        key={`awayTeam-${i}`}
                        style={{
                            "--i": i,
                            backgroundColor: "gray",
                        }}
                        ></div>
                    ))}

                    <div className="banner-label" style={{ color: awayTeam.secondary }}>
                        <img src={awayLogo} alt={awayTeam} style={{ width: 180 }} />
                        {awayTeam}
                    </div>
                </div>
                
                <div className="flex mt-100 ml-1 text-4xl text-white font-bold">V.S.</div>

                <div className="banner-wrapper-vertical banner-border"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        borderColor: "silver",
                }}>
                    {slices.map((_, i) => (
                        <div
                        className="banner-row"
                        key={`homeTeam-${i}`}
                        style={{
                            "--i": i,
                            backgroundColor: "gray",
                        }}
                        ></div>
                    ))}

                    <div className="banner-label" style={{ color: homeTeam.secondary }}>
                        <img src={homeLogo} alt={homeTeam} style={{ width: 180 }} />
                        {homeTeam}
                    </div>
                </div>
            </div>
        </Box>
    );
}

export default ValorantTeamBanner


