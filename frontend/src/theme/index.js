import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#df1736",
    },

    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

export default theme;
