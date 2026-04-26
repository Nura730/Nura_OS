export function assignPriority(taskText, tasks) {
  const text = taskText.toLowerCase();

  // RULE 1 — Urgent keywords
  if (
    text.includes("exam") ||
    text.includes("deadline") ||
    text.includes("submit") ||
    text.includes("project")
  ) {
    return "high";
  }

  // RULE 2 — Growth-related
  if (
    text.includes("study") ||
    text.includes("learn") ||
    text.includes("practice")
  ) {
    return "medium";
  }

  // RULE 3 — Too many pending tasks
  const pendingCount = tasks.filter(t => !t.completed).length;

  if (pendingCount > 5) {
    return "high";
  }

  return "low";
}

export function assignCategory(taskText) {
  const text = taskText.toLowerCase();
  
  if (text.includes("exam") || text.includes("study") || text.includes("read") || text.includes("learn") || text.includes("course")) {
    return { name: "Learning", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
  }
  
  if (text.includes("workout") || text.includes("gym") || text.includes("run") || text.includes("health") || text.includes("water")) {
    return { name: "Health", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  }
  
  if (text.includes("buy") || text.includes("pay") || text.includes("shop") || text.includes("grocery")) {
    return { name: "Errands", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
  }
  
  if (text.includes("work") || text.includes("meeting") || text.includes("email") || text.includes("client") || text.includes("project")) {
    return { name: "Work", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
  }
  
  return { name: "Life", color: "text-gray-400 bg-gray-500/10 border-gray-500/20" };
}


// 🔥 ADD THIS (missing part)
export function getTopPriorityTask(tasks) {
  const pending = tasks.filter((t) => !t.completed);

  if (pending.length === 0) return null;

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return pending.sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
  )[0];
}