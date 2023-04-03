import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import IrregularityDetection from "../../components/IrregularityDetection";

const Graph = () => {
  return (
    <Box m="20px" color="BLACK" position="relative">
      <Header title="Irregularity Detector Graph" color="black" />
      <Box height="65vh" position="relative">
        <IrregularityDetection />
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
            The graph shows the daily glucose readings over a chosen time
            period. The highlighted areas indicate significant deviations from
            expected glucose levels. These deviations could be either higher or
            lower than the expected range and may be an indicator of a health
            issue that needs to be addressed.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default Graph;
