export function generateDailyPlan(tasks, courses) {
  // Simple rule-based planner if AI is unavailable
  const pending = tasks.filter((t) => !t.completed);
  
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  const topTasks = pending
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    .slice(0, 3);
    
  if (topTasks.length === 0) {
    return [];
  }

  const schedule = [];
  let currentHour = 9; // Start at 9 AM
  
  topTasks.forEach((task, index) => {
    schedule.push({
      time: `${currentHour > 12 ? currentHour - 12 : currentHour}:00 ${currentHour >= 12 ? 'PM' : 'AM'}`,
      activity: task.text
    });
    currentHour += 2; // Allocate 2 hours per task
  });
  
  return schedule;
}
