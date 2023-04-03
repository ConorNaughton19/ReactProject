import { useTheme, Typography, Box, Grid } from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { db } from "../config/fire";
import { ResponsiveBar } from "@nivo/bar";
import { token } from "../theme";
import useAuth from "../useAuth.js";
import * as d3 from "d3";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return d3.timeFormat("%a")(date);
};

const getCurrentWeekRange = () => {
  const today = new Date();
  const startOfWeek = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - today.getUTCDay() + 1
    )
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);

  return { startOfWeek, endOfWeek };
};

const formatDateRange = (start, end) => {
  const format = d3.timeFormat("%B %d");
  return `${format(start)} - ${format(end)}`;
};

const WeeklyChart = ({ isDashboard = false, hideSelect = false }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [data, setData] = useState([]);
  const { currentUser } = useAuth();
  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  const dateRange = formatDateRange(startOfWeek, endOfWeek);

  useEffect(() => {
    if (currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef.on("value", (snapshot) => {
        const rawData = snapshot.val();
        const processedData = processData(rawData);
        setData(processedData);
      });

      return () => dbRef.off();
    }
  }, [currentUser]);

  const processData = (rawData) => {
    const dataByDay = {};
    const { startOfWeek, endOfWeek } = getCurrentWeekRange();

    for (const key in rawData) {
      const entry = rawData[key];
      const entryDate = new Date(entry.x);
      // Filter data by date range
      if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
        const day = formatDate(entry.x);

        if (!dataByDay[day]) {
          dataByDay[day] = {
            DAY: day,
            LOW: 0,
            HEALTHY: 0,
            HIGH: 0,
            totalCount: 0,
          };
        }

        if (entry.y < 3.5) {
          dataByDay[day].LOW++;
        } else if (entry.y >= 3.6 && entry.y <= 8.3) {
          dataByDay[day].HEALTHY++;
        } else {
          dataByDay[day].HIGH++;
        }
        dataByDay[day].totalCount++;
      }
    }

    // Calculate percentages
    for (const day in dataByDay) {
      dataByDay[day].LOW =
        (dataByDay[day].LOW / dataByDay[day].totalCount) * 100;
      dataByDay[day].HEALTHY =
        (dataByDay[day].HEALTHY / dataByDay[day].totalCount) * 100;
      dataByDay[day].HIGH =
        (dataByDay[day].HIGH / dataByDay[day].totalCount) * 100;
    }
    return Object.values(dataByDay);
  };

  const getMinMaxDays = (processedData) => {
    let maxHighDay = "";
    let maxHighValue = 0;
    let maxLowDay = "";
    let maxLowValue = 0;

    processedData.forEach((item) => {
      if (item.HIGH > maxHighValue) {
        maxHighValue = item.HIGH;
        maxHighDay = item.DAY;
      }
      if (item.LOW > maxLowValue) {
        maxLowValue = item.LOW;
        maxLowDay = item.DAY;
      }
    });

    return {
      maxHighDay,
      maxLowDay,
    };
  };

  const { maxHighDay, maxLowDay } = getMinMaxDays(data);

  return (
    <>
      <div>
        {!hideSelect && (
          <Box mb={3}>
            <Box mt={5}>
              <Typography variant="h5">
                <strong>Date range:</strong>
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {dateRange}
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h6">
                    <strong>Day with most High readings:</strong>
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {maxHighDay}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    <strong>Day with most Low readings:</strong>
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {maxLowDay}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </div>

      <ResponsiveBar
        data={data}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[900],
              },
            },
            legend: {
              text: {
                fill: colors.grey[900],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[900],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[900],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[900],
            },
          },
        }}
        keys={["LOW", "HEALTHY", "HIGH"]}
        indexBy="DAY"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={(bar) => {
          if (bar.id === "LOW") {
            return "rgba(0, 175, 255)";
          } else if (bar.id === "HEALTHY") {
            return "rgba(0, 128, 0)";
          } else {
            return "rgba(255, 0, 0 )";
          }
        }}
        defs={[
          {
            id: "colorLow",
            type: "patternDots",
            background: "rgba(0, 175, 255, 0.5)",
            color: "rgba(0, 175, 255, 0.5)",
            size: 1,
            padding: 0,
            stagger: true,
          },
          {
            id: "colorHealthy",
            type: "patternDots",
            background: "rgba(0, 128, 0, 0.5)",
            color: "rgba(0, 128, 0, 0.5)",
            size: 1,
            padding: 0,
            stagger: true,
          },
          {
            id: "colorHigh",
            type: "patternDots",
            background: "rgba(255, 0, 0, 0.5)",
            color: "rgba(255, 0, 0, 0.5)",
            size: 1,
            padding: 0,
            stagger: true,
          },
        ]}
        fill={[
          { match: { id: "LOW" }, id: "colorLow" },
          { match: { id: "HEALTHY" }, id: "colorHealthy" },
          { match: { id: "HIGH" }, id: "colorHigh" },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", "0.2"]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "DAY OF THE WEEK",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "PERCENTAGE",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        maxValue={100}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
            items: [
              {
                id: "LOW",
                label: "Low",
                fill: "rgba(0, 175, 255, 0.5)",
              },
              {
                id: "HEALTHY",
                label: "Healthy",
                fill: "rgba(0, 128, 0, 0.5)",
              },
              {
                id: "HIGH",
                label: "High",
                fill: "rgba(255, 0, 0, 0.5)",
              },
            ],
          },
        ]}
        role="application"
        barAriaLabel={function (e) {
          return e.id + ": " + e.formattedValue + "  " + e.indexValue;
        }}
      />
    </>
  );
};

export default WeeklyChart;
