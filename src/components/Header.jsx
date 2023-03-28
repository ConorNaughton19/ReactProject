import { Typography, Box, useTheme } from "@mui/material";
import { token } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  return (
    <Box mb={3}>
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ mb: -5, mt: 0 }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[100]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
