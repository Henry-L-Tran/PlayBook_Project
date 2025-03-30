import { Box } from "@mui/material";
import Header from "./Header";
import Funds from "./Funds";
import Dashboard from "./Dashboard";
import Promos from "./Promos";
import { useState } from "react";

function Home() {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Function to change the active component
  const handleNavigation = (componentName) => {
    setActiveComponent(componentName.toLowerCase());
  };

  // Render the appropriate component based on state
  const renderComponent = () => {
    switch (activeComponent) {
      //   case "lineups":
      //     return <Lineups />;
      //   case "promos":
      //     return <Promos />;
      //   case "social":
      //     return <Social />;
      case "funds":
        return <Funds />;
      case "dashboard":
        return <Dashboard />;
      case "promos":
        return <Promos />;
      //   default:
      //     return <Dashboard />;
    }
  };

  return (
    <Box
      className="w-screen h-screen flex flex-col bg-cover bg-no-repeat"
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
      }}
    >
      {/* Pass the navigation handler to Header */}
      <Header onNavigate={handleNavigation} />

      {/* Dynamic content area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {renderComponent()}
      </div>
    </Box>
  );
}

export default Home;
