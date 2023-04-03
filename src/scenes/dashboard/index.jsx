import { Box, Typography, TextField, useTheme } from "@mui/material";
import { token } from "../../theme";
import { useEffect, useState, useCallback } from "react";
import EmailIcon from "@mui/icons-material/Email";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Header from "../../components/Header";
import DailyChart from "../../components/DailyChart";
import PieChart from "../../components/TimeInTarget";
import WeeklyChart from "../../components/WeeklyChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/AverageGlucose";
import { db } from "../../config/fire";
import useAuth from "../../useAuth";
import moment from "moment";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const Dashboard = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [userEmail, setUserEmail] = useState(null);
  const { currentUser } = useAuth();
  const [lineData, setLineData] = useState(null);
  const [estimatedHb1Ac, setEstimatedHb1Ac] = useState(null);
  const [readingsToday, setReadingsToday] = useState(0);
  const [bloodSugar, setBloodSugar] = useState("");
  const [carbsIntake, setCarbsIntake] = useState("");
  const [insulinCarbRatio, setInsulinCarbRatio] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const calculateInsulinDose = () => {
    const targetBloodSugar = 6; // Target blood sugar level in mmol/L
    const sensitivityFactor = 3; // Sensitivity factor (1 unit of insulin changes blood sugar by 3 mmol/L)

    const carbDose = carbsIntake / insulinCarbRatio;
    const correctionDose = (bloodSugar - targetBloodSugar) / sensitivityFactor;

    let dose;

    if (bloodSugar < targetBloodSugar) {
      const reductionFactor = 1; 
      dose = carbDose + correctionDose / reductionFactor; // Reduce insulin dose for low blood sugar
    } else {
      dose = carbDose + Math.max(0, correctionDose); // Ensure the correction dose is not negative
    }

    return dose.toFixed(1);
  };

  useEffect(() => {
    if (currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef.on("value", (snapshot) => {
        const lineData = snapshot.val();
        if (lineData) {
          setLineData([{ id: "glucose", data: Object.values(lineData) }]);
        }
      });
      return () => dbRef.off();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const today = moment().startOf("day").valueOf();
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef
        .orderByChild("x")
        .startAt(today)
        .on("value", (snapshot) => {
          const readingsToday = snapshot.numChildren();
          setReadingsToday(readingsToday);
        });
      return () => dbRef.off();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  const filterData = useCallback((data, days) => {
    let rangeStart, rangeEnd;

    rangeStart = moment().subtract(days, "days").valueOf();
    rangeEnd = moment().endOf("day").valueOf();

    const filteredData = data[0].data.filter(
      (point) => point.x >= rangeStart && point.x <= rangeEnd
    );
    return [{ id: "glucose", data: filteredData }];
  }, []);

  const calculateEstimatedHb1Ac = useCallback((data) => {
    const sum = data[0].data.reduce((acc, point) => acc + point.y, 0);
    const count = data[0].data.length;

    if (count === 0) {
      return null;
    }

    const averageGlucoseMmol = sum / count;
    const averageGlucoseMgdl = averageGlucoseMmol * 18; // Convert mmol/L to mg/dL
    const estimatedHb1Ac = (averageGlucoseMgdl + 46.7) / 28.7;

    return estimatedHb1Ac.toFixed(1);
  }, []);

  useEffect(() => {
    if (lineData && lineData.length) {
      const last90DaysData = filterData(lineData, 90);
      const estimatedHb1AcValue = calculateEstimatedHb1Ac(last90DaysData);
      setEstimatedHb1Ac(estimatedHb1AcValue);
    } else {
      setEstimatedHb1Ac(null);
    }
  }, [lineData, filterData, calculateEstimatedHb1Ac]);

  const showHb1AcMessage = () => {
    if (estimatedHb1Ac === null) {
      setSnackbar({
        open: true,
        message: "Hb1Ac data is not available",
        severity: "info",
      });
    } else {
      const hb1AcValue = parseFloat(estimatedHb1Ac);
      if (hb1AcValue < 4) {
        setSnackbar({
          open: true,
          message: "Your Hb1Ac reading is too low.",
          severity: "warning",
        });
      } else if (hb1AcValue >= 4 && hb1AcValue <= 7) {
        setSnackbar({
          open: true,
          message: "Your Hb1Ac reading is in range.",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Your Hb1Ac reading is too high.",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box m="20px">
      {/* This is the HEADER */}
      <Box display="flex" flexDirection="column" alignItems="left">
        <Header title="DiaHealth" />
        {userEmail ? (
          <Box mt={2} fontWeight="bold">{`Welcome, ${userEmail}!`}</Box>
        ) : (
          <Box mt={2} fontWeight="bold">
            Welcome!
          </Box>
        )}
      </Box>

 
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >

        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Readings Logged"
            subtitle={`${readingsToday} Readings taken today`}
            icon={
              <EmailIcon
                sx={{ color: colors.primary[100], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[200]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={estimatedHb1Ac ? `${estimatedHb1Ac} mmol/mol` : "N/A"}
            subtitle="Estimated Hb1Ac"
            icon={
              <HealthAndSafetyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            onClick={showHb1AcMessage}
          />
        </Box>

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
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
            <DailyChart isDashboard={false} hideSelect={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          overflow="auto"
        >
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={colors.primary[200]}
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
                  Time-In-Target
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
            backgroundColor={colors.primary[200]}
            overflow="auto"
          ></Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Time In Target
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt="px"
            height="80%"
          >
            <ProgressCircle />
            <Typography>AVERAGE GLUCOSE READINGS</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            WEEK
          </Typography>
          <Box height="250px" mt="-20px">
            <WeeklyChart isDashboard={true} hideSelect={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[200]}
          padding="30px"
        >
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[200]}
            padding="10px"
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ marginBottom: "1px" }}
            >
              Insulin Dose Calculator
            </Typography>
            <Box height="200px">
              <TextField
                label="Blood Sugar Level (mmol/dL)"
                type="number"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                sx={{ marginTop: "1px", marginBottom: "4px", width: "100%" }}
              />
              <TextField
                label="Carbohydrate Intake (g)"
                type="number"
                value={carbsIntake}
                onChange={(e) => setCarbsIntake(e.target.value)}
                sx={{ marginTop: "1px", marginBottom: "4px", width: "100%" }}
              />
              <TextField
                label="Insulin-to-Carb Ratio (g/unit)"
                type="number"
                value={insulinCarbRatio}
                onChange={(e) => setInsulinCarbRatio(e.target.value)}
                sx={{ marginTop: "1px", marginBottom: "4px", width: "100%" }}
              />
              <Typography>
                Recommended Insulin Dose:{" "}
                {bloodSugar && carbsIntake && insulinCarbRatio
                  ? `${calculateInsulinDose()} units`
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
