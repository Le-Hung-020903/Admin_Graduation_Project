import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import App from "./App.tsx"
import theme from "./theme.tsx"
import { store } from "../src/redux/store.ts"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <ToastContainer />
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
)
