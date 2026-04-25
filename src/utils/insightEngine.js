export function generateInsight(tasks, courses, history) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const totalCourses = courses.length;
  const avgStudy =
    totalCourses === 0
      ? 0
      : courses.reduce((acc, c) => acc + c.progress, 0) / totalCourses;

  const taskRate =
    totalTasks === 0 ? 0 : completedTasks / totalTasks;

  // HISTORY ANALYSIS
  const last3Days = history.slice(-3);

  const avgRecent =
    last3Days.length === 0
      ? 0
      : last3Days.reduce((acc, h) => acc + h.taskPercent, 0) /
        last3Days.length;

  const overallAvg =
    history.length === 0
      ? 0
      : history.reduce((acc, h) => acc + h.taskPercent, 0) /
        history.length;

  // STREAK
  const streak = history.filter(h => h.taskPercent > 50).length;

  // RULES

  // No data
  if (totalTasks === 0 && totalCourses === 0) {
    return "Start tracking tasks or courses to unlock insights.";
  }

  // Declining performance
  if (avgRecent < overallAvg - 10) {
    return "Your consistency is dropping. Try reducing workload and refocusing.";
  }

  // Improving trend
  if (avgRecent > overallAvg + 10) {
    return "You are improving your consistency. Keep pushing forward.";
  }

  // Low tasks
  if (taskRate < 0.5 && totalTasks > 0) {
    return "You are not completing enough tasks. Focus on finishing what you start.";
  }

  // High study, low execution
  if (avgStudy > 50 && taskRate < 0.5) {
    return "You are learning well but not executing enough daily tasks.";
  }

  // Strong streak
  if (streak >= 3) {
    return `You are on a ${streak}-day streak. Stay consistent.`;
  }

  // Balanced
  if (taskRate > 0.7 && avgStudy > 50) {
    return "Great balance between execution and growth.";
  }

  return "Your performance is stable. Try pushing slightly harder.";
}