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

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-14 right-3 ">
      {theme === 'dark'?(
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
