import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

const Line = () => {
  return (
    <Box m="20px" color="white">
      <Header title="LineChart" />
      <Box height="65vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
