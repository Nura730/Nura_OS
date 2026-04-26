import BottomNav from "../components/BottomNav";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white relative">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center z-10 sticky top-0 bg-[#050505]/80 backdrop-blur-lg border-b border-white/5">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
          Nura OS
        </h1>
        <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-400">A</span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-32 z-10 no-scrollbar">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}