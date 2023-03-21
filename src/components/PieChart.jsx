import { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { token } from "../theme";
import { useTheme } from "@mui/material";
import { db } from "../config/fire";

const PieChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Reference the "mockPieData" node in your database
    const dbRef = db.ref("mockPieData");
    // Fetch the data from your database and update the state
    dbRef.on("value", (snapshot) => {
      const pieData = snapshot.val();
      setData(sortData(pieData));
    });

    // Clean up the event listener when the component unmounts
    return () => dbRef.off();
  }, []);

  // Sorts data into "Low", "In Target", and "High" categories based on the value property
  const sortData = (data) => {
    const low = data.filter((item) => item.value < 3.5);
    const inTarget = data.filter(
      (item) => item.value >= 3.5 && item.value <= 9.0
    );
    const high = data.filter((item) => item.value > 9.0);

    return [
      { id: "Low", value: low.length },
      { id: "In Target", value: inTarget.length },
      { id: "High", value: high.length },
    ];
  };

  return (
    <ResponsivePie
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[900],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.8]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
       

        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
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
  );
};

export default PieChart;
