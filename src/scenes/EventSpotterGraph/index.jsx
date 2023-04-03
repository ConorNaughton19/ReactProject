import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import HighLowSpotter from "../../components/HighLowSpotter";

const Bump = () => {
  return (
    <Box m="20px" color="BLACK" position="relative">
      <Header title="Glucose Levels Over Time" color="black" />
      <Box height="65vh" position="relative">
        <HighLowSpotter />
        <Box
          position="absolute"
          top={0}
          right={0}
          bgcolor="linear-gradient(to top right, #FFFFFF, #ECEFF1)"
          p={2}
          boxShadow="0px 9px 9px rgba(0, 0, 0, 0.35)"
          borderRadius="0 0 0 16px"
          maxWidth="450px"
        >
          <Typography variant="subtitle2" align="right">
            This is a scatterplot chart that displays glucose readings over a
            selected time range. The x-axis represents time and the y-axis
            represents the glucose reading in mmol. The chart also includes a
            selectable time range and an average glucose level for the selected
            range
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Bump;
