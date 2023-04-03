import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import DailyChart from "../../components/DailyChart";

const Line = () => {
  return (
    <Box m="20px" color="BLACK" position="relative">
      <Header title="Daily Graph" color="black" />
      <Box height="65vh" position="relative">
        <DailyChart />
        <Box
          position="absolute"
          top={0}
          right={0}
          bgcolor="linear-gradient(to top right, #FFFFFF, #ECEFF1)"
          p={2}
          boxShadow="0px 9px 9px rgba(0, 0, 0, 0.35)"
          borderRadius="0 0 0 16px"
          maxWidth="400px"
        >
          <Typography variant="subtitle2" align="right">
            This component displays a line chart of glucose readings over time.
            The X-axis represents time, and the Y-axis represents glucose level
            in mmols.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Line;
