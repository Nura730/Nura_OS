import { createContext, useContext, useState, useEffect } from "react";
import { getTodayDate } from "../utils/historyEngine";

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

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("xp");
    return saved ? parseInt(saved) : 0;
  });

  const [focusMinutes, setFocusMinutes] = useState(() => {
    const saved = localStorage.getItem("focusMinutes");
    return saved ? parseInt(saved) : 0;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate dailyExpenses dynamically
  const dailyExpenses = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const [lastDate, setLastDate] = useState(() => {
    const saved = localStorage.getItem("lastDate");
    return saved || getTodayDate();
  });

  const [expenseBudget, setExpenseBudget] = useState(() => {
    const saved = localStorage.getItem("expenseBudget");
    return saved ? parseFloat(saved) : 1000;
  });

  // Daily Reset Logic
  useEffect(() => {
    const today = getTodayDate();
    if (lastDate !== today) {
      // Calculate previous day stats and update history if needed
      // Reset daily tasks
      setTasks(prev => prev.map(t => ({ ...t, completed: false })));
      // Reset focus and expenses
      setFocusMinutes(0);
      setTransactions([]);
      setLastDate(today);
      localStorage.setItem("lastDate", today);
      
      // Streak day XP logic could go here if we verify they completed 50% yesterday
      const yesterdayEntry = history.find(h => h.date === lastDate);
      if (yesterdayEntry && yesterdayEntry.taskPercent >= 50) {
        setXp(prev => prev + 30); // Streak +30 XP
      }
    }
  }, [lastDate, history]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("xp", xp);
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("focusMinutes", focusMinutes);
  }, [focusMinutes]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("expenseBudget", expenseBudget);
  }, [expenseBudget]);

  return (
    <AppContext.Provider value={{ 
      tasks, setTasks, 
      courses, setCourses, 
      history, setHistory,
      xp, setXp,
      focusMinutes, setFocusMinutes,
      transactions, setTransactions,
      dailyExpenses,
      expenseBudget, setExpenseBudget
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}