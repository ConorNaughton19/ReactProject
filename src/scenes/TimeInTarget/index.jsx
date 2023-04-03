import { Box, Typography } from "@mui/material";
import Header from "../../components/Header";
import TimeInTarget from "../../components/TimeInTarget";

const Pie = () => {
  return (
    <>
      <Header title="Time-In-Target" color="black" />
      <Box m="20px" color="BLACK" position="relative">
        <Box height="65vh" position="relative">
          <TimeInTarget />
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
              This pie chart displays the percentage breakdown of glucose
              readings categorized as "low", "healthy", and "high" for a
              selected time range. The three categories are color-coded and
              labeled on the chart, and the percentage values are shown on each
              slice of the chart.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Pie;
