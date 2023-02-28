import { Box } from "@mui/material";
import Header from "../../components/Header";
import BumpAreaChart from "../../components/BumpAreaChart";

const Bump = () => {
  return (
    <Box m="20px">
      <Header title="Bump Area CHart" subtitle="Simple Bump Area Chart" />
      <Box height="75vh">
        <BumpAreaChart />
      </Box>
    </Box>
  );
};

export default Bump;
