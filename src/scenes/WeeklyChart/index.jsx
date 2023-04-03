import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import WeeklyChart from "../../components/WeeklyChart";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="Weekly Chart of Time-In-Target" mb={200} />
      <Box height="65vh" position="relative">
        <WeeklyChart />
        <Box
          position="absolute"
          top={0}
          right={0}
          bgcolor="linear-gradient(to top right, #FFFFFF, #ECEFF1)"
          p={2}
          boxShadow="0px 9px 9px rgba(0, 0, 0, 0.35)"
          borderRadius="0 0 0 16px"
          maxWidth="500px"
        >
          <Typography variant="subtitle2" align="right">
            This chart displays the percentage breakdown of glucose readings
            categorized as "low", "healthy", and "high" for each day of the
            week, over the current week. The X-axis represents the day of the
            week, and the Y-axis represents the percentage of glucose readings
            falling within each category.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Bar;
