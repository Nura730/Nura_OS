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
    return {
      message: "Start tracking tasks or courses to unlock insights.",
      action: "Add your first task for today.",
    };
  }

  // Declining performance
  if (avgRecent < overallAvg - 10) {
    return {
      message: "Your consistency is dropping. Try reducing workload.",
      action: "Take a break, then complete your highest priority task.",
    };
  }

  // Improving trend
  if (avgRecent > overallAvg + 10) {
    return {
      message: "You are improving your consistency. Keep pushing forward.",
      action: "Maintain your streak and tackle another high-priority task.",
    };
  }

  // Low tasks
  if (taskRate < 0.5 && totalTasks > 0) {
    return {
      message: "You are not completing enough tasks.",
      action: "Focus on finishing what you start. Do one task right now.",
    };
  }

  // High study, low execution
  if (avgStudy > 50 && taskRate < 0.5) {
    return {
      message: "You are learning well but not executing enough daily tasks.",
      action: "Apply what you learned. Complete a project task.",
    };
  }

  // Strong streak
  if (streak >= 3) {
    return {
      message: `You are on a ${streak}-day streak. Excellent work.`,
      action: "Keep the momentum going. Knock out a medium priority task.",
    };
  }

  // Balanced
  if (taskRate > 0.7 && avgStudy > 50) {
    return {
      message: "Great balance between execution and growth.",
      action: "Review your upcoming goals to maintain this balance.",
    };
  }

  return {
    message: "Your performance is stable.",
    action: "Try pushing slightly harder with a focus session.",
  };
}