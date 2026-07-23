"use client";

import { useEffect, useRef } from "react";

export function AdsterraBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const atOptionsScript = document.createElement("script");
    atOptionsScript.type = "text/javascript";
    atOptionsScript.text = `
      atOptions = {
        'key' : 'a29a644cdf955eff3b87a72b9788955a',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src =
      "https://www.highperformanceformat.com/a29a644cdf955eff3b87a72b9788955a/invoke.js";

    containerRef.current.appendChild(atOptionsScript);
    containerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 min-h-[250px] overflow-hidden">
      <div className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1.5">
        Advertisement
      </div>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] flex items-center justify-center bg-surface-50/50 dark:bg-surface-900 rounded-xl overflow-hidden border border-surface-200/50 dark:border-surface-800 shadow-sm"
      />
    </div>
  );
}
