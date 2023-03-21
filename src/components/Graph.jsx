import { ResponsiveLine } from '@nivo/line';
import { db } from "../config/fire";
import { useState, useEffect } from "react";

const Graph = () => {
  const [data, setData] = useState([]);
  const [m, setM] = useState(0);
  const [b, setB] = useState(0);

  useEffect(() => {
    const dbRef = db.ref(`mockLineData/0/data`);
    dbRef.on("value", (snapshot) => {
      const rawData = snapshot.val();
      if (rawData) {
        setData(
          Object.values(rawData).map((d) => ({
            x: Date.parse(d.x) - Date.parse("2022-03-01T00:00:00.000Z"),
            y: d.y,
          }))
        );
      }
    });

    return () => dbRef.off();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const xValues = data.map((d) => d.x);
      const yValues = data.map((d) => d.y);

      const xAvg = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
      const yAvg = yValues.reduce((sum, y) => sum + y, 0) / yValues.length;

      let numerator = 0;
      let denominator = 0;

      for (let i = 0; i < data.length; i++) {
        numerator += (yValues[i] - yAvg) * (xValues[i] - xAvg);
        denominator += (xValues[i] - xAvg) ** 2;
      }

      const slope = numerator / denominator;
      const intercept = yAvg - slope * xAvg;

      setM(slope);
      setB(intercept);
    }
  }, [data]);

  const chartData = [
    {
      id: "glucose",
      data: data.map((d) => ({ x: d.x, y: d.y })),
    },
  ];

  const lineData = data.length > 0
  ? [
      {
        id: "linear",
        data: [
          { x: data[0].x, y: m * data[0].x + b },
          { x: data[data.length - 1].x, y: m * data[data.length - 1].x + b },
        ],
      },
    ]
  : [];

  const equation = `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`;
  
  return (
    <div>
      <h2>Linear Regression Results:</h2>
      <p>Slope (m): {m}</p>
      <p>Intercept (b): {b}</p>
      <div style={{ height: 400 }}>
      <ResponsiveLine
    data={chartData}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Time",
      legendOffset: 36,
      legendPosition: "middle"
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Glucose Level",
      legendOffset: -40,
      legendPosition: "middle"
    }}
    colors={{ scheme: "set1" }}
    pointSize={8}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabel="y"
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[      {        anchor: "bottom-right",        direction: "column",        justify: false,        translateX: 100,        translateY: 0,        itemsSpacing: 0,        itemDirection: "left-to-right",        itemWidth: 80,        itemHeight: 20,        itemOpacity: 0.75,        symbolSize: 12,        symbolShape: "circle",        symbolBorderColor: "rgba(0, 0, 0, .5)",        onClick: (data) => console.log("legend clicked", data),        effects: [          {            on: "hover",            style: {              itemBackground: "rgba(0, 0, 0, .03)",              itemOpacity: 1            }          }        ]
      }
    ]}
    layers={[      "grid",      "markers",      "axes",      "areas",      "crosshair",      "lines",      "points",      "slices",      "mesh",      ({ xScale, yScale, data }) => (        <g>          <line            x1={xScale(data[0].data.x)}
            y1={yScale(m * data[0].data.x + b)}
            x2={xScale(data[data.length - 1].data.x)}
            y2={yScale(m * data[data.length - 1].data.x + b)}
            stroke="#ff0000"
            strokeDasharray="4"
          />
        </g>
      )
    ]}
              />
              </div>
              </div>
              );



              };
              
              export default Graph;
