import { useState, useEffect } from "react";

const STORAGE_KEY = "finance_dashboard_v6";

const DEFAULT_CATEGORIES = [
  { name: "Housing",       icon: "🏠" },
  { name: "Food",          icon: "🛒" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Utilities",     icon: "⚡" },
  { name: "Insurance",     icon: "🛡️" },
  { name: "Health",        icon: "💊" },
  { name: "Income",        icon: "💰" },
  { name: "Transport",     icon: "🚗" },
  { name: "Other",         icon: "📦" },
];

const defaultData = {
  savingsGoal: 20000,
  categories: DEFAULT_CATEGORIES,
  transactions: [
    { id: 1, name: "Monthly Salary", amount: 150000, type: "income",  date: "2026-03-01", category: "Income" },
    { id: 2, name: "Rent",           amount: 35000,  type: "expense", date: "2026-03-01", category: "Housing" },
    { id: 3, name: "Groceries",      amount: 8000,   type: "expense", date: "2026-02-28", category: "Food" },
    { id: 4, name: "Netflix",        amount: 1100,   type: "expense", date: "2026-02-27", category: "Entertainment" },
    { id: 5, name: "Fuel",           amount: 3500,   type: "expense", date: "2026-02-25", category: "Transport" },
  ],
  upcomingPayments: [
    { id: 1, name: "Electricity Bill", amount: 4500, dueDate: "2026-03-05", category: "Utilities", paid: false },
    { id: 2, name: "Internet",         amount: 2500, dueDate: "2026-03-08", category: "Utilities", paid: false },
    { id: 3, name: "Car Insurance",    amount: 6000, dueDate: "2026-03-15", category: "Insurance", paid: false },
    { id: 4, name: "Gym Membership",   amount: 3000, dueDate: "2026-03-20", category: "Health",    paid: false },
    { id: 5, name: "Phone Bill",       amount: 1500, dueDate: "2026-03-22", category: "Utilities", paid: false },
  ],
  savings: 45000,
  lendings: [
    { id: 1, person: "Ahmed Bhai", amount: 10000, type: "lent",     date: "2026-02-10", note: "Car repair",        settled: false },
    { id: 2, person: "Sara",       amount: 5000,  type: "borrowed", date: "2026-02-20", note: "Emergency grocery", settled: false },
    { id: 3, person: "Usman",      amount: 15000, type: "lent",     date: "2026-01-15", note: "House renovation",  settled: true  },
  ],
  kameetis: [
    {
      id: 1, name: "Gali Wali Kameeti", monthlyAmount: 5000, totalMonths: 10,
      startDate: "2026-01-01", myTurn: 6,
      monthlyPayments: [
        { month: 1, paid: true,  date: "2026-01-05" },
        { month: 2, paid: true,  date: "2026-02-04" },
        { month: 3, paid: false, date: null },
      ],
      received: [],
    },
    {
      id: 2, name: "Office Kameeti", monthlyAmount: 10000, totalMonths: 12,
      startDate: "2025-10-01", myTurn: 3,
      monthlyPayments: [
        { month: 1, paid: true,  date: "2025-10-05" },
        { month: 2, paid: true,  date: "2025-11-03" },
        { month: 3, paid: true,  date: "2025-12-04" },
        { month: 4, paid: true,  date: "2026-01-06" },
        { month: 5, paid: true,  date: "2026-02-05" },
        { month: 6, paid: false, date: null },
      ],
      received: [{ month: 3, amount: 120000, date: "2025-12-04", stillOwes: true }],
    },
  ],
};

function load() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : defaultData; }
  catch { return defaultData; }
}

