import { useState, useEffect } from "react";
import { Link } from "wouter";

const API = "https://web-production-26d78.up.railway.app";

type Assessment = {
  assessment_id: string;
  created_at: string;
  state: string;
  county: string;
  match_count: number;
  risk_flag_count: number;
};

export default function Admin() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "match_count" | "state">("created_at");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    fetch(`${API}/api/assessments?limit=500`)
      .then(r => r.json())
      .then(data => { setAssessments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Could not load data from backend."); setLoading(false); });
  }, []);

  const filtered = assessments
    .filter(a => {
      const q = search.toLowerCase();
      return !q || a.state?.toLowerCase().includes(q) || a.county?.toLowerCase().includes(q) || a.assessment_id?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let av: any = a[sortBy], bv: any = b[sortBy];
      if (sortBy === "created_at") { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      if (sortBy === "state") { av = av || ""; bv = bv || ""; return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av); }
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const totalMatches = assessments.reduce((s, a) => s + (a.match_count || 0), 0);
  const avgMatches = assessments.length ? (totalMatches / assessments.length).toFixed(1) : "0";
  const totalRisk = assessments.reduce((s, a) => s + (a.risk_flag_count || 0), 0);
  const stateCount = new Set(assessments.map(a => a.state).filter(Boolean)).size;

  const exportCSV = () => {
    const headers = ["Assessment ID", "Date", "State", "County", "Matches", "Risk Flags"];
    const rows = filtered.map(a => [
      a.assessment_id,
      new Date(a.created_at).toLocaleString(),
      a.state || "",
      a.county || "",
      a.match_count ?? 0,
      a.risk_flag_count ?? 0,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `benefitbridge_assessments_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const th: any = { padding: "10px 14px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
  const td: any = { padding: "12px 14px", fontSize: "14px", color: "#374151", borderBottom: "1px solid #F3F4F6" };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F9FAFB", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "#0F2044", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/"><span style={{ color: "white", fontWeight: "700", fontSize: "17px", cursor: "pointer" }}>BenefitBridge 50+</span></Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Admin Dashboard</span>
          <Link href="/screen"><span style={{ background: "#F59E0B", color: "#0F2044", padding: "7px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>Screener</span></Link>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 2rem" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0F2044", marginBottom: "4px" }}>Screener Submissions</h1>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>All assessments submitted through BenefitBridge 50+</p>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Screenings", value: assessments.length, color: "#0F2044" },
            { label: "Avg Benefit Matches", value: avgMatches, color: "#059669" },
            { label: "Total Risk Flags", value: totalRisk, color: "#DC2626" },
            { label: "States Covered", value: stateCount, color: "#7C3AED" },
          ].map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div style={{ background: "white", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as any }}>
          <input
            style={{ flex: 1, minWidth: "200px", padding: "9px 14px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", color: "#111827" }}
            placeholder="Search by state, county, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#6B7280" }}>{filtered.length} results</span>
            <button onClick={exportCSV} style={{ background: "#0F2044", color: "white", padding: "9px 18px", borderRadius: "8px", border: "none", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
              Export CSV
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#6B7280" }}>Loading assessments...</div>
          ) : error ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#DC2626" }}>{error}</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#6B7280" }}>No assessments found.</div>
          ) : (
            <div style={{ overflowX: "auto" as any }}>
              <table style={{ width: "100%", borderCollapse: "collapse" as any }}>
                <thead>
                  <tr>
                    <th style={th} onClick={() => toggleSort("created_at")} title="Sort by date">DATE {sortBy === "created_at" ? (sortDir === "desc" ? "▼" : "▲") : <span style={{opacity:0.3}}>⇅</span>}</th>
                    <th style={th} onClick={() => toggleSort("state")} title="Sort by state">STATE {sortBy === "state" ? (sortDir === "desc" ? "▼" : "▲") : <span style={{opacity:0.3}}>⇅</span>}</th>
                    <th style={th}>COUNTY</th>
                    <th style={th} onClick={() => toggleSort("match_count")} title="Sort by matches">MATCHES {sortBy === "match_count" ? (sortDir === "desc" ? "▼" : "▲") : <span style={{opacity:0.3}}>⇅</span>}</th>
                    <th style={th}>RISK FLAGS</th>
                    <th style={th}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a.assessment_id} style={{ background: i % 2 === 0 ? "white" : "#FAFAFA" }}>
                      <td style={td}>{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                      <td style={td}><span style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{a.state || "—"}</span></td>
                      <td style={td}>{a.county || "—"}</td>
                      <td style={td}><span style={{ background: "#F0FDF4", color: "#059669", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>{a.match_count ?? 0}</span></td>
                      <td style={td}>
                        {(a.risk_flag_count ?? 0) > 0
                          ? <span style={{ background: "#FEF2F2", color: "#DC2626", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>{a.risk_flag_count}</span>
                          : <span style={{ color: "#9CA3AF", fontSize: "12px" }}>—</span>
                        }
                      </td>
                      <td style={{ ...td, fontFamily: "monospace", fontSize: "11px", color: "#9CA3AF" }}>{a.assessment_id.slice(0, 8)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER NOTE */}
        <p style={{ marginTop: "16px", fontSize: "12px", color: "#9CA3AF", textAlign: "center" }}>
          Data from Railway backend. Assessments are anonymized — no PII stored.
        </p>
      </div>
    </div>
  );
}
