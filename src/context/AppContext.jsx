import { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
});
const [courses, setCourses] = useState(() => {
  const saved = localStorage.getItem("courses");
  return saved ? JSON.parse(saved) : [];
});
const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem("history");
  return saved ? JSON.parse(saved) : [];
});


  useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

useEffect(() => {
  localStorage.setItem("courses", JSON.stringify(courses));
}, [courses]);

useEffect(() => {
  localStorage.setItem("history", JSON.stringify(history));
}, [history]);


  return (
    <AppContext.Provider value={{ tasks, setTasks, courses, setCourses, history, setHistory }}>
      {children}
    </AppContext.Provider>
  );
} // ✅ THIS WAS MISSING

export function useApp() {
  return useContext(AppContext);
}