import Card from "../components/Card";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { generateInsight } from "../utils/insightEngine";
import { useState, useEffect } from "react";
import { getTodayDate } from "../utils/historyEngine";
import { getTopPriorityTask } from "../utils/priorityEngine";
import { getAIInsight } from "../services/aiService";

export default function Dashboard() {

    <h1 className="text-2xl font-bold text-green-400">
  Nura OS
</h1>
    const [aiInsight, setAiInsight] = useState(null);
  const { tasks, courses, history, setHistory } = useApp();

  {!aiInsight && <p className="text-gray-500">Analyzing...</p>}

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

  // AI INSIGHT
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

  // STREAK
  const streak = history.filter((h) => h.taskPercent > 50).length;

  //Top Task
  const topTask = getTopPriorityTask(tasks);


  useEffect(() => {
  const fetchAI = async () => {
    const data = {
      tasks,
      courses,
      history,
    };

    const res = await getAIInsight(data);

    if (res) {
      setAiInsight(res);
    }
  };

  fetchAI();
}, [tasks, courses, history]);

  return (
    <div className="flex flex-col gap-4">

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/20">
          <h2 className="text-lg font-semibold mb-2">AI Insight</h2>
          <p className="text-gray-300">{aiInsight || insight}</p>
        </Card>
      </motion.div>


<Card className="border border-yellow-400/20">
  <h3 className="text-sm text-gray-400">Do This Next</h3>

  {topTask ? (
    <p className="text-lg mt-2 text-yellow-300">
      {topTask.text}
    </p>
  ) : (
    <p className="text-gray-500 mt-2">
      No pending tasks
    </p>
  )}
</Card>
      <div className="grid grid-cols-2 gap-4">



        {/* Daily Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <h3 className="text-sm text-gray-400">Daily Score</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {taskPercent}%
            </p>
          </Card>
        </motion.div>

        {/* Consistency */}
        <Card>
          <h3 className="text-sm text-gray-400">Consistency</h3>
          <p className="text-2xl font-bold text-yellow-400 mt-2">
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
          <Card>
            <h3 className="text-sm text-gray-400">Expenses</h3>
            <p className="text-lg mt-2">₹500 / ₹1000</p>
          </Card>
        </motion.div>

      </div>

      {/* Streak */}
      <Card>
        <h3 className="text-sm text-gray-400">Streak</h3>
        <p className="text-2xl font-bold text-blue-400 mt-2">
          {streak} days
        </p>
      </Card>

    </div>
  );
}