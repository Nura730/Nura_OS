import { useState } from "react";
import { useApp } from "../context/AppContext";
import { assignPriority, assignCategory } from "../utils/priorityEngine";

export default function Tasks() {
  const { tasks, setTasks, setXp } = useApp();

  const [input, setInput] = useState("");


  // Add Task
  const addTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      priority: assignPriority(input, tasks),
      category: assignCategory(input),
    };

    setTasks([newTask, ...tasks]);
    setInput("");
  };

  // Toggle Complete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          if (!task.completed) setXp((prev) => prev + 10); // +10 XP for completion
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };



  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">Tasks</h1>

      {/* Input */}
      <div className="flex gap-3 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-gray-500">+</span>
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="What needs to be done?"
          className="flex-1 py-4 pl-10 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 shadow-inner"
        />
        <button 
          onClick={addTask} 
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2">
        {[...tasks]
          .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          })
          .map((task) => (
          <div
            key={task.id}
            className={`group flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 ${task.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-4">
              {/* Premium Custom Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  task.completed
                    ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "border-gray-500 hover:border-emerald-400"
                }`}
              >
                {task.completed && <span className="text-black text-sm font-bold">✓</span>}
              </button>

              {/* Task Text + Priority */}
              <div className="flex flex-col">
                <span
                  className={`text-base font-medium transition-all ${
                    task.completed ? "line-through text-gray-500" : "text-gray-200"
                  }`}
                >
                  {task.text}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                    task.priority === "high"
                      ? "text-red-400"
                      : task.priority === "medium"
                        ? "text-amber-400"
                        : "text-blue-400"
                  }`}
                >
                  {task.priority} PRIORITY
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 z-10">
              {/* Category Tag */}
              {task.category && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${task.category.color}`}>
                  {task.category.name}
                </span>
              )}

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-sm transition-all duration-300 bg-white/5 hover:bg-red-500/10 p-2 rounded-lg"
                title="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
