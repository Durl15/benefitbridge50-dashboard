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

function buildClientActionPlan(matches: any[], form: any) {
  const highMatches = matches.filter((m: any) => m.confidence === "High");
  const medMatches = matches.filter((m: any) => m.confidence === "Medium");
  const allMatches = [...highMatches, ...medMatches, ...matches.filter((m: any) => m.confidence !== "High" && m.confidence !== "Medium")];

  const programNames = allMatches.map((m: any) => m.program_name).join(", ");
  const count = allMatches.length;

  const summary = `Based on your screening, you may qualify for ${count} benefit program${count !== 1 ? "s" : ""}: ${programNames}. Follow the steps below to begin applying. Start with your highest-confidence matches first.`;

  const checklist: string[] = [];

  checklist.push("Gather your documents: government-issued photo ID, Social Security card, proof of income (pay stubs, award letters, or bank statements), and proof of address (utility bill or lease).");

  if (form.medicare_status === "not_enrolled" || form.medicare_status === "approaching") {
    checklist.push("Contact Social Security at 1-800-772-1213 or visit ssa.gov to enroll in Medicare Parts A and B. Enrollment windows have deadlines — act promptly to avoid late penalties.");
  }

  if (highMatches.length > 0) {
    checklist.push(`Apply first for your highest-confidence matches: ${highMatches.map((m: any) => m.program_name).join(", ")}. These have the strongest eligibility indicators based on your profile.`);
  }

  if (form.food_insecurity) {
    checklist.push("Apply for SNAP (food assistance) online at benefits.gov or at your local Department of Social Services. Bring income and household documentation.");
  }

  if (form.utility_help_needed) {
    checklist.push("Apply for LIHEAP (utility assistance) through your state energy office. Visit liheap.acf.hhs.gov to find your local contact. Funds are limited and distributed seasonally.");
  }

  if (form.veteran_status) {
    checklist.push("Contact your local VA office or call 1-800-827-1000 to review all VA benefits you may qualify for, including healthcare, pension, and caregiver support.");
  }

  if (form.disability_status) {
    checklist.push("If not already enrolled, apply for SSI or SSDI at ssa.gov/benefits/disability or call 1-800-772-1213. Gather medical records and doctor contact information.");
  }

  if (form.housing_status === "rent_burdened" || form.housing_status === "risk_of_eviction" || form.housing_status === "unhoused") {
    checklist.push("Contact your local housing authority or 211 (dial 2-1-1) for emergency rental assistance, Section 8 housing vouchers, and eviction prevention programs.");
  }

  checklist.push("Contact your local Area Agency on Aging (AAA) for personalized navigation help. Find yours at eldercare.acl.gov or call 1-800-677-1116 — this service is free.");

  checklist.push("After applying, follow up with each agency within 2 weeks. Keep copies of all applications and note reference numbers and contact names.");

  if (medMatches.length > 0) {
    checklist.push(`Once your high-priority applications are submitted, apply for your medium-confidence matches: ${medMatches.map((m: any) => m.program_name).join(", ")}.`);
  }

  const official_links: Record<string, string>[] = [];
  allMatches.forEach((m: any) => {
    if (m.official_url) {
      official_links.push({ [m.program_name]: m.official_url });
    }
  });
  official_links.push({ "Benefits.gov (Federal Benefits Search)": "https://www.benefits.gov" });
  official_links.push({ "Eldercare Locator (Find Local Help)": "https://eldercare.acl.gov" });
  official_links.push({ "USA.gov Benefits for Older Adults": "https://www.usa.gov/benefits-for-older-adults" });

  const fraud_warnings = [
    "Government agencies never charge fees to apply for benefits. If anyone asks for payment to process your application, it is a scam.",
    "Never share your Social Security number, bank account, or Medicare ID with unsolicited callers or door-to-door visitors.",
    "Apply only through official .gov websites or in person at verified agency offices. Avoid third-party sites that charge for free government services.",
    "If you suspect fraud, call the Senior Medicare Patrol at 1-877-808-2468 or report to the FTC at reportfraud.ftc.gov.",
  ];

  const disclaimer = "This action plan is generated from your screening responses and matched programs. It is a guide only and does not guarantee eligibility. Always verify requirements directly with each agency.";

  return { summary, checklist, official_links, fraud_warnings, disclaimer, ai_generated: false };
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("screener");
  const [apiStatus, setApiStatus] = useState("loading");
  const [resources, setResources] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ ...defaultForm });
  const [screening, setScreening] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [actionPlan, setActionPlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  useEffect(() => {
    fetch("/.netlify/functions/health").then(r => r.json()).then(() => setApiStatus("ok")).catch(() => setApiStatus("error"));
    fetch("/.netlify/functions/resources").then(r => r.json()).then(setResources).catch(() => {});
    fetch("/.netlify/functions/assessments").then(r => r.json()).then(setAssessments).catch(() => {});
  }, []);

  const sf = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleScreen = async (e: any) => {
    e.preventDefault();
    if (!form.consent_to_process) { setError("Please check consent to continue."); return; }
    setSubmitting(true); setError(""); setScreening(null); setActionPlan(null); setPlanError("");
    try {
      const res = await fetch("/.netlify/functions/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_alias: form.user_alias || "Anonymous",
          age: parseInt(form.age),
          state: form.state,
          county: form.county || null,
          household_size: parseInt(form.household_size),
          monthly_income: parseFloat(form.monthly_income),
          housing_status: form.housing_status,
          food_insecurity: form.food_insecurity,
          medicare_status: form.medicare_status,
          disability_status: form.disability_status,
          veteran_status: form.veteran_status,
          caregiving_role: form.caregiving_role,
          utility_help_needed: form.utility_help_needed,
          consent_to_process: true,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        const detail = err.detail;
        if (Array.isArray(detail)) {
          throw new Error(detail.map((d: any) => `${d.loc?.slice(-1)[0]}: ${d.msg}`).join("; "));
        }
        throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
      }
      const data = await res.json();
      setScreening(data);
      fetch("/.netlify/functions/assessments").then(r => r.json()).then(setAssessments).catch(() => {});
      setActiveNav("results");
    } catch (err: any) {
      setError("Error: " + (err.message || "Please check all fields."));
    } finally { setSubmitting(false); }
  };

  const handleGetActionPlan = async () => {
    if (!screening?.assessment_id) return;
    setPlanLoading(true); setPlanError(""); setActionPlan(null);
    try {
      const res = await fetch("/.netlify/functions/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: screening.assessment_id,
          reading_level: "plain",
          language: "en",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.error) {
          setActionPlan(data);
          return;
        }
      }
      // Backend unavailable — use client-side plan
      const plan = buildClientActionPlan(screening.matches || [], form);
      setActionPlan(plan);
    } catch {
      const plan = buildClientActionPlan(screening.matches || [], form);
      setActionPlan(plan);
    } finally { setPlanLoading(false); }
  };

  const nav = [
    { id: "screener", label: "Benefit Screener", icon: "+" },
    { id: "results", label: "Results", icon: "*", hidden: !screening },
    { id: "resources", label: "Resources", icon: "#" },
    { id: "history", label: "Assessments", icon: "=" },
    { id: "status", label: "System Status", icon: "!" },
  ];

  const inpStyle = { width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" as any, color: "#111827", background: "white" };
  const selStyle = { ...inpStyle, background: "white" };
  const lblStyle = { display: "block", fontSize: "13px", fontWeight: "600" as any, color: "#374151", marginBottom: "4px" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif", background: "#f8f9fb" }}>
      <header style={{ background: "#0F2044", color: "white", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <strong style={{ fontSize: "18px" }}>BenefitBridge 50+</strong>
          <span style={{ opacity: 0.5, fontSize: "12px" }}>Live Dashboard</span>
        </div>
        <span style={{ fontSize: "12px", color: apiStatus === "ok" ? "#6EE7B7" : apiStatus === "error" ? "#FCA5A5" : "#FCD34D" }}>
          {apiStatus === "ok" ? "Online" : apiStatus === "error" ? "Offline" : "Checking..."}
        </span>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ background: "#162B52", width: "220px", padding: "1.5rem 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {nav.filter(n => !n.hidden).map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              style={{ background: activeNav === item.id ? "rgba(255,255,255,0.12)" : "transparent", borderLeft: activeNav === item.id ? "3px solid #F59E0B" : "3px solid transparent", color: "white", padding: "12px 20px", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer", border: "none", width: "100%" }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
          <div style={{ marginTop: "auto", padding: "1rem 1.5rem", color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>{assessments.length} assessments</div>
        </nav>

        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>

          {activeNav === "screener" && (
            <div style={{ maxWidth: "700px" }}>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>Benefits Screener</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>Find benefits you may qualify for. No personal data is stored.</p>
              <form onSubmit={handleScreen} style={{ background: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={lblStyle}>Alias (optional)</label>
                    <input style={inpStyle} value={form.user_alias} onChange={e => sf("user_alias", e.target.value)} placeholder="e.g. Don J." />
                  </div>
                  <div>
                    <label style={lblStyle}>Age *</label>
                    <input style={inpStyle} type="number" value={form.age} onChange={e => sf("age", e.target.value)} required min="50" max="120" placeholder="68" />
                  </div>
                  <div>
                    <label style={lblStyle}>State (2-letter) *</label>
                    <input style={inpStyle} value={form.state} onChange={e => sf("state", e.target.value.toUpperCase().slice(0,2))} required placeholder="NY" maxLength={2} />
                  </div>
                  <div>
                    <label style={lblStyle}>County (optional)</label>
                    <input style={inpStyle} value={form.county} onChange={e => sf("county", e.target.value)} placeholder="e.g. Onondaga" />
                  </div>
                  <div>
                    <label style={lblStyle}>Household Size *</label>
                    <input style={inpStyle} type="number" value={form.household_size} onChange={e => sf("household_size", e.target.value)} required min="1" max="20" placeholder="1" />
                  </div>
                  <div>
                    <label style={lblStyle}>Monthly Income ($) *</label>
                    <input style={inpStyle} type="number" value={form.monthly_income} onChange={e => sf("monthly_income", e.target.value)} required min="0" placeholder="1500" />
                  </div>
                  <div>
                    <label style={lblStyle}>Housing Status *</label>
                    <select style={selStyle} value={form.housing_status} onChange={e => sf("housing_status", e.target.value)} required>
                      <option value="stable">Stable housing</option>
                      <option value="homeowner">Homeowner</option>
                      <option value="rent_burdened">Rent-burdened</option>
                      <option value="risk_of_eviction">Risk of eviction</option>
                      <option value="unhoused">Unhoused / homeless</option>
                    </select>
                  </div>
                  <div>
                    <label style={lblStyle}>Medicare Status *</label>
                    <select style={selStyle} value={form.medicare_status} onChange={e => sf("medicare_status", e.target.value)} required>
                      <option value="not_enrolled">Not enrolled</option>
                      <option value="approaching">Approaching eligibility</option>
                      <option value="enrolled">Enrolled (Part A &amp; B)</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                  <div>
                    <label style={lblStyle}>Caregiving Role *</label>
                    <select style={selStyle} value={form.caregiving_role} onChange={e => sf("caregiving_role", e.target.value)} required>
                      <option value="none">None</option>
                      <option value="caregiver">Caregiver</option>
                      <option value="care_recipient">Care recipient</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  {([["food_insecurity", "Food insecurity"], ["disability_status", "Disability status"], ["veteran_status", "Veteran status"], ["utility_help_needed", "Utility help needed"]] as [string, string][]).map(([k, l]) => (
                    <label key={k} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#374151", cursor: "pointer" }}>
                      <input type="checkbox" checked={form[k]} onChange={e => sf(k, e.target.checked)} style={{ width: "16px", height: "16px" }} />
                      {l}
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: "16px", padding: "12px", background: "#FEF3C7", borderRadius: "8px", fontSize: "13px", color: "#92400E" }}>
                  Screening tool only. Results are not a guarantee of eligibility. Always verify with official agencies.
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#374151", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.consent_to_process} onChange={e => sf("consent_to_process", e.target.checked)} style={{ width: "16px", height: "16px" }} />
                  I consent to processing my responses for benefit screening
                </label>

                {error && <div style={{ marginTop: "12px", padding: "12px", background: "#FEF2F2", color: "#DC2626", borderRadius: "6px", fontSize: "13px", wordBreak: "break-word" as any }}>{error}</div>}

                <button type="submit" disabled={submitting}
                  style={{ marginTop: "20px", background: submitting ? "#9CA3AF" : "#0F2044", color: "white", padding: "10px 28px", borderRadius: "8px", border: "none", fontWeight: "600", cursor: submitting ? "not-allowed" : "pointer", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                  {submitting && <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />}
                  {submitting ? "Screening..." : "Screen for Benefits"}
                </button>
              </form>
            </div>
          )}

          {activeNav === "results" && screening && (
            <div style={{ maxWidth: "700px" }}>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>Your Results</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>{screening.matches?.length || 0} benefit programs matched</p>

              {(screening.risk_flags || []).length > 0 && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
                  <strong style={{ color: "#991B1B", fontSize: "14px" }}>Fraud Risk Flags</strong>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", fontSize: "13px", color: "#7F1D1D" }}>
                    {screening.risk_flags.map((f: string, i: number) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}

              {(screening.matches || []).map((m: any, i: number) => (
                <div key={i} style={{ background: "white", borderRadius: "10px", padding: "16px", marginBottom: "10px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `4px solid ${m.confidence === "High" ? "#059669" : m.confidence === "Medium" ? "#F59E0B" : "#6B7280"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <div>
                      <span style={{ fontWeight: "700", color: "#0F2044", fontSize: "15px" }}>{m.program_name}</span>
                      <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6B7280" }}>{m.category}</span>
                    </div>
                    <span style={{
                      background: m.confidence === "High" ? "#D1FAE5" : m.confidence === "Medium" ? "#FEF3C7" : "#F3F4F6",
                      color: m.confidence === "High" ? "#065F46" : m.confidence === "Medium" ? "#92400E" : "#374151",
                      padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" as any
                    }}>
                      {m.confidence} match
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#4B5563", marginBottom: "8px" }}>{m.reason}</p>
                  {m.next_steps?.length > 0 && (
                    <div>
                      <strong style={{ fontSize: "12px", color: "#374151" }}>Next steps:</strong>
                      <ul style={{ margin: "4px 0 0 0", paddingLeft: "18px", fontSize: "12px", color: "#6B7280" }}>
                        {m.next_steps.map((s: string, j: number) => <li key={j}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {m.official_url && (
                    <a href={m.official_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: "8px", fontSize: "12px", color: "#2563EB" }}>
                      Official site
                    </a>
                  )}
                </div>
              ))}

              {(!screening.matches || !screening.matches.length) && (
                <p style={{ color: "#9CA3AF", fontSize: "14px" }}>No matches found. Try adjusting your inputs.</p>
              )}

              {/* Action Plan Section */}
              <div style={{ marginTop: "28px", background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ color: "#0F2044", fontSize: "16px", fontWeight: "700", margin: 0 }}>Personalized Action Plan</h3>
                    <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px", marginBottom: 0 }}>
                      Step-by-step guidance to apply for your matched benefits
                    </p>
                  </div>
                  {!actionPlan && (
                    <button
                      onClick={handleGetActionPlan}
                      disabled={planLoading}
                      style={{
                        background: planLoading ? "#9CA3AF" : "#F59E0B",
                        color: "white",
                        padding: "8px 20px",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "600",
                        cursor: planLoading ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexShrink: 0,
                      }}>
                      {planLoading && <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />}
                      {planLoading ? "Generating..." : "Get Action Plan"}
                    </button>
                  )}
                </div>

                {!actionPlan && !planLoading && !planError && (
                  <div style={{ background: "#F0F9FF", borderRadius: "8px", padding: "16px", fontSize: "13px", color: "#0369A1" }}>
                    Click "Get Action Plan" to receive a personalized checklist for applying to your matched programs.
                  </div>
                )}

                {planLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", color: "#6B7280", fontSize: "14px" }}>
                    <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
                    Generating your personalized action plan...
                  </div>
                )}

                {planError && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#DC2626" }}>
                    {planError}
                    <button
                      onClick={handleGetActionPlan}
                      style={{ marginLeft: "12px", background: "transparent", border: "1px solid #DC2626", color: "#DC2626", padding: "2px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                      Retry
                    </button>
                  </div>
                )}

                {actionPlan && (
                  <div>
                    {actionPlan.summary && (
                      <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px", lineHeight: "1.6" }}>{actionPlan.summary}</p>
                    )}

                    {actionPlan.checklist?.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <strong style={{ fontSize: "13px", color: "#0F2044", display: "block", marginBottom: "8px" }}>Your Application Checklist</strong>
                        <ol style={{ margin: 0, paddingLeft: "20px" }}>
                          {actionPlan.checklist.map((step: string, i: number) => (
                            <li key={i} style={{ fontSize: "13px", color: "#374151", marginBottom: "8px", lineHeight: "1.6" }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {actionPlan.official_links?.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <strong style={{ fontSize: "13px", color: "#0F2044", display: "block", marginBottom: "8px" }}>Official Application Links</strong>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {actionPlan.official_links.map((linkObj: Record<string, string>, i: number) =>
                            Object.entries(linkObj).map(([name, url]) => (
                              <a key={`${i}-${name}`} href={url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: "13px", color: "#2563EB" }}>
                                {name}
                              </a>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {actionPlan.fraud_warnings?.length > 0 && (
                      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", padding: "12px 16px" }}>
                        <strong style={{ fontSize: "13px", color: "#92400E", display: "block", marginBottom: "6px" }}>Fraud Prevention Tips</strong>
                        <ul style={{ margin: 0, paddingLeft: "18px" }}>
                          {actionPlan.fraud_warnings.map((w: string, i: number) => (
                            <li key={i} style={{ fontSize: "12px", color: "#78350F", marginBottom: "4px" }}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {actionPlan.disclaimer && (
                      <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "12px" }}>{actionPlan.disclaimer}</p>
                    )}

                    <button
                      onClick={() => { setActionPlan(null); setPlanError(""); }}
                      style={{ marginTop: "12px", background: "transparent", border: "1px solid #D1D5DB", color: "#6B7280", padding: "4px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                      Refresh Plan
                    </button>
                  </div>
                )}
              </div>

              <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "16px" }}>{screening.disclaimer}</p>
              <button onClick={() => { setScreening(null); setForm({ ...defaultForm }); setActionPlan(null); setPlanError(""); setActiveNav("screener"); }}
                style={{ marginTop: "16px", background: "transparent", border: "1px solid #D1D5DB", color: "#374151", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
                New Screening
              </button>
            </div>
          )}

          {activeNav === "resources" && (
            <div>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>Benefit Resources</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>{resources.length} official resources</p>
              {resources.map((r: any, i: number) => (
                <div key={i} style={{ background: "white", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px", maxWidth: "700px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#0F2044" }}>{r.program_name}</div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{r.category} - {r.state}</div>
                    <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>{r.description}</div>
                  </div>
                  {r.official_url && <a href={r.official_url} target="_blank" rel="noopener noreferrer" style={{ color: "#F59E0B", fontSize: "18px", textDecoration: "none" }}>Link</a>}
                </div>
              ))}
            </div>
          )}

          {activeNav === "history" && (
            <div>
              <h2 style={{ color: "#0F2044", marginBottom: "4px" }}>Assessment History</h2>
              <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px" }}>{assessments.length} on record</p>
              {assessments.length === 0 && (
                <div style={{ background: "white", borderRadius: "10px", padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>No assessments yet. Run the screener.</div>
              )}
              {assessments.map((a: any, i: number) => (
                <div key={a.assessment_id || i} style={{ background: "white", borderRadius: "10px", padding: "12px 16px", marginBottom: "8px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", maxWidth: "700px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "600", fontSize: "14px", color: "#0F2044" }}>
                      {a.state || "Unknown"}{a.county ? ` - ${a.county}` : ""}
                    </span>
                    <span style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                      {a.match_count ?? 0} programs
                    </span>
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
                  { label: "Frontend (Netlify)", url: "https://benefitbridge50-dashboard.netlify.app", live: true },
                  { label: "Custom Domain", url: "https://benefitbridge50.com", live: true },
                  { label: "GitHub Dashboard", url: "https://github.com/Durl15/benefitbridge50-dashboard", live: true },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "14px", color: "#0F2044" }}>{item.label}</div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#3B82F6" }}>{item.url}</a>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: item.live ? "#059669" : "#EF4444" }}>{item.live ? "Live" : "Offline"}</span>
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
