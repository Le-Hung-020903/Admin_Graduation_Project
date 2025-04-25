import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import App from "./App.tsx"
import theme from "./theme.tsx"
import { ToastContainer } from "react-toastify"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <ToastContainer />
    <CssBaseline />
    <App />
  </ThemeProvider>
)
