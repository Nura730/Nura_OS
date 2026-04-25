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
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Growth</h1>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add course (e.g. Fullstack)"
          className="flex-1 p-2 rounded bg-zinc-800 text-white"
        />

        <button onClick={addCourse} className="bg-blue-500 px-3 rounded">
          Add
        </button>
      </div>

      {/* Course List */}
      <div className="flex flex-col gap-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-zinc-900 p-3 rounded flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <span>{course.name}</span>
              <button
                onClick={() => deleteCourse(course.id)}
                className="text-red-400 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="w-full bg-zinc-700 h-2 rounded">
              <div
                className="bg-blue-400 h-2 rounded"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            <button
              onClick={() => increaseProgress(course.id)}
              className="text-xs bg-blue-500 px-2 py-1 rounded"
            >
              + Progress
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}