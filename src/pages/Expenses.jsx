import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Expenses() {
  const { transactions, setTransactions, dailyExpenses, expenseBudget, setExpenseBudget } = useApp();
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(expenseBudget);

  const addExpense = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0 && title.trim() !== "") {
      const newTransaction = {
        id: Date.now(),
        title: title.trim(),
        amount: value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTransactions([newTransaction, ...transactions]);
      setAmount("");
      setTitle("");
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const resetExpenses = () => setTransactions([]);

  const saveBudget = () => {
    const value = parseFloat(budgetInput);
    if (!isNaN(value) && value > 0) {
      setExpenseBudget(value);
      setIsEditingBudget(false);
    }
  };

  const ratio = dailyExpenses / expenseBudget;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-amber-400 tracking-tight">Daily Expenses</h1>
      
      <div className="flex flex-col gap-3 p-5 rounded-3xl bg-white/5 border border-white/10 shadow-lg">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you buy? (e.g. Coffee)"
          className="w-full py-3 px-4 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-red-500/50 transition-all placeholder:text-gray-500 shadow-inner"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addExpense()}
              placeholder="Amount"
              className="w-full py-3 pl-10 pr-4 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-red-500/50 transition-all placeholder:text-gray-500 shadow-inner"
            />
          </div>
          <button 
            onClick={addExpense} 
            disabled={!title || !amount}
            className="bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:hover:bg-red-500 text-white font-semibold py-3 sm:py-0 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-br from-white/5 to-transparent p-8 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden">
        {ratio >= 1 && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>}
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Today's Spending</h3>
        
        <p className={`text-4xl sm:text-5xl font-black mt-3 drop-shadow-lg flex flex-wrap items-baseline gap-2 ${ratio >= 1 ? 'text-red-400' : ratio > 0.7 ? 'text-amber-400' : 'text-emerald-400'}`}>
          ₹{dailyExpenses} 
          <span className="text-lg sm:text-xl text-gray-500 font-medium flex items-center gap-2">
            / ₹{expenseBudget}
            <button 
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
            >
              Edit
            </button>
          </span>
        </p>

        {isEditingBudget && (
          <div className="mt-4 flex gap-2">
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white outline-none w-32 text-sm"
              placeholder="New Budget"
            />
            <button onClick={saveBudget} className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Save
            </button>
          </div>
        )}
        
        <div className="w-full bg-white/5 h-3 rounded-full mt-6 shadow-inner overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${ratio >= 1 ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : ratio > 0.7 ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}
            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
          />
        </div>
        
        {ratio >= 1 && (
          <p className="mt-4 text-sm text-red-400 font-semibold animate-bounce">
            ⚠️ You have exceeded your daily budget!
          </p>
        )}
      </div>

      {/* Transaction History */}
      <div className="mt-2">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Transactions</h3>
        
        {transactions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {transactions.map((t) => (
              <div key={t.id} className="group flex justify-between items-center bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors gap-2">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-gray-200 font-medium truncate">{t.title}</span>
                  <span className="text-xs text-gray-500 mt-0.5">{t.time}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <span className="text-red-400 font-bold">-₹{t.amount}</span>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <span className="text-3xl mb-2 block opacity-50">🛒</span>
            <p className="text-gray-500 font-medium">No expenses recorded today.</p>
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <button 
          onClick={resetExpenses} 
          className="mt-4 mx-auto block px-4 py-2 bg-transparent rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 transition-all"
        >
          Clear All Transactions
        </button>
      )}
    </div>
  );
}