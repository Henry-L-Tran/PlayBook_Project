import { Box, Typography } from "@mui/material";

const EarningsPieChart = ({ balance, wins, losses }) => {
  const totalGames = wins + losses;
  const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  const lossPercentage = 100 - winPercentage;

  return (
    // Main Container for the Pie Chart
    <Box
        sx={{
            position: "relative",
            width: "12rem",
            height: "12rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        {/* Outer Circle for Win/Loss Percentage */}
        <Box className="pie-chart"
        sx={{
            width: "10rem",
            height: "10rem",
            borderRadius: "50%",
            background: `conic-gradient(green ${winPercentage}%, red ${winPercentage}%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem",
            marginTop: "1rem",
        }}
        >
            {/* Inner Circle for Balance Display Container */}
            <Box
                sx={{
                width: "8rem",
                height: "8rem",
                borderRadius: "50%",
                backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
                {/* Balance Text Display */}
                <Typography
                    sx={{
                        fontFamily: "monospace",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                    }}
                >
                    ${balance?.toFixed(2) ?? "0.00"}
                </Typography>
            </Box>
        </Box>

        {/* Win/Loss Label Container */}
        <Box
            sx={{
                position: "absolute",
                marginBottom: "80%",
                color: "white",
                fontFamily: "monospace",
                fontWeight: "bold",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "flex-start",
            }}
        >
            {/* Green Color Circle */}
            <Box
                sx={{
                    width: "0.75rem",
                    height: "0.75rem",
                    backgroundColor: "green",
                    borderRadius: "50%",
                }}
            />

            {/* Win Count Text */}
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    marginLeft: "0.5rem",
                    color: "white",
                    fontFamily: "monospace",
                }}
            >
                Wins: {wins}
            </Typography>

            {/* Red Color Circle */}
            <Box
                sx={{
                    width: "0.75rem",
                    height: "0.75rem",
                    backgroundColor: "red",
                    borderRadius: "50%",
                }}
            />

            {/* Loss Count Text */}
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    marginLeft: "0.5rem",
                    color: "white",
                    fontFamily: "monospace",
                }}
            >
                Losses: {losses}
            </Typography>
        </Box>
    </Box>
  );
};

export default EarningsPieChart;
