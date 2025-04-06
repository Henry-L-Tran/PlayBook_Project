import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LineupsPage = ({ userEmail}) => {
    const [userLineups, setUserLineups] = useState([]);

    useEffect(() => {
        const fetchUserLineups = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/lineups/user/${userEmail}`);
                // The Newest Lineups Will Be At the Top
                setUserLineups(response.data.lineups.reverse());
            }
            catch (error) {
                console.error("Error fetching user's lineups: ", error);
            }
        };

        fetchUserLineups();

        // Refreshes User's Lineups Every 20 Seconds
        const refreshTimer = setInterval(fetchUserLineups, 20000);
        return () => clearInterval(refreshTimer);
    }, [userEmail]);


    return (
        <div className="lineups-page">
            {userLineups.map((lineup, idx) => (
                <LineupBox key={idx} lineup={lineup} />
            ))}
        </div>
    )
}


const LineupBox = ({ lineup }) => {
    const [lineupExpanded, setLineupExpanded] = useState(false);
    const gameStatusColor = lineup.result === "WON" ? "green" : lineup.result === "LOST" ? "red" : "gray";

    return (
        <div className="lineup-box"
            onClick={() => setLineupExpanded(!lineupExpanded)}>
                <div className="lineup-header">
                    <div>
                        <strong>{lineup.entry_type}</strong> - ${lineup.entry_amount}
                    </div>
                    <div style={{ color: gameStatusColor }}>
                        {lineup.result || "IN PROGRESS"}
                </div>
            </div>

            <div className="lineup-pictures">
                {lineup.entries.map((entry, idx) => (
                    <img
                        key={idx}
                        src={entry.player_picture}
                        alt={entry.player_name}
                        className="player-picture"
                        style={{
                            width: "6rem",
                            border: "2px solid white",
                            borderRadius: "10rem",
                            objectFit: "cover",
                            imageRendering: "auto",
                        }}
                    />
                ))}
            </div>

            {lineupExpanded && (
                <div className="lineup-details">
                    {lineup.entries.map((entry, idx) => (
                        <UserLineup
                            key={idx}
                            entry={entry}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}


const UserLineup = ({ entry }) => {
    const { player_name, line_category, projected_line, live_value, user_pick, status } = entry;

    const percent = Math.min((live_value / projected_line) * 100, 100);
    const barColor = status === "hit" ? "green" : status === "miss" ? "red" : "gray";

    return (
        <div className="player-line">
            <div className="player-line-info">
                <strong>{player_name}</strong> • {line_category} • {user_pick} {projected_line}
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{width: `${percent}%`, backgroundColor: barColor}}
                ></div>
                <span className="live-value">{live_value ?? "-"}</span>
            </div>
        </div>
    );
};



export default LineupsPage;

