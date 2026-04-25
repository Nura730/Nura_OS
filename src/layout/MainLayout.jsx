import BottomNav from "../components/BottomNav";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      
      <main className="flex-1 p-4 overflow-y-auto pb-20">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}