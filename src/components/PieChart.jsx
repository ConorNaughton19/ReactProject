import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material/styles";
import { token } from "../theme";
import { db } from "../config/fire";
import { useState, useEffect } from "react";
import useAuth from "../useAuth.js";
import { Select, MenuItem } from "@mui/material";

const PieChart = ({ isDashboard = false, hideSelect = false }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const { currentUser } = useAuth();

  const [selectedRange, setSelectedRange] = useState("24h");
  const [data, setData] = useState([]);

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
        .startAt((Date.now() - rangeInMs).toString())
        .endAt(Date.now().toString())
        .on("value", (snapshot) => {
          const lineData = snapshot.val();
          if (lineData) {
            setData(
              Object.values(lineData).map((d) => ({ id: d.x, value: d.y }))
            );
          } else {
            setData([]);
          }
        });
      return () => dbRef.off();
    }
  }, [currentUser, selectedRange]);


  const totalValue = data.reduce((acc, d) => acc + d.value, 0);

  const categorizedData = data.reduce(
    (acc, d) => {
      if (d.value < 3.6) {
        acc[0].value += 1;
      } else if (d.value < 8.5) {
        acc[1].value += 1;
      } else {
        acc[2].value += 1;
      }
      return acc;
    },
    [
      { id: "Low", value: 0 },
      { id: "Healthy", value: 0 },
      { id: "High", value: 0 },
    ]
  );


  return (
    <>
<div>
{!hideSelect && (
          <>
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
      <ResponsivePie
        data={categorizedData.filter((d) => d.value > 0)}
        theme={{
          textColor: colors.grey[900],
          tooltip: {
            container: {
              background: colors.grey[100],
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: "category10" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor={colors.grey[900]}
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: "color" }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor={colors.grey[900]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default PieChart;
