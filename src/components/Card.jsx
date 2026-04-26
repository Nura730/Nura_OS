export default function Card({ children, className = "" }) {
  return (
    <div 
      className={`bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-white/20 transition-all duration-300 relative overflow-hidden group ${className}`}
    >
      {/* Subtle top glare */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}