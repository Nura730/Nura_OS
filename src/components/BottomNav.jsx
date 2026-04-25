import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/tasks", label: "Tasks" },
    { path: "/expenses", label: "Money" },
    { path: "/growth", label: "Growth" },
    { path: "/insights", label: "AI" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 flex justify-around py-3">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-sm ${
            location.pathname === item.path
              ? "text-green-400"
              : "text-gray-400"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}