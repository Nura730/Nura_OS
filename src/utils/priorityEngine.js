export function assignPriority(taskText, tasks) {
  const text = taskText.toLowerCase();

  // RULE 1 — Urgent keywords
  if (
    text.includes("exam") ||
    text.includes("deadline") ||
    text.includes("submit")
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