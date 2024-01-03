import React from "react";
import { Route, Routes } from "react-router-dom";
import Weekly from "../../views/Weekly";
import Monthly from "../../views/Monthly";
import { useSidebar } from "../../context/SidebarContext";
import Yearly from "../../views/Yearly";

const MainContent = () => {
  const { isSidebarOpen } = useSidebar(); // Now using the context correctly
  return (
    <main
      data-testid="main-content"
      className={`flex-grow transform transition-transform duration-300 ease-in-out px-4 z-30 ${
        isSidebarOpen ? "ml-[300px]" : "ml-0"
      }`}
    >
      <Routes>
        <Route path="/" element={<Weekly />} />
        <Route path="/month" element={<Monthly />} />
        <Route path="/year" element={<Yearly />} />
      </Routes>
    </main>
  );
};

export default MainContent;
