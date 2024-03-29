import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import LoginPage from "./LoginPage";
import Bar from "./scenes/WeeklyChart";
import Line from "./scenes/DailyGraph";
import Pie from "./scenes/TimeInTarget";
import Bump from "./scenes/EventSpotterGraph";
import FAQ from "./scenes/InformationPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode } from "./theme";
import { AuthProvider } from "./AuthContext";
import Graph from "./scenes/IrregularityDetection";
import UserData from "./UserData";

function App() {
  const [theme] = useMode();
  const location = useLocation();
  const [isSidebar, setIsSidebar] = useState(false);

  // Check if the current location is the Auth page when the component mounts
  useEffect(() => {
    if (location.pathname === "/") {
      setIsSidebar(false);
    } else {
      setIsSidebar(true);
    }
  }, [location.pathname]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isSidebar && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            <Routes>
              <Route path="/" element={<LoginPage isAuthPage={true} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/bump" element={<Bump />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="/userdata" element={<UserData />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
