import { Box } from "@mui/material";
import Header from "./Header";

function Home() {
  return (
    <Box
      className="w-screen h-screen flex flex-col bg-cover bg-no-repeat"
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
      }}
    >
      <Header />

      <div className="flex-1 flex items-center justify-center">
        {/* Your main content goes here */}
      </div>
    </Box>
  );
}

export default Home;
