import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (!res.success) {
      setError(res.error || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] px-4 py-8">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-500/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">Nura OS</h1>
          <p className="text-gray-400 text-sm mt-2">{isLogin ? "Welcome back, sign in to sync." : "Create an account to start syncing."}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-500 shadow-inner"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-500 shadow-inner"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-500 shadow-inner"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)]"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors ml-1"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </Card>
    </div>
  );
}
