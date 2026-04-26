import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const { syncToCloud } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleSync = async () => {
    setIsSyncing(true);
    await syncToCloud();
    setTimeout(() => {
      setIsSyncing(false);
      setMenuOpen(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white relative">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center z-50 sticky top-0 bg-[#050505]/80 backdrop-blur-lg border-b border-white/5">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
          Nura OS
        </Link>
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-9 w-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center hover:border-emerald-500/50 transition-colors shadow-lg"
          >
            <span className="text-sm font-bold text-gray-200">{initial}</span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col py-2 z-50">
              <div className="px-4 py-2 border-b border-white/5 mb-1">
                <p className="text-sm font-bold text-gray-200 truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "No email"}</p>
              </div>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                {isSyncing ? "⏳ Syncing..." : "☁️ Sync Data"}
              </button>
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-32 z-10 no-scrollbar">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}