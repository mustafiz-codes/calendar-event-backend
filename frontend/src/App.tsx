import "./App.css";
import { useTheme } from "./context/ThemeContext";
import TopNav from "./components/topNav/TopNav";
import SideNav from "./components/sideNav/SideNav";
import MainContent from "./components/mainContent/MainContent";

function App() {
  const { theme } = useTheme();

  return (
    <div
      data-theme={theme}
      className="flex flex-col h-screen"
      data-testid="app-container"
    >
      <TopNav />
      <div className="flex flex-auto mt-4 ">
        <SideNav />
        <MainContent />
      </div>
    </div>
  );
}

export default App;
