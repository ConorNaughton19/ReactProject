import { Box, Typography, useTheme } from "@mui/material";
import { token } from "../../theme";
import { useEffect, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import ReportIcon from "@mui/icons-material/Report";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { db } from "../../config/fire";
import useAuth from "../../useAuth";

const Dashboard = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [userEmail, setUserEmail] = useState(null);
  const [numEntries, setNumEntries] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef.on("value", (snapshot) => {
        const lineData = snapshot.val();
        if (lineData) {
          setNumEntries(Object.values(lineData).length);
        }
      });

      return () => dbRef.off();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <div id="welcome">Welcome{userEmail ? `, ${userEmail}!` : "!"}</div>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.blueAccent[300]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Readings Logged"
            subtitle={numEntries}
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[100], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.blueAccent[300]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="2"
            subtitle="Low Readings"
            icon={
              <ReportIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.blueAccent[300]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1"
            subtitle="Readings taken today"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.blueAccent[300]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="7.4mmol"
            subtitle="Estimated Hb1Ac"
            icon={
              <HealthAndSafetyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.blueAccent[300]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                DAILY GRAPH
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[900]}
              ></Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={false} hideSelect={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.blueAccent[300]}
          overflow="auto"
        >
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={colors.blueAccent[300]}
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Pie GRAPH
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[900]}
                ></Typography>
              </Box>
            </Box>
            <Box height="250px" m="-20px 0 0 0">
              <PieChart isDashboard={false} hideSelect={true} />
            </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.blueAccent[300]}
            overflow="auto"
          ></Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.blueAccent[300]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Time In Target
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />

            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.blueAccent[300]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            WEEK
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.blueAccent[300]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            REMINDER TO CHECK BLOODS:
          </Typography>
          <Box height="200px"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
