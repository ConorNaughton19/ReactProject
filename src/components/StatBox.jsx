import { Box, Typography, useTheme } from "@mui/material";
import { token } from "../theme";

const StatBox = ({ title, subtitle, icon, increase, children, onClick }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);

  return (
    <Box onClick={onClick} style={{ cursor: "pointer" }}>
      <Box width="100%" m="0 30px">
        <Box display="flex" justifyContent="space-between">
          <Box>
            {icon}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: colors.grey[100] }}
            >
              {title}
            </Typography>
          </Box>
          <Box>
            {children} {/* Render the children elements */}
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" mt="2px">
          <Typography variant="h5" sx={{ color: colors.primary[700] }}>
            {subtitle}
          </Typography>
          <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ color: colors.greenAccent[600] }}
          >
            {increase}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
