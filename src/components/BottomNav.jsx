import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/tasks", label: "Tasks", icon: "✓" },
    { path: "/expenses", label: "Money", icon: "₹" },
    { path: "/growth", label: "Growth", icon: "📈" },
    { path: "/insights", label: "AI", icon: "✨" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex justify-between py-3 px-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-300 ${
              isActive
                ? "bg-white/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}