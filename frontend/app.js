import React from "react";
import Frontend from "./Frontend"
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";



const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Frontend />
    </ThemeProvider>
  );
}
console.log("App component is rendering...");

export default App;
