import Home from "./modules/home/home";
import { ThemeProvider } from "./theme/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="planetx-ui-theme">
      <Home />
    </ThemeProvider>
  );
}

export default App;
