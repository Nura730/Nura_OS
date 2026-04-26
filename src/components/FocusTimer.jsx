import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import Card from "./Card";

export default function FocusTimer() {
  const { setFocusMinutes, setXp } = useApp();
  const defaultTime = 25 * 60; // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      alert("Session complete! +20 XP");
      setFocusMinutes((prev) => prev + 25);
      setXp((prev) => prev + 20);
      setTimeLeft(defaultTime);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, setFocusMinutes, setXp]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(defaultTime);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent flex flex-col items-center py-8 relative overflow-hidden">
      {/* Background glow behind timer */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl transition-opacity duration-1000 ${isRunning ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
      
      <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Deep Work Focus</h3>
      
      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200 mb-8 tracking-tighter drop-shadow-lg z-10 font-mono">
        {minutes}:{seconds}
      </div>
      
      <div className="flex gap-4 z-10">
        <button
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
            isRunning 
              ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" 
              : "bg-indigo-500 text-black hover:bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          }`}
        >
          {isRunning ? "Pause" : "Start Focus"}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-2xl font-semibold hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          Reset
        </button>
      </div>
    </Card>
  );
}
