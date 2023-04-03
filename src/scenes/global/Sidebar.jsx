import React, { useState, useContext } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { token } from "../../theme";
import fire from "../../config/fire";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined";
import GrainIcon from "@mui/icons-material/Grain";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[900],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { setUser, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    fire
      .auth()
      .signOut()
      .then(() => {
        setUser(null); // clear user from the AuthContext
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        height: "121vh",
        "& .pro-sidebar-inner": {
          background: `${colors.secondary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[900]}>
                  DiaHealth
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<DashboardIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Glucose Readings"
              icon={<AccountCircleIcon />}
              to="/userdata"
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<LiveHelpIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Weekly Chart"
              to="/bar"
              icon={<StackedBarChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Time In Range"
              to="/pie"
              icon={<PieChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Daily Chart"
              to="/line"
              icon={<ShowChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Glucose Spike Graph"
              to="/bump"
              icon={<GrainIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Irregularity Detector"
              to="/graph"
              icon={<ScatterPlotOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* SIGN OUT ICON */}
            <MenuItem onClick={handleSignOut} icon={<LogoutOutlinedIcon />}>
              <Typography>Sign Out</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
