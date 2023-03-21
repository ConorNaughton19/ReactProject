import { useState, useEffect } from 'react';
import regression from 'regression';
import { db } from "../config/fire";
import { ResponsiveLine } from '@nivo/line';

const GraphPage = () => {
  const [data, setData] = useState([]);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  useEffect(() => {
    // Retrieve data from Firebase Realtime Database
    const ref = db.ref('mockLineData/0/data');
    ref.once('value')
      .then((snapshot) => {
        const rawData = snapshot.val();

        if (rawData) {
          // Convert data to format usable for linear regression
          const regressionData = Object.values(rawData).map(({ x, y }) => [new Date(x).getTime(), y]);

          // Perform linear regression
          const result = regression.linear(regressionData);

          // Add regression line to data
          const regressionLine = result.points.map((point) => ({ x: point[1], y: point[1] }));
          const newData = Object.values(rawData)
            .map(({ x, y }) => ({ x, y }))
            .concat(regressionLine);

          setData(newData);
        }
      })
      .catch((error) => {
        console.error("Error retrieving data from Firebase Realtime Database:", error);
      });
  }, []);

  // Define get_data function
  const get_data = () => {
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
  };

  // Return graph component
  return (
    <div>
      <div>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(new Date(e.target.value))}
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(new Date(e.target.value))}
        />
      </div>
      {data.length && (
        <ResponsiveLine
          data={get_data()}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'time', precision: 'day' }}
          xFormat="%s"
          yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: '%b %d',
            tickValues: 'every 1 days',
            legend: 'Date',
            legendOffset: -12,
          }}
          axisLeft={{
            legend: 'Value',
            legendOffset: 12,
          }}
          enableGridX={false}
          //colors={{ scheme: 'category10' }}
          lineWidth={3}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enablePointLabel={true}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
      )}
    </div>
  );
};

export default GraphPage;
