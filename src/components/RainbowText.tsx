"use client"; // Ensures the component runs on the client side

import React, { useEffect, useState } from "react";

interface RainbowTextProps {
  text: string;
  className?: string;
}

const RainbowText: React.FC<RainbowTextProps> = ({ text }) => {
  const [formattedText, setFormattedText] = useState<string>("");

  useEffect(() => {
    const rainbowColors = [
      "#C11B1B", "#CC6C4A", "#DECA36", "#82B370", "#89c7d5",
      "#194985", "#714B9C", "#A24EBE", "#EA8CDA", "#85193F", "#2C425C"
    ];
    
    const words = text.split(" ");
    const firstLine = words.slice(0, -1).join(" "); // Everything except the last word
    const secondLine = words[words.length - 1]; // Last word

    const applyRainbow = (text: string) =>
      text
        .split("")
        .map((char, i) => 
          char === " " ? " " : `<span style="color: ${rainbowColors[i % rainbowColors.length]}">${char}</span>`
        )
        .join("");

    // Apply solid color to the first line and rainbow to the second line
    const formatted = `
      <div style="color: #365d99; font-weight: bold;">${firstLine}</div>
      <div>${applyRainbow(secondLine)}</div>
    `;

    setFormattedText(formatted);
  }, [text]);

  return <h1 id="rainbow" dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

export default RainbowText;
