import { useState } from "react";
import { useApp } from "../context/AppContext";
import { assignPriority } from "../utils/priorityEngine";

export default function Tasks() {
  const { tasks, setTasks } = useApp();

  const [input, setInput] = useState("");

  {
    tasks.length === 0 && <p className="text-gray-500 text-sm">No tasks yet</p>;
  }
  // Add Task
  const addTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      priority: assignPriority(input, tasks),
    };

    setTasks([newTask, ...tasks]);
    setInput("");
  };

  // Toggle Complete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  {
    tasks.length === 0 && <p className="text-gray-500 text-sm">No tasks yet</p>;
  }

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Tasks</h1>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 p-2 rounded bg-zinc-800 text-white outline-none"
        />

        <button onClick={addTask} className="bg-green-500 px-3 rounded">
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-zinc-900 p-3 rounded"
          >
            <div className="flex items-center gap-3">
              {/* Complete Button */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border ${
                  task.completed
                    ? "bg-green-400 border-green-400"
                    : "border-gray-400"
                }`}
              />

              {/* Task Text + Priority */}
              <div className="flex flex-col">
                <span
                  className={`${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.text}
                </span>

                <span
                  className={`text-xs ${
                    task.priority === "high"
                      ? "text-red-400"
                      : task.priority === "medium"
                        ? "text-yellow-400"
                        : "text-gray-400"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-400 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
