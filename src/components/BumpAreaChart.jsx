import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import moment from "moment";
import { db } from "../config/fire";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../useAuth.js";
import { Select, MenuItem, Typography, Box, Grid } from "@mui/material";

const BumpAreaChart = ({ isDashboard = false, hideSelect = false }) => {
  const [selectedRange, setSelectedRange] = useState("24h");
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef.on("value", (snapshot) => {
        const lineData = snapshot.val();
        if (lineData) {
          setData([{ id: "glucose", data: Object.values(lineData) }]);
        }
      });
      return () => dbRef.off();
    }
  }, [currentUser]);

  const filterData = useCallback(
    (data) => {
      let rangeStart, rangeEnd;
      switch (selectedRange) {
        case "24h":
          rangeStart = moment().startOf("day").valueOf(); // Set to midnight
          rangeEnd = moment().endOf("day").valueOf(); // Set to 23:59
          break;
        case "7d":
          rangeStart = moment().subtract(7, "days").startOf("day").valueOf(); // Set to midnight 7 days ago
          rangeEnd = moment().endOf("day").valueOf(); // Set to 23:59
          break;
        case "30d":
          rangeStart = moment().subtract(30, "days").startOf("day").valueOf(); // Set to midnight 30 days ago
          rangeEnd = moment().endOf("day").valueOf(); // Set to 23:59
          break;
        default:
          rangeStart = moment().startOf("day").valueOf();
          rangeEnd = moment().endOf("day").valueOf();
          break;
      }
      const filteredData = data[0].data.filter(
        (point) => point.x >= rangeStart && point.x <= rangeEnd
      );
      return [{ id: "glucose", data: filteredData }];
    },
    [selectedRange]
  );

  useEffect(() => {
    if (data.length) {
      const filteredData = filterData(data);
      const total = filteredData[0].data.reduce(
        (sum, point) => sum + point.y,
        0
      );
      const count = filteredData[0].data.length;
      setAverage(Number((total / count).toFixed(2)));
    } else {
      setAverage(0);
    }
  }, [data, filterData]);

  const get_data = useCallback(() => {
    if (!data.length) return [];

    const data_points = data[0].data;
    const sorted_data = data_points.sort((a, b) => a.x - b.x);

    const filtered_data = filterData([{ id: "glucose", data: sorted_data }]);

    const formatted_data =
      filtered_data &&
      filtered_data[0].data.map((dp) => ({
        x: dp.x,
        y: dp.y,
      }));

    return [{ id: "glucose", data: formatted_data }];
  }, [data, filterData]);

  useEffect(() => {
    const rangeInMs = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    }[selectedRange];

    if (rangeInMs && currentUser) {
      const dbRef = db.ref(`users/${currentUser.uid}/mockLineData/0/data`);
      dbRef
        .orderByKey()
        .startAt((moment().valueOf() - rangeInMs).toString())
        .endAt(moment().valueOf().toString())
        .on("value", (snapshot) => {
          const lineData = snapshot.val();
          if (lineData) {
            setData([{ id: "glucose", data: Object.values(lineData) }]);
          } else {
            setData([]);
          }
        });
      return () => dbRef.off();
    }
  }, [currentUser, selectedRange]);

  const getXScaleMinMax = () => {
    let min, max;
    switch (selectedRange) {
      case "24h":
        min = moment().subtract(24, "hours").valueOf();
        max = moment().valueOf();
        break;
      case "7d":
        min = moment().subtract(7, "days").valueOf();
        max = moment().valueOf();
        break;
      case "30d":
        min = moment().subtract(30, "days").valueOf();
        max = moment().valueOf();
        break;
      default:
        min = moment().subtract(24, "hours").valueOf();
        max = moment().valueOf();
        break;
    }
    return { min, max };
  };

  return (
    <>
      {!hideSelect && (
        <Box mb={2}>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Typography variant="subtitle1">
                <strong>Average Glucose Level for Past {selectedRange}:</strong>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h3" color="textSecondary">
                {average} mmol
              </Typography>
            </Grid>
          </Grid>
          <Box mb={2}>
            <Select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              inputProps={{
                name: "range",
                id: "range-select",
              }}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </Box>
        </Box>
      )}

      <ResponsiveScatterPlot
        key={selectedRange}
        data={get_data()}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{
          type: "linear",
          format: "%Q",
          precision: "second",
          useUTC: true,
          min: getXScaleMinMax().min, // change min value
          max: getXScaleMinMax().max,
        }}
        xFormat={(value) => moment(value).format("YYYY-MM-DD HH:mm:ss")}
        yScale={{
          type: "linear",
          min: "0",
          max: Math.max(
            10,
            Math.ceil(
              Math.max(...(get_data()?.[0]?.data || []).map((d) => d.y))
            )
          ),
          stacked: true,
          reverse: false,
        }}
        yFormat=">-.2f"
        blendMode="multiply"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Time",
          legendOffset: 36,
          legendPosition: "start",
          format: (value) => {
            switch (selectedRange) {
              case "24h":
                return moment(value).format("HH:mm");
              case "7d":
                return moment(value).format("MMM DD");
              case "30d":
                return moment(value).format("MMM DD");
              default:
                return moment(value).format("HH:mm");
            }
          },
          ticks: selectedRange === "24h" ? 12 : selectedRange === "7d" ? 7 : 15,
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Glucose Reading in mmols",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: "left-to-right",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default BumpAreaChart;
