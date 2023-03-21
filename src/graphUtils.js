import React from 'react';
import { ResponsiveLine } from '@nivo/line';

function DrawGraph({data}) {
  const graphData = [
    {
      id: 'data',
      data: data,
    },
  ];

  return (
    <div>
    <ResponsiveLine
      data={graphData}
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
      colors={{ scheme: 'category10' }}
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
    </div>
  );
}

export {DrawGraph};
