// SidebarContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactElement,
  useEffect,
} from "react";

interface SidebarContextProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isSidebarOpen: false,
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactElement | ReactElement[];
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const storedSidebar = localStorage.getItem("sidebar");
    if (storedSidebar) {
      setIsSidebarOpen(JSON.parse(storedSidebar));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-sidebar",
      isSidebarOpen.toString()
    );
    localStorage.setItem("sidebar", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
