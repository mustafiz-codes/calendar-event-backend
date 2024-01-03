import React from "react";
import { useTheme } from "../../context/ThemeContext"; // Adjust the import path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";

function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {" "}
      <FontAwesomeIcon icon={faCircleHalfStroke} className=" h-5 w-5" />
    </button>
  );
}

export default ThemeToggle;
