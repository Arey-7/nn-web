"use client";

import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const currentTheme = theme === 'system' ? 'system' : theme;

  return (
    <div className="fixed bottom-14 right-8 z-20 drop-shadow-lg">
      {currentTheme === 'dark'?(
        <button className="bg-black rounded-full flex p-4 text-sm hover:invert" onClick={() => setTheme("light")}>
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </button>
      ):(
        <button className="bg-white rounded-full flex p-4 text-sm hover:invert" onClick={() => setTheme("dark")}>
        <FontAwesomeIcon icon={faCircleHalfStroke} />
      </button>
      )}
    </div>
  );
}
