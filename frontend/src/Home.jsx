import { Box } from "@mui/material";
import Header from "./Header";
import Funds from "./Funds";
import { useState } from "react";
import Dashboard from "./Dashboard";
import Promos from "./Promos";
import LineupsPage from "./LineupsPage";

function Home() {
  
  // State to Track Which Main Component is Shown (Dashboard, Lineups, Promos, Social, Funds)
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Function to Update the Active Component
  const handleNavigation = (componentName) => {
    setActiveComponent(componentName.toLowerCase());
  };


  // Gets the Current User from Local Storage for Lineups Page
  const currentUser = JSON.parse(localStorage.getItem("currUser"));


  // Renders the Active Component Based on the State
  const renderComponent = () => {
    switch (activeComponent) {
      case "lineups":
        return <LineupsPage user={currentUser}/>;
      case "promos":
        return <Promos />;
      //   case "social":
      //     return <Social />;
      case "funds":
        return <Funds />;
      default:
        return <Dashboard />;
    }
  };

  return (

    // Main Container for the Home Component with Background Image and Fullscreen Layout
    <Box
      className="w-screen h-screen flex flex-col items-center bg-cover bg-no-repeat"
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
      }}
    >
      {/* Passes the Navigation Handler to Header */}
      <Header onNavigate={handleNavigation} />

      {/* Main Content Container, Shows Selected Page */}
      <div className="flex-1 flex items-start justify-center p-8 overflow-x-hidden overflow-auto w-full h-full">
        {renderComponent()}
      </div>
    </Box>
  );
}

export default Home;
