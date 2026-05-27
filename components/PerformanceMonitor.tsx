"use client";

import React, { useEffect, useState, useRef } from "react";

export default function PerformanceMonitor() {
  const [show, setShow] = useState(false);
  const [fps, setFps] = useState(0);
  const [minFps, setMinFps] = useState(60);
  const [frameTime, setFrameTime] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const framesCountRef = useRef(0);
  const lastFpsUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if we should render (dev mode or search param)
    const isDev = process.env.NODE_ENV === "development";
    const hasParam = typeof window !== "undefined" && 
      (window.location.search.includes("perf=true") || window.location.search.includes("debug=true"));
    
    if (!isDev && !hasParam) return;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);

    const updateMetrics = (time: number) => {
      if (previousTimeRef.current !== null) {
        const delta = time - previousTimeRef.current;
        setFrameTime(Math.round(delta * 10) / 10);
        framesCountRef.current += 1;

        if (lastFpsUpdateRef.current === null) {
          lastFpsUpdateRef.current = time;
        }

        // Update FPS every 500ms
        if (time - lastFpsUpdateRef.current >= 500) {
          const computedFps = Math.round((framesCountRef.current * 1000) / (time - lastFpsUpdateRef.current));
          setFps(computedFps);
          setMinFps((prev) => (computedFps < prev && computedFps > 0 ? computedFps : prev));
          setHistory((prev) => {
            const next = [...prev, computedFps];
            if (next.length > 20) next.shift();
            return next;
          });
          framesCountRef.current = 0;
          lastFpsUpdateRef.current = time;
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(updateMetrics);
    };

    requestRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  if (!show) return null;

  const isLowFps = fps < 60;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 p-4 rounded-2xl bg-[#edf2e2]/95 border border-[#4d6617]/20 backdrop-blur-md shadow-lg pointer-events-auto select-none font-sans text-xs w-48 text-[#211a17]">
      <div className="flex justify-between items-center font-bold">
        <span>Monitor de Performance</span>
        <span className={`h-2.5 w-2.5 rounded-full ${isLowFps ? "bg-red-500 animate-pulse" : "bg-primary"}`} />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex flex-col p-2 bg-[#fff8f6] rounded-xl border border-[#ede0da]">
          <span className="text-[10px] text-on-surface-variant font-medium">FPS Atual</span>
          <span className={`text-lg font-extrabold ${isLowFps ? "text-red-500" : "text-primary"}`}>
            {fps}
          </span>
        </div>
        <div className="flex flex-col p-2 bg-[#fff8f6] rounded-xl border border-[#ede0da]">
          <span className="text-[10px] text-on-surface-variant font-medium">Min FPS</span>
          <span className="text-lg font-extrabold text-[#8c4f00]">
            {minFps}
          </span>
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
        <span>Tempo de Frame:</span>
        <span className="font-semibold">{frameTime} ms</span>
      </div>
      {/* Simple mini bar graph */}
      <div className="flex items-end gap-[2px] h-8 w-full bg-[#fff8f6] rounded-lg p-1 border border-[#ede0da] mt-2">
        {history.map((val, idx) => {
          const heightPct = Math.min(100, (val / 60) * 100);
          return (
            <div
              key={idx}
              className={`w-full rounded-t-sm transition-all duration-300 ${val < 60 ? "bg-red-400" : "bg-primary-container"}`}
              style={{ height: `${heightPct}%` }}
              title={`${val} FPS`}
            />
          );
        })}
      </div>
    </div>
  );
}
