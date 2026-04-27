import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Growth() {
  const { courses, setCourses } = useApp();
  const [input, setInput] = useState("");

  // Add course
  const addCourse = () => {
    if (!input.trim()) return;

    const newCourse = {
      id: Date.now(),
      name: input,
      progress: 0,
    };

    setCourses([newCourse, ...courses]);
    setInput("");
  };

  // Increase progress
  const increaseProgress = (id) => {
    setCourses(
      courses.map((course) =>
        course.id === id
          ? {
              ...course,
              progress: Math.min(course.progress + 10, 100),
            }
          : course
      )
    );
  };

  // Delete course
  const deleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">Growth Tracker</h1>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500">📚</span>
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCourse()}
            placeholder="Add course (e.g. Masterclass)"
            className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500 shadow-inner"
          />
        </div>
        <button 
          onClick={addCourse} 
          className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-4 sm:py-0 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex-shrink-0"
        >
          Add
        </button>
      </div>

      {/* Course List */}
      <div className="flex flex-col gap-4 mt-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative bg-white/5 border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col gap-4 transition-all duration-300 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>
            
            <div className="flex justify-between items-start sm:items-center z-10 gap-2">
              <span className="text-lg font-medium text-gray-200 break-words flex-1 min-w-0">{course.name}</span>
              <button
                onClick={() => deleteCourse(course.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-300"
                title="Delete course"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>

            <div className="z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-medium">Progress</span>
                <span className="text-xs text-blue-400 font-bold">{course.progress}%</span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full shadow-inner overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-end z-10 mt-2">
              <button
                onClick={() => increaseProgress(course.id)}
                disabled={course.progress >= 100}
                className="text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:hover:bg-blue-500/10 flex items-center gap-2 border border-blue-500/20"
              >
                <span className="text-sm">⏱️</span> Log Session (+10%)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}