import { Box, Typography } from "@mui/material";
import moment from "moment";
import { db } from "../config/fire";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../useAuth.js";

const ProgressCircle = () => {
  const { currentUser } = useAuth();
  const [average, setAverage] = useState(0);

  const filterData = useCallback((data) => {
    const rangeStart = moment().startOf("day").valueOf(); // Set to midnight
    const rangeEnd = moment().endOf("day").valueOf(); // Set to 23:59
    const filteredData = data[0].data.filter(
      (point) => point.x >= rangeStart && point.x <= rangeEnd
    );
    return [{ id: "glucose", data: filteredData }];
  }, []);

  useEffect(() => {
    if (currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef.on("value", (snapshot) => {
        const lineData = snapshot.val();
        if (lineData) {
          const filteredData = filterData([
            { id: "glucose", data: Object.values(lineData) },
          ]);
          const total = filteredData[0].data.reduce(
            (sum, point) => sum + point.y,
            0
          );
          const count = filteredData[0].data.length;
          setAverage(Number((total / count).toFixed(2)));
        }
      });
      return () => dbRef.off();
    }
  }, [currentUser, filterData]);

  return (
    <Box>
      <Typography variant="h3" color="textSecondary">
        {average} mmol
      </Typography>
      <Typography variant="subtitle2" color="textSecondary"></Typography>
    </Box>
  );
};

export default ProgressCircle;
