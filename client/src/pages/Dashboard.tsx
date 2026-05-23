import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const defaultForm = {
  user_alias: "", age: "", state: "", county: "",
  household_size: "", monthly_income: "",
  housing_status: "stable", food_insecurity: false,
  medicare_status: "not_enrolled", disability_status: false,
  veteran_status: false, caregiving_role: "none",
  utility_help_needed: false, consent_to_process: false,
};

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("screener");
  const [apiStatus, setApiStatus] = useState("loading");
  const [resources, setResources] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [screening, setScreening] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/.netlify/functions/health").then(r=>r.json()).then(()=>setApiStatus("ok")).catch(()=>setApiStatus("error"));
    fetch("/.netlify/functions/resources").then(r=>r.json()).then(data=>setResources(Array.isArray(data)?data:[])).catch(()=>setResources([]));
    fetch("/.netlify/functions/assessments").then(r=>r.json()).then(data=>setAssessments(Array.isArray(data)?data:[])).catch(()=>setAssessments([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent_to_process) { setError("Please consent to processing"); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setScreening(data);
      setActiveNav("results");
    } catch (e) { setError("Screening failed. Please try again."); }
    finally { setSubmitting(false); }
  };

  const matches = screening?.matches || screening?.matches_json || [];
  const riskFlags = (screening?.risk_flags || []).filter(f => f);

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "16px 2rem", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "#0F2044" }}>BenefitBridge 50+</div>
          <div style={{ display: "flex", gap: "24px", fontSize: "14px", fontWeight: "600" }}>
            {["screener", "assessments", "status"].map(tab => (
              <button key={tab} onClick={() => setActiveNav(tab)} style={{ background: "none", border: "none", cursor: "pointer", color: activeNav === tab ? "#0F2044" : "#6B7280", borderBottom: activeNav === tab ? "2px solid #0F2044" : "none", paddingBottom: "4px" }}>
                {tab === "screener" ? "Screener" : tab === "assessments" ? "Assessments" : "Status"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 2rem" }}>
        {activeNav === "screener" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div style={{ background: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0F2044", marginBottom: "24px" }}>Screen for Benefits</h2>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input type="text" placeholder="Alias (optional)" value={form.user_alias} onChange={e => setForm({...form, user_alias: e.target.value})} style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }} />
                <input type="number" placeholder="Age *" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }} />
                <input type="text" placeholder="State (2-letter code) *" value={form.state} onChange={e => setForm({...form, state: e.target.value.toUpperCase()})} required maxLength="2" style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }} />
                <input type="text" placeholder="County (optional)" value={form.county} onChange={e => setForm({...form, county: e.target.value})} style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }} />
                <input type="number" placeholder="Household Size *" value={form.household_size} onChange={e => setForm({...form, household_size: e.target.value})} required style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }} />
                <input type="number" placeholder="Monthly Income ($) *" value={form.monthly_income} onChange={e => setForm({...form, monthly_income: e.target.value})} required style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }} />
                <select value={form.housing_status} onChange={e => setForm({...form, housing_status: e.target.value})} style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }}>
                  <option value="stable">Housing: Stable</option>
                  <option value="rent_burdened">Housing: Rent Burdened</option>
                  <option value="homeless">Housing: Homeless</option>
                </select>
                <select value={form.medicare_status} onChange={e => setForm({...form, medicare_status: e.target.value})} style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }}>
                  <option value="not_enrolled">Medicare: Not Enrolled</option>
                  <option value="enrolled">Medicare: Enrolled</option>
                </select>
                <select value={form.caregiving_role} onChange={e => setForm({...form, caregiving_role: e.target.value})} style={{ padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px" }}>
                  <option value="none">Caregiving: None</option>
                  <option value="primary">Caregiving: Primary</option>
                  <option value="secondary">Caregiving: Secondary</option>
                </select>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                  <input type="checkbox" checked={form.food_insecurity} onChange={e => setForm({...form, food_insecurity: e.target.checked})} />
                  Food Insecurity
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                  <input type="checkbox" checked={form.disability_status} onChange={e => setForm({...form, disability_status: e.target.checked})} />
                  Disability
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                  <input type="checkbox" checked={form.veteran_status} onChange={e => setForm({...form, veteran_status: e.target.checked})} />
                  Veteran
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                  <input type="checkbox" checked={form.utility_help_needed} onChange={e => setForm({...form, utility_help_needed: e.target.checked})} />
                  Utility Help Needed
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", background: "#F0FDF4", padding: "12px", borderRadius: "6px" }}>
                  <input type="checkbox" checked={form.consent_to_process} onChange={e => setForm({...form, consent_to_process: e.target.checked})} required />
                  I consent to processing my information to find benefits
                </label>
                {error && <div style={{ color: "#DC2626", fontSize: "14px" }}>{error}</div>}
                <button type="submit" disabled={submitting} style={{ background: "#0F2044", color: "white", padding: "12px", borderRadius: "6px", border: "none", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Screening..." : "Screen for Benefits"}
                </button>
              </form>
            </div>

            {screening && (
              <div style={{ background: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F2044", marginBottom: "16px" }}>Your Matched Benefits</h3>
                {matches.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {matches.map((m, i) => (
                      <div key={i} style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: "#0F2044" }}>{m.program_name || m.name || "Benefit"}</div>
                        <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>{m.description || "You may be eligible for this benefit"}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#6B7280", fontSize: "14px" }}>No matches found</div>
                )}
              </div>
            )}
          </div>
        )}

        {activeNav === "assessments" && (
          <div style={{ background: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0F2044", marginBottom: "24px" }}>All Assessments</h2>
            {assessments.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                    <th style={{ textAlign: "left", padding: "12px", fontWeight: "700", color: "#0F2044" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "12px", fontWeight: "700", color: "#0F2044" }}>State</th>
                    <th style={{ textAlign: "left", padding: "12px", fontWeight: "700", color: "#0F2044" }}>Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((a, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                      <td style={{ padding: "12px" }}>{new Date(a.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: "12px" }}>{a.state || "—"}</td>
                      <td style={{ padding: "12px" }}>{a.match_count ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: "#6B7280" }}>No assessments yet</div>
            )}
          </div>
        )}

        {activeNav === "status" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            <div style={{ background: apiStatus === "ok" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${apiStatus === "ok" ? "#86EFAC" : "#FECACA"}`, borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "4px" }}>Backend API</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: apiStatus === "ok" ? "#059669" : "#DC2626" }}>{apiStatus === "ok" ? "✓ Online" : "✗ Offline"}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}