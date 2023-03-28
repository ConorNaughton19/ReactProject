import { useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const token = () => ({
        grey: {
          100: "#e0e0e0",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          500: "#141b2d",//needed
          900: "#040509",//needed
        },
        secondary: {
          400: "#ebebfb",
          600: "#b8b8c8",
        },
        greenAccent: {
          100: "#dbf5ee",
          500: "#4cceac",
          600: "#3da58a",
          900: "#0f2922",
        },

      }
);

// mui theme settings
export const themeSettings = colourtheme => {
  const colors = token(colourtheme);
  return {
    palette: {
            // palette values for colourtheme mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[900],
            },
            neutral: {
              colourtheme: colors.grey[900],
              main: colors.grey[800],
              light: colors.grey[100],
            },
            background: {
              default: colors.secondary[600],
            },
    },

    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontSize: 45,
      },
      h2: {
        fontSize: 32,
      },
      h3: {
        fontSize: 24,
      },
      h4: {
        fontSize: 20,
      },
      h5: {
        fontSize: 16,
      },
      h6: {
        fontSize: 14,
      },
    },
  };
};

export const useMode = () => {
  const [mode] = useState("colourtheme");

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme];
};

