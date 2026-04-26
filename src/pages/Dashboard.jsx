import Card from "../components/Card";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { generateInsight } from "../utils/insightEngine";
import { useEffect } from "react";
import { getTodayDate } from "../utils/historyEngine";
import { getTopPriorityTask } from "../utils/priorityEngine";
import FocusTimer from "../components/FocusTimer";
import { generateDailyPlan } from "../utils/plannerEngine";

export default function Dashboard() {
  const { tasks, courses, history, setHistory, xp, focusMinutes, dailyExpenses, expenseBudget } = useApp();

  // TASK LOGIC
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const taskPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // COURSE LOGIC
  const totalCourses = courses.length;

  const avgProgress =
    totalCourses === 0
      ? 0
      : Math.round(
          courses.reduce((acc, c) => acc + c.progress, 0) / totalCourses
        );

  // AI INSIGHT (Local Rule-Based Engine - Real)
  const insight = generateInsight(tasks, courses, history);

  // HISTORY TRACKING
  useEffect(() => {
    const today = getTodayDate();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;

    const taskPercent =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const totalCourses = courses.length;
    const avgStudy =
      totalCourses === 0
        ? 0
        : Math.round(
            courses.reduce((acc, c) => acc + c.progress, 0) / totalCourses
          );

    const exists = history.find((h) => h.date === today);

    const newEntry = {
      date: today,
      taskPercent,
      studyPercent: avgStudy,
    };

    if (exists) {
      const isSame =
        exists.taskPercent === newEntry.taskPercent &&
        exists.studyPercent === newEntry.studyPercent;

      if (!isSame) {
        setHistory(
          history.map((h) => (h.date === today ? newEntry : h))
        );
      }
    } else {
      setHistory([...history, newEntry]);
    }
  }, [tasks, courses, history, setHistory]);

  // CONSISTENCY
  const avgConsistency =
    history.length === 0
      ? 0
      : Math.round(
          history.reduce((acc, h) => acc + h.taskPercent, 0) /
            history.length
        );

  // STREAK (Consecutive days only)
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].taskPercent >= 50) {
      streak++;
    } else {
      break;
    }
  }

  // Top Task
  const topTask = getTopPriorityTask(tasks);
  
  // Daily Plan
  const dailyPlan = generateDailyPlan(tasks, courses);
  
  // Expense Logic
  const expenseRatio = dailyExpenses / expenseBudget;
  let expenseColor = "text-green-400";
  let expenseAlert = "";
  if (expenseRatio >= 1) {
    expenseColor = "text-red-400";
    expenseAlert = "Budget Exceeded!";
  } else if (expenseRatio > 0.7) {
    expenseColor = "text-yellow-400";
    expenseAlert = "Approaching Limit";
  }

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Header Profile */}
      <div className="flex justify-between items-center bg-white/5 border border-white/10 p-5 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-1 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-xl">🚀</div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-100">{greeting}, User!</h1>
            <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-emerald-400 font-bold tracking-widest uppercase mb-1">Level {Math.floor(xp / 100) + 1}</span>
          <div className="w-20 bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${xp % 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400">✨</span>
            <h2 className="text-lg font-semibold tracking-wide text-emerald-100">AI Insight</h2>
          </div>
          <p className="text-gray-300 font-medium leading-relaxed">{insight.message}</p>
          {insight.action && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)] leading-tight">
              <span className="shrink-0">⚡</span> <span>{insight.action}</span>
            </div>
          )}
        </Card>
      </motion.div>


      <FocusTimer />

      <Card className="border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Focus Target</h3>
        
        {topTask ? (
          <p className="text-xl font-medium mt-1 text-amber-100">
            {topTask.text}
          </p>
        ) : (
          <p className="text-gray-500 mt-1 italic">
            No pending tasks
          </p>
        )}
      </Card>

      <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">Smart Daily Planner</h3>
        <div className="flex flex-col gap-3">
          {dailyPlan.length > 0 ? (
            dailyPlan.map((plan, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <span className="text-blue-300 font-mono text-xs font-semibold bg-blue-500/10 px-2 py-1 rounded-md shrink-0">{plan.time}</span>
                <span className="text-gray-200 text-sm truncate ml-4 flex-1 text-right font-medium">{plan.activity}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Add some tasks to generate a daily plan.</p>
          )}
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-4">

        {/* Daily Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="flex flex-col items-center justify-center py-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score</h3>
            <p className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-emerald-300 to-emerald-600 mt-2 drop-shadow-sm">
              {taskPercent}%
            </p>
          </Card>
        </motion.div>

        {/* Consistency */}
        <Card className="flex flex-col items-center justify-center py-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Consistency</h3>
          <p className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-amber-300 to-amber-600 mt-2 drop-shadow-sm">
            {avgConsistency}%
          </p>
        </Card>

        {/* Task Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <h3 className="text-sm text-gray-400">Tasks</h3>
            <p className="text-lg mt-2">
              {completedTasks} / {totalTasks}
            </p>

            <div className="w-full bg-zinc-700 h-2 rounded mt-2">
              <motion.div
                className="bg-green-400 h-2 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${taskPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Study Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <h3 className="text-sm text-gray-400">Study</h3>
            <p className="text-lg mt-2">
              {totalCourses === 0
                ? "No courses"
                : `Avg Progress: ${avgProgress}%`}
            </p>

            <div className="w-full bg-zinc-700 h-2 rounded mt-2">
              <motion.div
                className="bg-blue-400 h-2 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${avgProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className={expenseRatio > 0.7 ? "border border-red-500/50 bg-red-500/5" : ""}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expenses</h3>
            <p className={`text-xl mt-2 font-bold ${expenseRatio >= 1 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]' : expenseRatio > 0.7 ? 'text-amber-400' : 'text-gray-200'}`}>
              ₹{dailyExpenses} <span className="text-sm text-gray-500">/ ₹{expenseBudget}</span>
            </p>
            {expenseAlert && (
              <p className={`text-xs mt-2 font-semibold ${expenseRatio >= 1 ? "text-red-400" : "text-amber-400"}`}>
                ⚠ {expenseAlert}
              </p>
            )}
          </Card>
        </motion.div>

      </div>

      {/* Gamification & Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-1 flex flex-col items-center py-4 border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Streak</h3>
          <p className="text-2xl font-black text-cyan-400 mt-1">
            {streak}
          </p>
          <span className="text-[10px] text-gray-500">DAYS</span>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center py-4 border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total XP</h3>
          <p className="text-2xl font-black text-purple-400 mt-1">
            {xp}
          </p>
          <span className="text-[10px] text-gray-500">POINTS</span>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center py-4 border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Focus</h3>
          <p className="text-2xl font-black text-indigo-400 mt-1">
            {focusMinutes}
          </p>
          <span className="text-[10px] text-gray-500">MINS</span>
        </Card>
      </div>

    </div>
  );
}