const card     = { background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e5e7eb" };
const inputSt  = { width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", fontSize: 14, fontWeight: 500, fontFamily: "inherit", color: "#111827", marginBottom: 12, outline: "none" };
const btn      = (bg, color) => ({ background: bg, color, border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" });
const Label    = ({ children }) => <p style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{children}</p>;

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18, color: "#111827" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14, color: "#6b7280", fontFamily: "inherit" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Avatar({ name, size = 36 }) {
  const colors = ["#d4f04e","#fde68a","#bfdbfe","#fbcfe8","#a7f3d0","#ddd6fe","#fed7aa"];
  const bg = colors[Math.abs(name.split("").reduce((a,c) => a + c.charCodeAt(0), 0)) % colors.length];
  const initials = name.trim().split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, color: "#111827", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ── Kameeti Card ────────────────────────────────────────────
function KameetiCard({ k, onMarkPaid, onMarkReceived, onToggleOwed, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const totalPool  = k.monthlyAmount * k.totalMonths;
  const paidMonths = k.monthlyPayments.filter(m => m.paid).length;
  const totalPaid  = paidMonths * k.monthlyAmount;
  const nextDue    = k.monthlyPayments.find(m => !m.paid);
  const pct        = Math.round((paidMonths / k.totalMonths) * 100);

  const monthLabel = n => {
    const d = new Date(k.startDate);
    d.setMonth(d.getMonth() + n - 1);
    return d.toLocaleDateString("en-PK", { month: "short", year: "numeric" });
  };

  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }} onClick={() => setExpanded(e => !e)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{k.name}</p>
            {nextDue && <span style={{ fontSize: 11, fontWeight: 600, background: "#f3f4f6", color: "#6b7280", borderRadius: 6, padding: "2px 8px" }}>Month {nextDue.month} due</span>}
            {(k.received||[]).some(r => r.stillOwes) && <span style={{ fontSize: 11, fontWeight: 600, background: "#111827", color: "#d4f04e", borderRadius: 6, padding: "2px 8px" }}>Received · Owes</span>}
          </div>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af" }}>₨{k.monthlyAmount.toLocaleString()} / month · {k.totalMonths} months · Pool: ₨{totalPool.toLocaleString()}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>₨{totalPaid.toLocaleString()} paid</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{paidMonths}/{k.totalMonths} months</p>
        </div>
        <span style={{ color: "#9ca3af", fontSize: 14, marginLeft: 4 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      <div style={{ height: 4, background: "#f3f4f6" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#d4f04e" }} />
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 20px" }}>
          <p style={{ margin: "16px 0 10px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Monthly Contributions — What I Give</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginBottom: 16 }}>
            {Array.from({ length: k.totalMonths }, (_, i) => {
              const mNum  = i + 1;
              const entry = k.monthlyPayments.find(p => p.month === mNum);
              const isPaid    = entry?.paid;
              const isMyTurn  = k.myTurn === mNum;
              return (
                <div key={mNum} style={{ background: isPaid ? "#f9fafb" : "#fff", border: `1px solid ${isMyTurn && !isPaid ? "#111827" : "#e5e7eb"}`, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: isPaid ? "#9ca3af" : "#374151" }}>{monthLabel(mNum)}</span>
                    {isMyTurn && <span style={{ fontSize: 10, fontWeight: 700, background: "#111827", color: "#d4f04e", borderRadius: 4, padding: "1px 5px" }}>My Turn</span>}
                  </div>
                  <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 13, color: isPaid ? "#9ca3af" : "#111827", textDecoration: isPaid ? "line-through" : "none" }}>₨{k.monthlyAmount.toLocaleString()}</p>
                  {isPaid
                    ? <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>✓ {entry.date ? new Date(entry.date).toLocaleDateString("en-PK", { day: "numeric", month: "short" }) : "Paid"}</p>
                    : <button onClick={() => onMarkPaid(k.id, mNum)} style={{ ...btn("#111827","#d4f04e"), padding: "5px 10px", fontSize: 11, width: "100%" }}>Mark Paid</button>
                  }
                </div>
              );
            })}
          </div>

          <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Received — What I Got & Still Owe Back</p>
          {(k.received||[]).map((r, i) => {
            const paid = paidMonths * k.monthlyAmount;
            const remaining = Math.max(0, r.amount - paid);
            return (
              <div key={i} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14 }}>Received {monthLabel(r.month)} · ₨{r.amount.toLocaleString()}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>{r.date ? new Date(r.date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {r.stillOwes
                      ? <><p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#374151" }}>Still owe: <strong>₨{remaining.toLocaleString()}</strong></p>
                          <button onClick={() => onToggleOwed(k.id, i)} style={{ ...btn("#f3f4f6","#374151"), padding: "4px 10px", fontSize: 11 }}>Mark Settled</button></>
                      : <span style={{ fontSize: 12, color: "#9ca3af" }}>✓ Obligation settled</span>
                    }
                  </div>
                </div>
                {r.stillOwes && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>
                      <span>Paid back via contributions</span>
                      <span>₨{Math.min(paid, r.amount).toLocaleString()} / ₨{r.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ background: "#e5e7eb", borderRadius: 4, height: 5 }}>
                      <div style={{ width: `${Math.min((paid/r.amount)*100,100)}%`, height: "100%", borderRadius: 4, background: "#374151" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {k.myTurn > 0 && !(k.received||[]).find(r => r.month === k.myTurn) && (
            <div style={{ background: "#f9fafb", border: "1px dashed #d1d5db", borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 13 }}>My turn: {monthLabel(k.myTurn)}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Expected pot: ₨{totalPool.toLocaleString()}</p>
              </div>
              <button onClick={() => onMarkReceived(k.id)} style={{ ...btn("#111827","#d4f04e"), padding: "7px 14px", fontSize: 12 }}>Mark Received</button>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button onClick={() => onDelete(k.id)} style={{ ...btn("#f3f4f6","#9ca3af"), padding: "6px 14px", fontSize: 12 }}>Remove Kameeti</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────
export default function App() {
  const [data, setData]         = useState(load);
  const [tab, setTab]           = useState("overview");
  const [modal, setModal]       = useState(null);
  const [toast, setToast]       = useState(null);
  const [lendFilter, setLendFilter] = useState("all");

  const [newTx,   setNewTx]   = useState({ name: "", amount: "", type: "expense", category: "", date: new Date().toISOString().split("T")[0] });
  const [newPay,  setNewPay]  = useState({ name: "", amount: "", dueDate: "", category: "" });
  const [newLend, setNewLend] = useState({ person: "", amount: "", type: "lent", date: new Date().toISOString().split("T")[0], note: "" });
  const [newK,    setNewK]    = useState({ name: "", monthlyAmount: "", totalMonths: "", startDate: new Date().toISOString().split("T")[0], myTurn: "" });
  const [newCat,  setNewCat]  = useState({ name: "", icon: "" });
  const [profile, setProfile] = useState(() => {
    try { const p = localStorage.getItem("mera_paisa_profile"); return p ? JSON.parse(p) : { name: "", currency: "PKR", monthlyIncome: "" }; } catch { return { name: "", currency: "PKR", monthlyIncome: "" }; }
  });
  const [profileDraft, setProfileDraft] = useState(null);
  const [catError, setCatError] = useState("");

  // Keep category default in sync with loaded categories
  const cats = data.categories || DEFAULT_CATEGORIES;
  useEffect(() => {
    if (!newTx.category  && cats.length) setNewTx(d  => ({ ...d, category: cats[0].name }));
    if (!newPay.category && cats.length) setNewPay(d => ({ ...d, category: cats[0].name }));
  }, [cats.length]);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }, [data]);

  const today     = new Date(); today.setHours(0,0,0,0);
  const daysUntil = d => Math.ceil((new Date(d) - today) / 86400000);
  const fmt       = n => "₨" + Math.abs(Math.round(n)).toLocaleString();
  const getCat    = name => cats.find(c => c.name === name) || { name: "Other", icon: "📦" };

  const totalIncome   = data.transactions.filter(t => t.type === "income").reduce((s,t) => s + t.amount, 0);
  const totalExpenses = data.transactions.filter(t => t.type === "expense").reduce((s,t) => s + t.amount, 0);
  const balance       = totalIncome - totalExpenses;
  const pendingBills  = data.upcomingPayments.filter(p => !p.paid).reduce((s,p) => s + p.amount, 0);
  const projected     = balance - pendingBills;
  const savePct       = Math.min((data.savings / data.savingsGoal) * 100, 100);
  const urgentPays    = data.upcomingPayments.filter(p => !p.paid && daysUntil(p.dueDate) <= 5);
  const expByCat      = data.transactions.filter(t => t.type === "expense").reduce((a,t) => { a[t.category] = (a[t.category]||0) + t.amount; return a; }, {});
  const totalLent     = (data.lendings||[]).filter(l => l.type === "lent"     && !l.settled).reduce((s,l) => s + l.amount, 0);
  const totalBorrowed = (data.lendings||[]).filter(l => l.type === "borrowed" && !l.settled).reduce((s,l) => s + l.amount, 0);
  const unsettled     = (data.lendings||[]).filter(l => !l.settled).length;
  const kameetis      = data.kameetis || [];
  const kDue          = kameetis.filter(k => k.monthlyPayments.some(m => !m.paid)).length;

  const notify = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ── Actions ──
  const addTx = () => {
    if (!newTx.name || !newTx.amount) return;
    setData(d => ({ ...d, transactions: [{ ...newTx, id: Date.now(), amount: +newTx.amount }, ...d.transactions] }));
    setNewTx(v => ({ ...v, name: "", amount: "" }));
    setModal(null); notify("Transaction added");
  };
  const addPay = () => {
    if (!newPay.name || !newPay.amount || !newPay.dueDate) return;
    setData(d => ({ ...d, upcomingPayments: [...d.upcomingPayments, { ...newPay, id: Date.now(), amount: +newPay.amount, paid: false }] }));
    setNewPay(v => ({ ...v, name: "", amount: "", dueDate: "" }));
    setModal(null); notify("Reminder added");
  };
  const addLending = () => {
    if (!newLend.person || !newLend.amount) return;
    setData(d => ({ ...d, lendings: [{ ...newLend, id: Date.now(), amount: +newLend.amount, settled: false }, ...(d.lendings||[])] }));
    setNewLend(v => ({ ...v, person: "", amount: "", note: "" }));
    setModal(null); notify("Entry added");
  };
  const addKameeti = () => {
    if (!newK.name || !newK.monthlyAmount || !newK.totalMonths) return;
    const months = +newK.totalMonths;
    setData(d => ({ ...d, kameetis: [...(d.kameetis||[]), { id: Date.now(), name: newK.name, monthlyAmount: +newK.monthlyAmount, totalMonths: months, startDate: newK.startDate, myTurn: +newK.myTurn||0, monthlyPayments: Array.from({length:months},(_,i) => ({month:i+1,paid:false,date:null})), received: [] }] }));
    setNewK({ name:"", monthlyAmount:"", totalMonths:"", startDate: new Date().toISOString().split("T")[0], myTurn:"" });
    setModal(null); notify("Kameeti added");
  };

  // ── Category actions ──
  const addCategory = () => {
    const name = newCat.name.trim();
    const icon = newCat.icon.trim() || "📌";
    if (!name) { setCatError("Name is required"); return; }
    if (cats.find(c => c.name.toLowerCase() === name.toLowerCase())) { setCatError("Category already exists"); return; }
    setData(d => ({ ...d, categories: [...(d.categories||[]), { name, icon }] }));
    setNewCat({ name: "", icon: "" });
    setCatError("");
    notify(`"${name}" added`);
  };
  const removeCategory = name => {
    if (name === "Other") { notify("Can't remove Other — it's the fallback"); return; }
    setData(d => ({ ...d, categories: d.categories.filter(c => c.name !== name) }));
    notify(`"${name}" removed`);
  };

  const markPaid    = id => { setData(d => ({ ...d, upcomingPayments: d.upcomingPayments.map(p => p.id===id ? {...p,paid:true} : p) })); notify("Marked as paid"); };
  const deleteTx    = id => setData(d => ({ ...d, transactions: d.transactions.filter(t => t.id !== id) }));
  const settleLend  = id => { setData(d => ({ ...d, lendings: d.lendings.map(l => l.id===id ? {...l,settled:true} : l) })); notify("Settled"); };
  const deleteLend  = id => setData(d => ({ ...d, lendings: d.lendings.filter(l => l.id !== id) }));
  const quickSave   = amt => {
    setData(d => ({ ...d, savings: d.savings + amt, transactions: [{ id:Date.now(), name:"Savings Transfer", amount:amt, type:"expense", category:"Other", date:new Date().toISOString().split("T")[0] }, ...d.transactions] }));
    notify(`${fmt(amt)} saved`);
  };
  const kMarkPaid     = (kid, month) => setData(d => ({ ...d, kameetis: d.kameetis.map(k => k.id!==kid ? k : { ...k, monthlyPayments: k.monthlyPayments.map(m => m.month===month ? {...m,paid:true,date:new Date().toISOString().split("T")[0]} : m) }) }));
  const kMarkReceived = kid => setData(d => ({ ...d, kameetis: d.kameetis.map(k => { if(k.id!==kid) return k; const pool=k.monthlyAmount*k.totalMonths; return {...k,received:[...(k.received||[]),{month:k.myTurn,amount:pool,date:new Date().toISOString().split("T")[0],stillOwes:true}]}; }) }));
  const kToggleOwed   = (kid,idx) => setData(d => ({ ...d, kameetis: d.kameetis.map(k => k.id!==kid ? k : {...k, received: k.received.map((r,i) => i===idx ? {...r,stillOwes:false} : r) }) }));
  const kDelete       = kid => setData(d => ({ ...d, kameetis: d.kameetis.filter(k => k.id !== kid) }));

  const filteredLendings = (data.lendings||[]).filter(l => lendFilter==="all" || l.type===lendFilter);

  const tabs = [
    ["overview","Overview"],
    ["transactions","Transactions"],
    ["payments","Payments"],
    ["lendings","Borrow & Lend"],
    ["kameeti","Kameeti"],
    ["savings","Savings"],
  ];

  // Category select used in multiple modals
  const CatSelect = ({ value, onChange }) => (
    <select value={value} onChange={onChange} style={inputSt}>
      {cats.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
    </select>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111827" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {urgentPays.length > 0 && (
        <div style={{ background: "#111827", color: "#fff", padding: "10px 24px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "#d4f04e", color: "#111827", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Due soon</span>
          {urgentPays.map(p => `${p.name} in ${daysUntil(p.dueDate)}d — ${fmt(p.amount)}`).join("  ·  ")}
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#111827", color: "#fff", padding: "10px 24px", borderRadius: 10, fontWeight: 500, fontSize: 13, zIndex: 999, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0 20px", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#d4f04e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💸</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Mera Paisa</h1>
              <p style={{ margin: 0, color: "#9ca3af", fontSize: 12 }}>{new Date().toLocaleDateString("en-PK", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => setModal("tx")}      style={btn("#111827","#d4f04e")}>+ Transaction</button>
            <button onClick={() => setModal("kameeti")} style={btn("#f3f4f6","#111827")}>+ Kameeti</button>
            <button onClick={() => setModal("lending")} style={btn("#f3f4f6","#111827")}>+ Borrow / Lend</button>
            <button onClick={() => setModal("pay")}     style={btn("#f3f4f6","#111827")}>+ Reminder</button>
            {/* divider */}
            <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 2px" }} />
            {/* Settings icon — gear SVG */}
            <button onClick={() => setModal("settings")} title="Settings"
              style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            {/* Profile icon — person SVG with initial on hover */}
            <button onClick={() => { setProfileDraft({...profile}); setModal("profile"); }} title="Profile"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {profile.name
                ? <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{profile.name.trim()[0].toUpperCase()}</span>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
              }
            </button>
          </div>
        </div>

        {/* Balance strip */}
        <div style={{ background: "#111827", borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
          <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "1px" }}>Current Balance</p>
          <p style={{ color: "#fff", fontSize: 40, fontWeight: 700, margin: "0 0 20px", letterSpacing: "-1px", lineHeight: 1 }}>{balance < 0 && "−"}{fmt(balance)}</p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Income",        val: fmt(totalIncome),                                     color: "#d4f04e" },
              { label: "Expenses",      val: fmt(totalExpenses),                                   color: "#e5e7eb" },
              { label: "Pending Bills", val: fmt(pendingBills),                                    color: "#e5e7eb" },
              { label: "After Bills",   val: (projected<0?"−":"")+fmt(projected),                  color: projected>=0?"#d4f04e":"#e5e7eb" },
              { label: "You're Owed",   val: fmt(totalLent),                                       color: "#e5e7eb" },
              { label: "You Owe",       val: fmt(totalBorrowed),                                   color: "#e5e7eb" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ margin: "0 0 2px", color: "#4b5563", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
                <p style={{ margin: 0, color: s.color, fontSize: 16, fontWeight: 700 }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: 20, borderBottom: "1px solid #e5e7eb", overflowX: "auto" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: "10px 14px", background: "none", border: "none", borderBottom: `2px solid ${tab===id?"#111827":"transparent"}`, cursor: "pointer", fontWeight: tab===id?700:500, fontSize: 13, fontFamily: "inherit", color: tab===id?"#111827":"#9ca3af", marginBottom: -1, whiteSpace: "nowrap" }}>
              {label}
              {id==="lendings" && unsettled>0 && <span style={{ marginLeft:5, background:"#374151", color:"#fff", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700 }}>{unsettled}</span>}
              {id==="kameeti"  && kDue>0       && <span style={{ marginLeft:5, background:"#d4f04e", color:"#111827", borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700 }}>{kDue}</span>}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={card}>
              <p style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 14 }}>Spending Breakdown</p>
              {Object.entries(expByCat).sort((a,b)=>b[1]-a[1]).map(([cat, amt]) => {
                const c = getCat(cat);
                return (
                  <div key={cat} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"#374151", fontWeight:500 }}>
                        <span style={{ background:"#f3f4f6", width:26, height:26, borderRadius:7, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{c.icon}</span>
                        {cat}
                      </span>
                      <span style={{ fontWeight:600, color:"#374151", fontSize:13 }}>{fmt(amt)}</span>
                    </div>
                    <div style={{ background:"#f3f4f6", borderRadius:4, height:5 }}>
                      <div style={{ width:`${(amt/totalExpenses)*100}%`, height:"100%", borderRadius:4, background:"#374151" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={card}>
                <p style={{ margin:"0 0 14px", fontWeight:700, fontSize:14 }}>Upcoming Payments</p>
                {data.upcomingPayments.filter(p=>!p.paid).slice(0,4).map(p => {
                  const days = daysUntil(p.dueDate);
                  const c = getCat(p.category);
                  return (
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                      <span style={{ background:"#f3f4f6", width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{c.icon}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:0, fontWeight:600, fontSize:13 }}>{p.name}</p>
                        <p style={{ margin:0, fontSize:11, color:days<=3?"#ef4444":"#9ca3af" }}>{days<=0?"Due today":`${days}d left`}</p>
                      </div>
                      <span style={{ fontWeight:600, fontSize:13 }}>{fmt(p.amount)}</span>
                    </div>
                  );
                })}
                {!data.upcomingPayments.filter(p=>!p.paid).length && <p style={{ color:"#9ca3af", fontSize:13, margin:0 }}>All paid up ✓</p>}
              </div>
              <div style={card}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <p style={{ margin:0, fontWeight:700, fontSize:14 }}>Savings</p>
                  <span style={{ fontSize:13, color:"#9ca3af" }}>{fmt(data.savings)} / {fmt(data.savingsGoal)}</span>
                </div>
                <div style={{ background:"#f3f4f6", borderRadius:6, height:8, overflow:"hidden" }}>
                  <div style={{ width:`${savePct}%`, height:"100%", background:"#d4f04e", borderRadius:6 }} />
                </div>
                <p style={{ margin:"8px 0 0", fontSize:12, color:"#9ca3af" }}>{savePct.toFixed(0)}% of monthly goal</p>
              </div>
              <div style={card}>
                <p style={{ margin:"0 0 12px", fontWeight:700, fontSize:14 }}>Borrow & Lend</p>
                <div style={{ display:"flex", gap:10 }}>
                  {[{label:"You're Owed",val:fmt(totalLent)},{label:"You Owe",val:fmt(totalBorrowed)}].map(s=>(
                    <div key={s.label} style={{ flex:1, background:"#f9fafb", borderRadius:10, padding:"10px 12px", border:"1px solid #e5e7eb" }}>
                      <p style={{ margin:"0 0 2px", fontSize:11, color:"#9ca3af", fontWeight:600 }}>{s.label}</p>
                      <p style={{ margin:0, fontWeight:700, fontSize:16 }}>{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === "transactions" && (
          <div style={card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <p style={{ margin:0, fontWeight:700, fontSize:14 }}>All Transactions</p>
              <button onClick={()=>setModal("tx")} style={btn("#111827","#d4f04e")}>+ Add</button>
            </div>
            {data.transactions.map(t => {
              const c = getCat(t.category);
              return (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:"1px solid #f3f4f6" }}>
                  <span style={{ background:"#f3f4f6", width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{c.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontWeight:600, fontSize:14 }}>{t.name}</p>
                    <p style={{ margin:0, fontSize:12, color:"#9ca3af" }}>{t.category} · {new Date(t.date).toLocaleDateString("en-PK",{day:"numeric",month:"short"})}</p>
                  </div>
                  <p style={{ margin:0, fontWeight:700, fontSize:14, color:t.type==="income"?"#16a34a":"#374151" }}>{t.type==="income"?"+":"−"}{fmt(t.amount)}</p>
                  <button onClick={()=>deleteTx(t.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#d1d5db", fontSize:14, padding:"0 2px", fontFamily:"inherit" }}>✕</button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === "payments" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <p style={{ margin:0, fontWeight:700, fontSize:14 }}>Payment Reminders</p>
              <button onClick={()=>setModal("pay")} style={btn("#111827","#d4f04e")}>+ Add</button>
            </div>
            <div style={{ display:"grid", gap:10 }}>
              {data.upcomingPayments.map(p => {
                const days = daysUntil(p.dueDate);
                const c = getCat(p.category);
                const urgent = !p.paid && days <= 3;
                return (
                  <div key={p.id} style={{ ...card, display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderLeft:`3px solid ${p.paid?"#e5e7eb":urgent?"#ef4444":"#d4f04e"}` }}>
                    <span style={{ background:"#f3f4f6", width:38, height:38, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, opacity:p.paid?0.4:1 }}>{c.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:0, fontWeight:600, fontSize:14, color:p.paid?"#9ca3af":"#111827", textDecoration:p.paid?"line-through":"none" }}>{p.name}</p>
                      <p style={{ margin:0, fontSize:12, color:p.paid?"#9ca3af":urgent?"#ef4444":"#9ca3af" }}>
                        {p.paid?"Paid":days<=0?"Due today":days<0?`${Math.abs(days)}d overdue`:`Due in ${days}d · ${new Date(p.dueDate).toLocaleDateString("en-PK",{day:"numeric",month:"short"})}`}
                      </p>
                    </div>
                    <span style={{ fontWeight:700, fontSize:15, color:p.paid?"#9ca3af":"#111827", marginRight:8 }}>{fmt(p.amount)}</span>
                    {!p.paid && <button onClick={()=>markPaid(p.id)} style={{ ...btn("#f3f4f6","#374151"), padding:"6px 12px", fontSize:12 }}>Paid ✓</button>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BORROW & LEND ── */}
        {tab === "lendings" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <p style={{ margin:0, fontWeight:700, fontSize:14 }}>Borrow & Lend</p>
              <button onClick={()=>setModal("lending")} style={btn("#111827","#d4f04e")}>+ New Entry</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
              {[{label:"You're Owed",val:fmt(totalLent)},{label:"You Owe",val:fmt(totalBorrowed)},{label:"Net",val:(totalLent-totalBorrowed<0?"−":"+")+fmt(Math.abs(totalLent-totalBorrowed))}].map(s=>(
                <div key={s.label} style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", border:"1px solid #e5e7eb" }}>
                  <p style={{ margin:"0 0 4px", fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{s.label}</p>
                  <p style={{ margin:0, fontWeight:700, fontSize:20 }}>{s.val}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>
              {[["all","All"],["lent","I Lent"],["borrowed","I Borrowed"]].map(([v,l])=>(
                <button key={v} onClick={()=>setLendFilter(v)} style={{ ...btn(lendFilter===v?"#111827":"#f3f4f6",lendFilter===v?"#d4f04e":"#6b7280"), padding:"6px 14px", fontSize:12 }}>{l}</button>
              ))}
            </div>
            <div style={{ display:"grid", gap:10 }}>
              {!filteredLendings.length && <div style={{ ...card, textAlign:"center", padding:"40px", color:"#9ca3af", fontSize:14 }}>No entries yet</div>}
              {filteredLendings.map(l => {
                const isLent = l.type === "lent";
                return (
                  <div key={l.id} style={{ ...card, display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderLeft:`3px solid ${l.settled?"#e5e7eb":isLent?"#d4f04e":"#374151"}` }}>
                    <Avatar name={l.person} size={38} />
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <p style={{ margin:0, fontWeight:600, fontSize:14, color:l.settled?"#9ca3af":"#111827", textDecoration:l.settled?"line-through":"none" }}>{l.person}</p>
                        <span style={{ fontSize:11, fontWeight:600, color:"#6b7280", background:"#f3f4f6", borderRadius:6, padding:"1px 7px" }}>{isLent?"Lent":"Borrowed"}</span>
                        {l.settled && <span style={{ fontSize:11, color:"#9ca3af", background:"#f3f4f6", borderRadius:6, padding:"1px 7px" }}>Settled</span>}
                      </div>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:"#9ca3af" }}>{new Date(l.date).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}{l.note&&` · ${l.note}`}</p>
                    </div>
                    <span style={{ fontWeight:700, fontSize:15, color:l.settled?"#9ca3af":"#111827", marginRight:6 }}>{isLent?"+":"−"}{fmt(l.amount)}</span>
                    {!l.settled && <button onClick={()=>settleLend(l.id)} style={{ ...btn("#f3f4f6","#374151"), padding:"6px 12px", fontSize:12 }}>Settle</button>}
                    <button onClick={()=>deleteLend(l.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#d1d5db", fontSize:14, padding:"0 2px", fontFamily:"inherit" }}>✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── KAMEETI ── */}
        {tab === "kameeti" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div>
                <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:14 }}>Kameeti Circles</p>
                <p style={{ margin:0, fontSize:12, color:"#9ca3af" }}>Track contributions and payouts for each committee</p>
              </div>
              <button onClick={()=>setModal("kameeti")} style={btn("#111827","#d4f04e")}>+ New Kameeti</button>
            </div>
            {kameetis.length > 0 && (() => {
              const totalMonthlyDue = kameetis.reduce((s,k)=>s+k.monthlyAmount,0);
              const totalReceived   = kameetis.flatMap(k=>k.received||[]).reduce((s,r)=>s+r.amount,0);
              const totalStillOwed  = kameetis.reduce((s,k) => {
                const paid = k.monthlyPayments.filter(m=>m.paid).length * k.monthlyAmount;
                return s + (k.received||[]).filter(r=>r.stillOwes).reduce((ss,r)=>ss+Math.max(0,r.amount-paid),0);
              }, 0);
              return (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
                  {[{label:"Monthly Due",val:fmt(totalMonthlyDue)},{label:"Total Received",val:fmt(totalReceived)},{label:"Still Owe Back",val:fmt(totalStillOwed)}].map(s=>(
                    <div key={s.label} style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", border:"1px solid #e5e7eb" }}>
                      <p style={{ margin:"0 0 4px", fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{s.label}</p>
                      <p style={{ margin:0, fontWeight:700, fontSize:20 }}>{s.val}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
            {!kameetis.length && (
              <div style={{ ...card, textAlign:"center", padding:"48px 24px" }}>
                <p style={{ fontSize:32, margin:"0 0 8px" }}>🤝</p>
                <p style={{ fontWeight:600, margin:"0 0 4px" }}>No Kameeti added yet</p>
                <p style={{ color:"#9ca3af", fontSize:13, margin:0 }}>Add a rotating savings circle to track contributions and payouts</p>
              </div>
            )}
            <div style={{ display:"grid", gap:12 }}>
              {kameetis.map(k => <KameetiCard key={k.id} k={k} onMarkPaid={kMarkPaid} onMarkReceived={kMarkReceived} onToggleOwed={kToggleOwed} onDelete={kDelete} />)}
            </div>
          </div>
        )}

        {/* ── SAVINGS ── */}
        {tab === "savings" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ ...card, gridColumn:"1 / -1", background:"#111827", padding:"32px 28px" }}>
              <p style={{ color:"#6b7280", fontSize:11, fontWeight:600, margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"1px" }}>Total Savings</p>
              <p style={{ color:"#d4f04e", fontSize:48, fontWeight:700, margin:"0 0 20px", letterSpacing:"-1px", lineHeight:1 }}>{fmt(data.savings)}</p>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:6, height:10, overflow:"hidden", maxWidth:480 }}>
                <div style={{ width:`${savePct}%`, height:"100%", background:"#d4f04e", borderRadius:6 }} />
              </div>
              <p style={{ color:"#6b7280", fontSize:13, margin:"8px 0 0" }}>{savePct.toFixed(0)}% of {fmt(data.savingsGoal)} goal</p>
            </div>
            <div style={card}>
              <p style={{ margin:"0 0 14px", fontWeight:700, fontSize:14 }}>Quick Save</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[1000,2000,5000,10000].map(amt=>(
                  <button key={amt} onClick={()=>quickSave(amt)}
                    style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:10, padding:"13px 8px", fontWeight:600, fontSize:14, color:"#111827", cursor:"pointer", fontFamily:"inherit" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="#d4f04e";e.currentTarget.style.borderColor="#d4f04e";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#f3f4f6";e.currentTarget.style.borderColor="#e5e7eb";}}>
                    + {fmt(amt)}
                  </button>
                ))}
              </div>
            </div>
            <div style={card}>
              <p style={{ margin:"0 0 14px", fontWeight:700, fontSize:14 }}>Monthly Goal</p>
              <input type="number" defaultValue={data.savingsGoal} onChange={e=>setData(d=>({...d,savingsGoal:+e.target.value||d.savingsGoal}))} style={inputSt} placeholder="Set savings goal" />
              <div style={{ background:"#f9fafb", borderRadius:10, padding:"12px 14px", border:"1px solid #e5e7eb" }}>
                <p style={{ margin:0, fontSize:13 }}>Still needed: <strong>{fmt(Math.max(0,data.savingsGoal-data.savings))}</strong></p>
              </div>
            </div>
            <div style={{ ...card, gridColumn:"1 / -1" }}>
              <p style={{ margin:"0 0 14px", fontWeight:700, fontSize:14 }}>Monthly Summary</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
                {[
                  {label:"Income",val:fmt(totalIncome)},
                  {label:"Expenses",val:fmt(totalExpenses)},
                  {label:"Pending Bills",val:fmt(pendingBills)},
                  {label:"Savings Rate",val:`${totalIncome?((data.savings/totalIncome)*100).toFixed(1):0}%`},
                  {label:"Net Balance",val:(balance<0?"−":"")+fmt(balance)},
                  {label:"After Bills",val:(projected<0?"−":"")+fmt(projected)},
                ].map(s=>(
                  <div key={s.label} style={{ background:"#f9fafb", borderRadius:10, padding:"12px 14px", border:"1px solid #e5e7eb" }}>
                    <p style={{ margin:"0 0 3px", fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{s.label}</p>
                    <p style={{ margin:0, fontWeight:700, fontSize:18 }}>{s.val}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 16px", borderRadius:10, background:"#f9fafb", border:"1px solid #e5e7eb" }}>
                <p style={{ margin:0, fontSize:13 }}>
                  {projected>=data.savingsGoal?`✅ On track — ${fmt(projected-data.savingsGoal)} extra beyond your goal this month.`:`⚠️ After bills you'll have ${fmt(projected)} left. Cut back to hit your ${fmt(data.savingsGoal)} goal.`}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Modal: Settings */}
      {modal === "settings" && (
        <Modal title="Settings" onClose={()=>setModal(null)}>
          {/* Categories */}
          <p style={{ margin:"0 0 12px", fontWeight:700, fontSize:14 }}>Categories</p>
          <div style={{ display:"grid", gap:7, marginBottom:16, maxHeight:220, overflowY:"auto" }}>
            {cats.map(c => (
              <div key={c.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"9px 12px" }}>
                <span style={{ display:"flex", alignItems:"center", gap:9, fontSize:14, fontWeight:500 }}>
                  <span style={{ fontSize:18 }}>{c.icon}</span>{c.name}
                </span>
                {c.name==="Other"
                  ? <span style={{ fontSize:11, color:"#d1d5db" }}>default</span>
                  : <button onClick={()=>removeCategory(c.name)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:15, padding:"0 2px", fontFamily:"inherit" }}>✕</button>
                }
              </div>
            ))}
          </div>
          <p style={{ margin:"0 0 6px", fontWeight:600, fontSize:13, color:"#374151" }}>Add a new category</p>
          <div style={{ display:"flex", gap:8, marginBottom:6 }}>
            <input value={newCat.icon} onChange={e=>setNewCat(d=>({...d,icon:e.target.value}))} style={{ ...inputSt, width:60, marginBottom:0, textAlign:"center", fontSize:18 }} placeholder="📌" />
            <input value={newCat.name} onChange={e=>{setNewCat(d=>({...d,name:e.target.value}));setCatError("");}} style={{ ...inputSt, flex:1, marginBottom:0 }} placeholder="Category name" />
            <button onClick={addCategory} style={{ ...btn("#111827","#d4f04e"), padding:"0 14px", whiteSpace:"nowrap" }}>Add</button>
          </div>
          {catError && <p style={{ margin:"0 0 12px", fontSize:12, color:"#ef4444" }}>{catError}</p>}

          <div style={{ borderTop:"1px solid #f3f4f6", margin:"16px 0" }} />

          {/* Danger zone */}
          <p style={{ margin:"0 0 6px", fontWeight:700, fontSize:14 }}>Reset Data</p>
          <p style={{ margin:"0 0 12px", fontSize:12, color:"#9ca3af" }}>Wipe everything and start fresh. Cannot be undone.</p>
          <button onClick={() => { if(window.confirm("Reset all data? This cannot be undone.")) { localStorage.removeItem(STORAGE_KEY); setData(defaultData); setTab("overview"); setModal(null); notify("All data reset"); } }} style={{ ...btn("#fef2f2","#ef4444"), border:"1px solid #fecaca", padding:"9px 20px" }}>Reset All Data</button>
        </Modal>
      )}

      {/* Modal: Profile */}
      {modal === "profile" && profileDraft && (
        <Modal title="My Profile" onClose={()=>setModal(null)}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#d4f04e", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:26, color:"#111827" }}>
              {profileDraft.name ? profileDraft.name.trim()[0].toUpperCase() : "?"}
            </div>
          </div>
          <Label>Your Name</Label>
          <input value={profileDraft.name} onChange={e=>setProfileDraft(d=>({...d,name:e.target.value}))} style={inputSt} placeholder="e.g. Ali Hassan" />
          <Label>Monthly Income (₨)</Label>
          <input type="number" value={profileDraft.monthlyIncome} onChange={e=>setProfileDraft(d=>({...d,monthlyIncome:e.target.value}))} style={inputSt} placeholder="e.g. 150000" />
          <Label>Currency</Label>
          <select value={profileDraft.currency} onChange={e=>setProfileDraft(d=>({...d,currency:e.target.value}))} style={inputSt}>
            <option value="PKR">🇵🇰 PKR — Pakistani Rupee</option>
            <option value="USD">🇺🇸 USD — US Dollar</option>
            <option value="GBP">🇬🇧 GBP — British Pound</option>
            <option value="AED">🇦🇪 AED — UAE Dirham</option>
            <option value="SAR">🇸🇦 SAR — Saudi Riyal</option>
          </select>
          {profileDraft.monthlyIncome && (
            <div style={{ background:"#f9fafb", borderRadius:10, padding:"12px 14px", border:"1px solid #e5e7eb", marginBottom:12 }}>
              <p style={{ margin:"0 0 2px", fontSize:12, color:"#9ca3af", fontWeight:600 }}>Savings rate based on your income</p>
              <p style={{ margin:0, fontWeight:700, fontSize:15 }}>
                {((data.savings / +profileDraft.monthlyIncome) * 100).toFixed(1)}% saved this month
              </p>
            </div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={() => {
              const updated = { ...profileDraft };
              setProfile(updated);
              try { localStorage.setItem("mera_paisa_profile", JSON.stringify(updated)); } catch {}
              setModal(null); notify("Profile saved");
            }} style={{ ...btn("#111827","#d4f04e"), flex:1, padding:12, fontSize:14 }}>Save Profile</button>
            <button onClick={()=>setModal(null)} style={{ ...btn("#f3f4f6","#374151"), flex:1, padding:12, fontSize:14 }}>Cancel</button>
          </div>
        </Modal>
      )}
      </div>

      {/* Modal: Transaction */}
      {modal === "tx" && (
        <Modal title="Add Transaction" onClose={()=>setModal(null)}>
          <Label>Description</Label>
          <input value={newTx.name} onChange={e=>setNewTx(d=>({...d,name:e.target.value}))} style={inputSt} placeholder="e.g. Groceries" />
          <Label>Amount (₨)</Label>
          <input type="number" value={newTx.amount} onChange={e=>setNewTx(d=>({...d,amount:e.target.value}))} style={inputSt} placeholder="e.g. 5000" />
          <Label>Type</Label>
          <select value={newTx.type} onChange={e=>setNewTx(d=>({...d,type:e.target.value}))} style={inputSt}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <Label>Category</Label>
          <CatSelect value={newTx.category} onChange={e=>setNewTx(d=>({...d,category:e.target.value}))} />
          <Label>Date</Label>
          <input type="date" value={newTx.date} onChange={e=>setNewTx(d=>({...d,date:e.target.value}))} style={inputSt} />
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={addTx}             style={{ ...btn("#111827","#d4f04e"), flex:1, padding:12, fontSize:14 }}>Add Transaction</button>
            <button onClick={()=>setModal(null)} style={{ ...btn("#f3f4f6","#374151"),  flex:1, padding:12, fontSize:14 }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Modal: Payment */}
      {modal === "pay" && (
        <Modal title="Add Payment Reminder" onClose={()=>setModal(null)}>
          <Label>Payment Name</Label>
          <input value={newPay.name} onChange={e=>setNewPay(d=>({...d,name:e.target.value}))} style={inputSt} placeholder="e.g. Electricity Bill" />
          <Label>Amount (₨)</Label>
          <input type="number" value={newPay.amount} onChange={e=>setNewPay(d=>({...d,amount:e.target.value}))} style={inputSt} placeholder="e.g. 4500" />
          <Label>Due Date</Label>
          <input type="date" value={newPay.dueDate} onChange={e=>setNewPay(d=>({...d,dueDate:e.target.value}))} style={inputSt} />
          <Label>Category</Label>
          <CatSelect value={newPay.category} onChange={e=>setNewPay(d=>({...d,category:e.target.value}))} />
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={addPay}             style={{ ...btn("#111827","#d4f04e"), flex:1, padding:12, fontSize:14 }}>Add Reminder</button>
            <button onClick={()=>setModal(null)} style={{ ...btn("#f3f4f6","#374151"),  flex:1, padding:12, fontSize:14 }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Modal: Borrow & Lend */}
      {modal === "lending" && (
        <Modal title="Borrow & Lend" onClose={()=>setModal(null)}>
          <div style={{ display:"flex", background:"#f3f4f6", borderRadius:10, padding:3, marginBottom:16 }}>
            {[["lent","I Lent Money"],["borrowed","I Borrowed Money"]].map(([v,l])=>(
              <button key={v} onClick={()=>setNewLend(d=>({...d,type:v}))}
                style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit", background:newLend.type===v?"#111827":"transparent", color:newLend.type===v?"#d4f04e":"#9ca3af" }}>
                {l}
              </button>
            ))}
          </div>
          <Label>Person's Name</Label>
          <input value={newLend.person} onChange={e=>setNewLend(d=>({...d,person:e.target.value}))} style={inputSt} placeholder="e.g. Ahmed Bhai" />
          <Label>Amount (₨)</Label>
          <input type="number" value={newLend.amount} onChange={e=>setNewLend(d=>({...d,amount:e.target.value}))} style={inputSt} placeholder="e.g. 10000" />
          <Label>Date</Label>
          <input type="date" value={newLend.date} onChange={e=>setNewLend(d=>({...d,date:e.target.value}))} style={inputSt} />
          <Label>Note (optional)</Label>
          <input value={newLend.note} onChange={e=>setNewLend(d=>({...d,note:e.target.value}))} style={inputSt} placeholder="e.g. For car repair" />
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={addLending}         style={{ ...btn("#111827","#d4f04e"), flex:1, padding:12, fontSize:14 }}>Add Entry</button>
            <button onClick={()=>setModal(null)} style={{ ...btn("#f3f4f6","#374151"),  flex:1, padding:12, fontSize:14 }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Modal: Kameeti */}
      {modal === "kameeti" && (
        <Modal title="Add Kameeti" onClose={()=>setModal(null)}>
          <Label>Committee Name</Label>
          <input value={newK.name} onChange={e=>setNewK(d=>({...d,name:e.target.value}))} style={inputSt} placeholder="e.g. Gali Wali Kameeti" />
          <Label>Monthly Contribution (₨)</Label>
          <input type="number" value={newK.monthlyAmount} onChange={e=>setNewK(d=>({...d,monthlyAmount:e.target.value}))} style={inputSt} placeholder="e.g. 5000" />
          <Label>Total Months (no. of members)</Label>
          <input type="number" value={newK.totalMonths} onChange={e=>setNewK(d=>({...d,totalMonths:e.target.value}))} style={inputSt} placeholder="e.g. 10" />
          <Label>Start Date</Label>
          <input type="date" value={newK.startDate} onChange={e=>setNewK(d=>({...d,startDate:e.target.value}))} style={inputSt} />
          <Label>My Turn — which month I receive (0 = not assigned yet)</Label>
          <input type="number" value={newK.myTurn} onChange={e=>setNewK(d=>({...d,myTurn:e.target.value}))} style={inputSt} placeholder="e.g. 6" />
          {newK.monthlyAmount && newK.totalMonths && (
            <div style={{ background:"#f9fafb", borderRadius:10, padding:"10px 14px", border:"1px solid #e5e7eb", marginBottom:12 }}>
              <p style={{ margin:0, fontSize:13 }}>Total pool: <strong>₨{(+newK.monthlyAmount * +newK.totalMonths).toLocaleString()}</strong></p>
            </div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={addKameeti}         style={{ ...btn("#111827","#d4f04e"), flex:1, padding:12, fontSize:14 }}>Add Kameeti</button>
            <button onClick={()=>setModal(null)} style={{ ...btn("#f3f4f6","#374151"),  flex:1, padding:12, fontSize:14 }}>Cancel</button>
          </div>
        </Modal>
      )}

      <style>{`* { box-sizing: border-box; } input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }`}</style>
    </div>
  );
}