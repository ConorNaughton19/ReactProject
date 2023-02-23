import { ResponsiveAreaBump } from "@nivo/bump";
import { token } from "../theme";
import { useTheme } from "@mui/material";
import { mockAreaBumpData as data } from "../data/mockData";


const BumpAreaChart = () => {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    return (
    <ResponsiveAreaBump
        data={data}
        margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
        spacing={8}
        colors={{ scheme: 'category10' }}
        blendMode="multiply"
        fillOpacity={1}
        inactiveFillOpacity={1}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: colors.grey[100],
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: colors.grey[100],
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'CoffeeScript'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'TypeScript'
                },
                id: 'lines'
            }
        ]}
        borderWidth={0}
        activeBorderWidth={0}
        inactiveBorderWidth={20}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    '2.8'
                ]
            ]
        }}
        startLabel="id"
        startLabelPadding={17}
        endLabel="id"
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -36
        }}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        animate={false}
    />
    );
};
export default BumpAreaChart;