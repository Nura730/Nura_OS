import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Expenses from "./pages/Expenses.jsx";
import Growth from "./pages/Growth.jsx";
import Insights from "./pages/Insights.jsx";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;