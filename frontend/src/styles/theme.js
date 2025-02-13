import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    blue: {
      500: "#007BFF",
    },
  },
  fonts: {
    body: "Nunito, sans-serif",
    heading: "Nunito, sans-serif",
  },
  breakpoints: {
    sm: "320px", // Adjust this value to your desired breakpoint
    md: "1280px", // Set a smaller value here for the new breakpoint
    lg: "1519px",
    xl: "1520px",
  },
  components: {},
});

export default theme;
