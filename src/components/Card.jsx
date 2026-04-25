export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-zinc-900 rounded-2xl p-4 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}