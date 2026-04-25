import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-zinc-900 p-5 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-green-400">Nura OS</h1>

      <nav className="flex flex-col gap-4 text-gray-300">
        <Link to="/" className="hover:test-green-400 transition">
          Dashboard
        </Link>
        <Link to="/tasks" className="hover:test-green-400 transition">
          Tasks
        </Link>
        <Link to="/expenses" className="hover:test-green-400 transition">
          Expenses
        </Link>
        <Link to="/growth" className="hover:test-green-400 transition">
          Growth
        </Link>
        <Link to="/insights" className="hover:test-green-400 transition">
          Insights
        </Link>
      </nav>
    </div>
  );
}
