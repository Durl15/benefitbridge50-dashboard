import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

const API = "https://web-production-26d78.up.railway.app";

export default function Dashboard( ) {
  const [activeNav, setActiveNav] = useState("screener");
  const [apiStatus, setApiStatus] = useState("loading");
  const [resources, setResources] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ age: "", state: "", income: "", household_size: "" });
  const [screening, setScreening] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/health`).then(r => r.json()).then(() => setApiStatus("ok")).catch(() => setApiStatus("error"));
    fetch(`${API}/api/resources`).then(r => r.json()).then(setResources).catch(() => {});
    fetch(`${API}/api/assessments`).then(r => r.json()).then(setAssessments).catch(() => {});
  }, []);

  const handleScreen = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setScreening(null);
    try {
      const res = await fetch(`${API}/api/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: parseInt(form.age), state: form.state, annual_income: parseFloat(form.income), household_size: parseInt(form.household_size) }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setScreening(data);
      setAssessments(prev => [data, ...prev]);
    } catch { setError("Screening failed. Please try again."); }
    finally { setSubmitting(false); }
  };

  const nav = [
    { id: "screener", label: "Benefit Screener", icon: "🔍" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "history", label: "Assessments", icon: "📋" },
    { id: "status", label: "System Status", icon: "⚡" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif", background: "#f8f9fb" }}>
      <header style={{ background: "#0F2044", color: "white", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🌉</span>
          <strong style={{ fontSize: "18px" }}>BenefitBridge 50+</strong>
          <span style={{ opacity: 0.5, fontSize: "12px" }}>Project Dashboard</span>
        </div>
        <span style={{ fontSize: "12px", color: apiStatus === "ok" ? "#6EE7B7" : apiStatus === "error" ? "#FCA5A5" : "#FCD34D" }}>
          {apiStatus === "ok" ? "✓ API Live" : apiStatus === "error" ? "✗ API Offline" : "⟳ Checking..."}
        </span>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ background: "#162B52", width: "220px", padding: "1.5rem 0", display: "flex", flexDirection: "column" }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              style={{ background: activeNav === item.id ? "rgba(255,255,255,0.12)" : "transparent", borderLeft: activeNav === item.id ? "3px solid #F59E0B" : "3px solid transparent", color: "white", padding: "12px 20px", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer", border: "none", width: "100%" }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
          <div style={{ marginTop: "auto", padding: "1rem 1.5rem", color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>{assessments.length} assessments</div>
        </nav>

        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {activeNav === "screener" && (
            <div style={{ maxWidth: "600px" }}>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>Benefits Screener</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>Answer 4 questions to find benefits you may qualify for.</p>
              <form onSubmit={handleScreen} style={{ background: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  {[["age","Age","65"],["state","State (2-letter)","FL"],["income","Annual Income ($)","18000"],["household_size","Household Size","1"]].map(([key, label, ph]) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>{label}</label>
                      <input value={form[key]} onChange={e => setForm({...form, [key]: key === "state" ? e.target.value.toUpperCase() : e.target.value})}
                        placeholder={ph} required
                        style={{ width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>
                {error && <p style={{ color: "#EF4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
                <button type="submit" disabled={submitting}
                  style={{ background: submitting ? "#9CA3AF" : "#0F2044", color: "white", padding: "10px 24px", borderRadius: "8px", border: "none", fontWeight: "600", cursor: submitting ? "not-allowed" : "pointer", fontSize: "14px" }}>
                  {submitting ? "Screening..." : "Screen for Benefits"}
                </button>
              </form>
              {screening && (
                <div style={{ marginTop: "24px" }}>
                  <h3 style={{ color: "#0F2044", marginBottom: "12px" }}>{screening.eligible_programs?.length || 0} programs found</h3>
                  {(screening.eligible_programs || []).map((p, i) => (
                    <div key={i} style={{ background: "white", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: "4px solid #F59E0B" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "600", color: "#0F2044", fontSize: "14px" }}>{p.program_name || p}</span>
                        <span style={{ background: "#D1FAE5", color: "#065F46", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Eligible</span>
                      </div>
                      {p.category && <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>{p.category}</p>}
                    </div>
                  ))}
                  {(!screening.eligible_programs || !screening.eligible_programs.length) && <p style={{ color: "#9CA3AF", fontSize: "14px" }}>No programs matched. Try adjusting inputs.</p>}
                </div>
              )}
            </div>
          )}

          {activeNav === "resources" && (
            <div>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>Benefit Resources</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>{resources.length} official resources</p>
              {resources.map(r => (
                <div key={r.id} style={{ background: "white", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px", maxWidth: "700px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#0F2044" }}>{r.program_name}</div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{r.category} · {r.state}</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{r.description}</div>
                  </div>
                  <a href={r.official_url} target="_blank" rel="noopener noreferrer" style={{ color: "#F59E0B" }}>↗</a>
                </div>
              ))}
            </div>
          )}

          {activeNav === "history" && (
            <div>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>Assessment History</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>{assessments.length} on record</p>
              {assessments.length === 0 && <div style={{ background: "white", borderRadius: "10px", padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>No assessments yet. Run the screener.</div>}
              {assessments.map((a, i) => (
                <div key={a.id || i} style={{ background: "white", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", maxWidth: "700px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "600", fontSize: "14px", color: "#0F2044" }}>Age {a.age} · {a.state} · ${a.annual_income?.toLocaleString()}/yr · {a.household_size} person{a.household_size > 1 ? "s" : ""}</span>
                    <span style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{a.eligible_programs?.length || 0} programs</span>
                  </div>
                  {a.created_at && <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>{new Date(a.created_at).toLocaleString()}</p>}
                </div>
              ))}
            </div>
          )}

          {activeNav === "status" && (
            <div style={{ maxWidth: "600px" }}>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>System Status</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>Live deployment health</p>
              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {[
                  { label: "Backend API (Railway)", url: "https://web-production-26d78.up.railway.app", live: apiStatus === "ok" },
                  { label: "Frontend (Netlify )", url: "https://benefitbridge50-dashboard.netlify.app", live: true },
                  { label: "GitHub Backend", url: "https://github.com/Durl15/BenefitBridge50-backend", live: true },
                  { label: "GitHub Dashboard", url: "https://github.com/Durl15/benefitbridge50-dashboard", live: true },
                ].map((item, i, arr ) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "14px", color: "#0F2044" }}>{item.label}</div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#3B82F6" }}>{item.url}</a>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: item.live ? "#059669" : "#EF4444" }}>{item.live ? "✓ Live" : "✗ Offline"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}