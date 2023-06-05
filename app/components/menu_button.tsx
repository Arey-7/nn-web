"use client";
import { useState } from "react";

export default function MenuButton() {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };
  return (
    <button
      className="menu-button dark:invert"
      aria-controls="primary-navigation"
      aria-expanded={clicked ? "true": "false"}
      onClick={handleClick}
    >
      <svg
        className="hamburger"
        stroke="var(--button-color)"
        fill="none"
        viewBox="0 0 100 100"
        width="50"
      >
        <path
          className="line"
          d="m 20 40 h 60 a 1 1 0 0 1 0 20 h -60 a 1 1 0 0 0 0 20 h 60 a 1 1 0 0 1 0 20 h -30 v -70"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </button>
  );
}
