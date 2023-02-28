import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import LoginPage from "./LoginPage";
//import Auth from "./Auth";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Bump from "./scenes/bump";
import FAQ from "./scenes/faq";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode } from "./theme";

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        {isSidebar && <Sidebar isSidebar={isSidebar} />}
        <main className="content">
          <Routes>
            <Route path="/" element={<LoginPage isAuthPage={true} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/bump" element={<Bump />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
