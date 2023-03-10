import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import { useTheme } from "@mui/material";
import { token } from "../theme";
import { db } from "../config/fire";
import { useState, useEffect, useCallback } from "react";
import useAuth from "../useAuth.js";


const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const start = moment().startOf('day').valueOf(); // Set to midnight
  const end = moment().endOf('day').valueOf(); // Set to 23:59
  const [data, setData] = useState([]);
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

  const filterData = useCallback((data) => {
    const filteredData = data[0].data.filter((point) => point.x >= start && point.x <= end);
    return [{ id: "glucose", data: filteredData }];
  }, [start, end]);

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
  
  const get_data = useCallback(() => {
    if (!data.length) return [];
  
    const data_points = data[0].data;
    const sorted_data = data_points.sort((a, b) => a.x - b.x);
    const filtered_data = sorted_data.filter(
      (dp) => dp.x >= start && dp.x <= end
    );
    const formatted_data = filtered_data.map((dp) => ({
      x: new Date(dp.x),
      y: dp.y,
    }));
  
    return [{ id: "glucose", data: formatted_data }];
  }, [data, start, end]);

  return (
    <>
      <ResponsiveLine
        // Render the chart only if there is data
        data={data.length ? filterData(data) : get_data()}
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
        colors={isDashboard ? "glucose": "white" }
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
          type: "time",
          format: "%Q",
          precision: "second",
          useUTC: true,
        }}
        xFormat={(value) => moment(value).format("YYYY-MM-DD HH:mm")}
        enablePointLabel={true}
        yScale={{
          type: "linear",
          min: "0",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? true : "Time",
          legendOffset: 36,
          legendPosition: "middle",
          format: "%H:%M" // Set to display hours and minutes
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
      
    />
    <button onClick={handleAddData}>Add Data</button>
  </>
);

};

export default LineChart;