import { useApp } from "../context/AppContext";
import { generateInsight } from "../utils/insightEngine";
import Card from "../components/Card";

export default function Insights() {
  const { tasks, courses, history } = useApp();
  const activeInsight = generateInsight(tasks, courses, history);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 tracking-tight">AI & Analytics</h1>
      
      <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 py-8 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-6 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <span className="text-2xl">🧠</span>
        </div>
        <h2 className="text-xl font-bold text-gray-200 mb-3">{activeInsight.message}</h2>
        {activeInsight.action && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-6 py-3 rounded-3xl sm:rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.15)] leading-relaxed">
            <span className="shrink-0 text-base">⚡ Action Plan:</span> 
            <span className="text-gray-200">{activeInsight.action}</span>
          </div>
        )}
      </Card>

      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-4">Historical Data</h3>
      
      <div className="flex flex-col gap-3">
        {history.slice().reverse().map((entry, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors gap-2">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-mono text-sm text-gray-300 bg-white/5 px-2 py-1 rounded-md w-fit mb-1">{entry.date}</span>
              <span className="text-xs text-gray-500">Daily Performance</span>
            </div>
            <div className="flex gap-4 text-right">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tasks</span>
                <span className="text-lg font-bold text-emerald-400">{entry.taskPercent}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Growth</span>
                <span className="text-lg font-bold text-blue-400">{entry.studyPercent}%</span>
              </div>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-center text-gray-500 italic mt-8">No historical data recorded yet.</p>
        )}
      </div>
    </div>
  );
}