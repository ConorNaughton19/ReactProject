import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import { useTheme } from "@mui/material/styles";
import { token } from "../theme";
import { db } from "../config/fire";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../useAuth.js";
import { Select, MenuItem } from "@mui/material";

const LineChart = ({ isDashboard = false, hideSelect = false }) => {
  const [selectedRange, setSelectedRange] = useState("24h");
  const theme = useTheme();
  const colors = token(theme.palette.mode);
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

  const handleAddData = () => {
    const glucoseReading = parseFloat(prompt("Enter glucose reading:"));
    if (isNaN(glucoseReading)) {
      alert("Please enter a valid number.");
      return;
    }

    checkGlucoseReading(glucoseReading);
    const timestamp = Date.now();
    db.ref(`users/${currentUser.uid}/mockLineData/0/data/${timestamp}`).set({
      x: timestamp,
      y: glucoseReading,
    });
  };

  const checkGlucoseReading = (glucoseReading) => {
    if (glucoseReading < 3.6) {
      alert("Your glucose reading is low. Please check again soon.");
    } else if (glucoseReading > 15) {
      alert("Your glucose reading is high. Please check again soon.");
    }
  };

  const getTimeWithOffset = (time) => {
    const date = new Date(time);
    const offset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offset);
  };

  const get_data = useCallback(() => {
    if (!data.length) return [];

    const data_points = data[0].data;
    const sorted_data = data_points.sort((a, b) => a.x - b.x);

    const filtered_data = filterData([{ id: "glucose", data: sorted_data }]);

    const formatted_data =
      filtered_data &&
      filtered_data[0].data.map((dp) => ({
        x: getTimeWithOffset(dp.x),
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

  const CustomLayer = ({ yScale, xScale }) => {
    const endX = xScale(getXScaleMinMax().max);
    return (
      <rect
        x={0}
        y={yScale(8)}
        width={endX}
        height={yScale(4.5) - yScale(8)}
        fill="yellow"
        opacity={0.3}
      />
    );
  };

  return (
    <>
      <div>
        {!hideSelect && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontWeight: "normal", marginRight: "0.5rem" }}>
                Average Glucose Level for Past {selectedRange}:
              </span>
              <span>{average} mmol</span>
            </div>
            <Select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              inputProps={{
                name: "range",
                id: "range-select",
              }}
              style={{ marginBottom: "1rem" }}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </>
        )}
      </div>

      <ResponsiveLine
        // Render the chart only if there is data
        data={get_data()}
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
          tooltip: {
            container: {
              color: colors.primary[900],
            },
          },
        }}
        colors={isDashboard ? [colors.primary[500]] : ["black"]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
          type: "time",
          format: "%Q",
          precision: "second",
          useUTC: true,
          ...getXScaleMinMax(),
        }}
        xFormat={(value) => moment(value).format("YYYY-MM-DD HH:mm:ss")}
        enablePointLabel={true}
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
        yFormat=" >-.2f"
        //curve="catmullRom"
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
          ticks: selectedRange === "24h" ? 8 : selectedRange === "7d" ? 7 : 15,
        }}
        curve={selectedRange === "24h" ? "monotoneX" : "linear"}
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
        enableGridX={true}
        enableGridY={true}
        pointSize={11}
        pointColor={"yellow"}
        pointBorderWidth={1}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        layers={[
          "grid",
          "axes",
          "areas",
          "crosshair",
          "lines",
          "points",
          "slices",
          "mesh",
          "legends",
          CustomLayer,
        ]}
      />
      <button onClick={handleAddData}>Add Data</button>
    </>
  );
};

export default LineChart;
