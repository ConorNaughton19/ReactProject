import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import { useTheme } from "@mui/material/styles";
import { token } from "../theme";
import { db } from "../config/fire";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../useAuth.js";
import { Select, MenuItem, Box } from "@mui/material";
import regression from "regression";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Grid, Paper, Typography } from "@mui/material";

const Graph = ({ isDashboard = false, hideSelect = false }) => {
  const [selectedRange, setSelectedRange] = useState("24h");
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [data, setData] = useState([]);
  const { currentUser } = useAuth();
  const [showRegressionLine, setShowRegressionLine] = useState(false);
  const [showErrorCircles, setShowErrorCircles] = useState(false);
  const [lineOfBestFitData, setLineOfBestFitData] = useState([]);

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

  // New function to compute the line of best fit
  const computeLineOfBestFit = useCallback((data) => {
    const result = regression.linear(data.map(({ x, y }) => [x, y]));
    return result.points.map(([x, y], i) => ({ x: data[i].x, y })); // Use original x values from the data
  }, []);
  
  

  useEffect(() => {
    if (data.length) {
      const filteredData = filterData(data);
      setLineOfBestFitData(computeLineOfBestFit(filteredData[0].data));
    } else {
      setLineOfBestFitData([]);
    }
  }, [data, filterData, computeLineOfBestFit]);

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
    const latestReadingTime = get_data()[0]?.data.slice(-1)[0]?.x;
  
    switch (selectedRange) {
      case "24h":
        min = moment().subtract(24, "hours").valueOf();
        max = latestReadingTime || moment().valueOf();
        break;
      case "7d":
        min = moment().subtract(7, "days").valueOf();
        max = latestReadingTime || moment().valueOf();
        break;
      case "30d":
        min = moment().subtract(30, "days").valueOf();
        max = latestReadingTime || moment().valueOf();
        break;
      default:
        min = moment().subtract(24, "hours").valueOf();
        max = latestReadingTime || moment().valueOf();
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

  // New custom layer to draw the line of best fit
  const RegressionLineLayer = ({ xScale, yScale }) => {
    if (!showRegressionLine || !lineOfBestFitData.length) {
      return null;
    }

    return (
      <g>
        {lineOfBestFitData.slice(1).map((point, index) => {
          const previousPoint = lineOfBestFitData[index];
          return (
            <line
              key={index}
              x1={xScale(previousPoint.x)}
              y1={yScale(previousPoint.y)}
              x2={xScale(point.x)}
              y2={yScale(point.y)}
              stroke="blue"
              strokeWidth="2"
            />
          );
        })}
      </g>
    );
  };

  const ErrorCirclesLayer = ({ xScale, yScale }) => {
    if (
      !showErrorCircles ||
      !lineOfBestFitData.length ||
      lineOfBestFitData.length !== data[0].data.length
    ) {
      return null;
    }
  
    const getErrorCategory = (error) => {
      if (error < 1) {
        return "normal";
      } else if (error >= 1 && error < 2) {
        return "moderate";
      } else {
        return "significant";
      }
    };
  
    const getCircleColor = (category) => {
      switch (category) {
        case "normal":
          return "green";
        case "moderate":
          return "blue";
        case "significant":
          return "red";
        default:
          return "green";
      }
    };
  
    return (
      <g>
        {data[0].data.map((point, index) => {
          const predictedPoint = lineOfBestFitData[index];
          const error = Math.abs(point.y - predictedPoint.y);
          const errorCategory = getErrorCategory(error);
          const circleColor = getCircleColor(errorCategory);
  
          return (
            <circle
              key={index}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={error * 5} // You can adjust the multiplier to control the size of the circles
              fill={circleColor}
              opacity="0.5"
            />
          );
        })}
      </g>
    );
  };


  const countErrorCircles = () => {
    if (!lineOfBestFitData.length || lineOfBestFitData.length !== data[0].data.length) {
      return { significant: 0, moderate: 0, normal: 0 };
    }
  
    const errors = data[0].data.map((point, index) => {
      const predictedPoint = lineOfBestFitData[index];
      return Math.abs(point.y - predictedPoint.y);
    });
  
    const errorCategories = errors.map((error) => {
      if (error < 1.5) {
        return "normal";
      } else if (error >= 1.5 && error < 2) {
        return "moderate";
      } else {
        return "significant";
      }
    });
  
    const counts = errorCategories.reduce(
      (acc, category) => {
        acc[category]++;
        return acc;
      },
      { significant: 0, moderate: 0, normal: 0 }
    );
  
    return counts;
  };
  
  const errorCircleCounts = countErrorCircles();


  return (
    <>

<Paper elevation={2} style={{ padding: '16px', marginBottom: '16px', display: 'inline-flex' }}>
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant="h6" component="span">
            Significant Events: 
          </Typography>
          <Typography variant="body1" component="span">
            {errorCircleCounts.significant}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" component="span">
            Moderate Events: 
          </Typography>
          <Typography variant="body1" component="span">
            {errorCircleCounts.moderate}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" component="span">
            Normal: 
          </Typography>
          <Typography variant="body1" component="span">
            {errorCircleCounts.normal}
          </Typography>
        </Grid>
      </Grid>
    </Paper>

      <Box mb={2}>
        <ToggleButtonGroup
          value={[
            showRegressionLine ? "showRegressionLine" : null,
            showErrorCircles ? "showErrorCircles" : null,
          ]}
          exclusive={false}
          onChange={(e, newVal) => {
            setShowRegressionLine(newVal.includes("showRegressionLine"));
            setShowErrorCircles(newVal.includes("showErrorCircles"));
          }}
      >
          <ToggleButton value="showRegressionLine">
            Show Regression Line
          </ToggleButton>
          <ToggleButton value="showErrorCircles">
            Show Error Circles
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {!hideSelect && (
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
      )}

      <ResponsiveLine
        key={selectedRange} // Add this line
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
        enablePointLabel={false}
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
          ticks: selectedRange === "24h" ? 12 : selectedRange === "7d" ? 7 : 15,
        }}
        curve={selectedRange === "24h" ? "monotoneX" : "monotoneX"}
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
        enableSlices="x"
        pointSize={6}
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
          ErrorCirclesLayer,
          RegressionLineLayer, // Add the new custom layer
          (props) => (
            <RegressionLineLayer
              {...props}
              xScale={props.xScale}
              yScale={props.yScale}
            />
          ),
        ]}
      />
      <button onClick={handleAddData}>Add Data</button>
    </>
  );
};

export default Graph;