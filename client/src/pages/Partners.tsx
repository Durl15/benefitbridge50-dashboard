import { useState } from "react";
import { Link } from "wouter";

const tiers = [
  { name: "Starter", price: "$99", period: "/month", desc: "Perfect for small nonprofits and senior centers", features: ["Up to 200 screenings/month","Branded screener link","Monthly CSV export","Email support"], cta: "Request Demo", highlight: false },
  { name: "Professional", price: "$249", period: "/month", desc: "For hospitals, health systems, and larger agencies", features: ["Unlimited screenings","White-label branding","Real-time CSV export","Dedicated onboarding","Priority support"], cta: "Request Demo", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For statewide networks and government agencies", features: ["Unlimited screenings","Full white-label + custom domain","API access","Bulk case manager tools","SLA + dedicated support"], cta: "Contact Us", highlight: false },
];

const useCases = [
  { org: "Senior Centers", icon: "SC", desc: "Screen walk-in clients in minutes instead of hours. Staff spend less time on paperwork and more time on care." },
  { org: "Hospitals & Health Systems", icon: "H+", desc: "Identify social determinants of health at discharge. Connect patients to SNAP, utility help, and housing support before they leave." },
  { org: "Area Agencies on Aging", icon: "AA", desc: "Equip case managers with a consistent screening tool that finds benefits they might otherwise miss." },
  { org: "Nonprofit Social Services", icon: "NP", desc: "Offer clients a free benefit check as part of intake. Build trust and demonstrate value from the first interaction." },
];

export default function Partners() {
  const [form, setForm] = useState({ name: "", org: "", email: "", phone: "", org_type: "", message: "", tier: "Professional" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/.netlify/functions/partner-contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setSubmitted(true); } else { setError(data.error || "Something went wrong."); }
    } catch { setError("Network error. Please try again or email us directly."); }
    finally { setSubmitting(false); }
  };

  const inp = { width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", color: "#111827", background: "white", boxSizing: "border-box" };
  const lbl = { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#1a1a2e", background: "white" }}>
      <nav style={{ background: "#0F2044", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/"><span style={{ color: "white", fontWeight: "700", fontSize: "17px", cursor: "pointer" }}>BenefitBridge 50+</span></Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/"><span style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", cursor: "pointer" }}>Home</span></Link>
          <Link href="/screen"><span style={{ background: "#F59E0B", color: "#0F2044", padding: "8px 18px", borderRadius: "6px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Try the Screener</span></Link>
        </div>
      </nav>
      <section style={{ background: "linear-gradient(135deg, #0F2044 0%, #162B52 100%)", color: "white", padding: "72px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#FCD34D", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "20px" }}>For Organizations</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "800", lineHeight: 1.2, marginBottom: "18px" }}>Help your clients find every benefit they deserve</h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "32px" }}>BenefitBridge 50+ gives your team an AI-powered screening tool that finds SNAP, Medicare savings, utility assistance, and hundreds more programs in under 3 minutes per client.</p>
          <a href="#contact" style={{ display: "inline-block", background: "#F59E0B", color: "#0F2044", padding: "14px 36px", borderRadius: "8px", textDecoration: "none", fontWeight: "800", fontSize: "16px" }}>Request a Free Demo</a>
        </div>
      </section>
      <section style={{ padding: "72px 2rem", background: "#F9FAFB" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2044", textAlign: "center", marginBottom: "12px" }}>Built for organizations like yours</h2>
          <p style={{ color: "#6B7280", textAlign: "center", marginBottom: "48px", fontSize: "15px" }}>From small nonprofits to statewide health systems</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {useCases.map((u, i) => (<div key={i} style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", gap: "16px", alignItems: "flex-start" }}><div style={{ background: "#0F2044", color: "white", borderRadius: "10px", padding: "10px 14px", fontWeight: "800", fontSize: "14px", flexShrink: 0 }}>{u.icon}</div><div><div style={{ fontWeight: "700", fontSize: "15px", color: "#0F2044", marginBottom: "6px" }}>{u.org}</div><div style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>{u.desc}</div></div></div>))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 2rem", background: "white" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "center" }}>
          {[{ num: "3 min", label: "Average screening time per client" },{ num: "6+", label: "Benefit programs matched on average" },{ num: "$400+", label: "Monthly value found per client on average" }].map((s, i) => (<div key={i} style={{ padding: "28px 16px", borderRadius: "12px", background: "#F9FAFB" }}><div style={{ fontSize: "36px", fontWeight: "800", color: "#0F2044" }}>{s.num}</div><div style={{ fontSize: "13px", color: "#6B7280", marginTop: "8px", lineHeight: 1.5 }}>{s.label}</div></div>))}
        </div>
      </section>

      <section style={{ padding: "72px 2rem", background: "#F9FAFB" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2044", textAlign: "center", marginBottom: "12px" }}>Simple, transparent pricing</h2>
          <p style={{ color: "#6B7280", textAlign: "center", marginBottom: "48px", fontSize: "15px" }}>No setup fees. Cancel anytime. All plans include a free 30-day trial.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {tiers.map((tier, i) => (<div key={i} style={{ background: tier.highlight ? "#0F2044" : "white", borderRadius: "16px", padding: "32px 24px", boxShadow: tier.highlight ? "0 8px 32px rgba(15,32,68,0.25)" : "0 2px 12px rgba(0,0,0,0.06)", border: tier.highlight ? "none" : "1px solid #E5E7EB", position: "relative" }}>{tier.highlight && <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#F59E0B", color: "#0F2044", padding: "4px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap" }}>Most Popular</div>}<div style={{ fontWeight: "700", fontSize: "16px", color: tier.highlight ? "white" : "#0F2044", marginBottom: "6px" }}>{tier.name}</div><div style={{ marginBottom: "8px" }}><span style={{ fontSize: "36px", fontWeight: "800", color: tier.highlight ? "#F59E0B" : "#0F2044" }}>{tier.price}</span><span style={{ fontSize: "14px", color: tier.highlight ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>{tier.period}</span></div><div style={{ fontSize: "13px", color: tier.highlight ? "rgba(255,255,255,0.7)" : "#6B7280", marginBottom: "24px", lineHeight: 1.5 }}>{tier.desc}</div><ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0" }}>{tier.features.map((f, j) => (<li key={j} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontSize: "14px", color: tier.highlight ? "rgba(255,255,255,0.85)" : "#374151" }}><span style={{ color: tier.highlight ? "#F59E0B" : "#059669", fontWeight: "700" }}>+</span> {f}</li>))}</ul><a href="#contact" style={{ display: "block", textAlign: "center", background: tier.highlight ? "#F59E0B" : "#0F2044", color: tier.highlight ? "#0F2044" : "white", padding: "12px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>{tier.cta}</a></div>))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: "72px 2rem", background: "white" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2044", marginBottom: "8px", textAlign: "center" }}>Request a free demo</h2>
          <p style={{ color: "#6B7280", textAlign: "center", marginBottom: "40px", fontSize: "15px" }}>We will reach out within 1 business day to schedule a 20-minute walkthrough.</p>
          {submitted ? (
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
              <div style={{ fontWeight: "700", fontSize: "18px", color: "#065F46", marginBottom: "8px" }}>Request received!</div>
              <div style={{ color: "#047857", fontSize: "14px" }}>We will be in touch within 1 business day.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#F9FAFB", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div><label style={lbl}>Your Name *</label><input style={inp} value={form.name} onChange={e=>sf("name",e.target.value)} required placeholder="Jane Smith" /></div>
                <div><label style={lbl}>Organization *</label><input style={inp} value={form.org} onChange={e=>sf("org",e.target.value)} required placeholder="Onondaga County Senior Center" /></div>
                <div><label style={lbl}>Work Email *</label><input style={inp} type="email" value={form.email} onChange={e=>sf("email",e.target.value)} required placeholder="jane@organization.org" /></div>
                <div><label style={lbl}>Phone (optional)</label><input style={inp} value={form.phone} onChange={e=>sf("phone",e.target.value)} placeholder="(555) 000-0000" /></div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Organization Type *</label>
                <select style={{ ...inp, background: "white" }} value={form.org_type} onChange={e=>sf("org_type",e.target.value)} required>
                  <option value="">Select type...</option>
                  <option value="senior_center">Senior Center</option>
                  <option value="hospital">Hospital / Health System</option>
                  <option value="aaa">Area Agency on Aging</option>
                  <option value="nonprofit">Nonprofit / Social Services</option>
                  <option value="government">Government Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Interested Plan</label>
                <select style={{ ...inp, background: "white" }} value={form.tier} onChange={e=>sf("tier",e.target.value)}>
                  <option value="Starter">Starter - $99/month</option>
                  <option value="Professional">Professional - $249/month</option>
                  <option value="Enterprise">Enterprise - Custom pricing</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={lbl}>Tell us about your needs (optional)</label>
                <textarea style={{ ...inp, minHeight: "90px", resize: "vertical" }} value={form.message} onChange={e=>sf("message",e.target.value)} placeholder="How many clients do you screen per month?" />
              </div>
              {error && <div style={{ marginBottom: "16px", padding: "12px", background: "#FEF2F2", color: "#DC2626", borderRadius: "8px", fontSize: "13px" }}>{error}</div>}
              <button type="submit" disabled={submitting} style={{ width: "100%", background: submitting ? "#9CA3AF" : "#0F2044", color: "white", padding: "14px", borderRadius: "8px", border: "none", fontWeight: "700", fontSize: "16px", cursor: submitting ? "not-allowed" : "pointer" }}>
                {submitting ? "Sending..." : "Request Free Demo"}
              </button>
              <p style={{ marginTop: "12px", fontSize: "12px", color: "#9CA3AF", textAlign: "center" }}>No commitment required. We will not spam you.</p>
            </form>
          )}
        </div>
      </section>

      <footer style={{ background: "#0F2044", color: "rgba(255,255,255,0.5)", padding: "24px 2rem", textAlign: "center", fontSize: "13px" }}>
        <div style={{ marginBottom: "8px" }}>
          <Link href="/"><span style={{ marginRight: "24px", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>BenefitBridge 50+</span></Link>
          <a href="mailto:contact@benefitbridge50.com" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", marginRight: "24px" }}>contact@benefitbridge50.com</a>
          <Link href="/screen"><span style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>Try the Screener</span></Link>
        </div>
        <div>2026 BenefitBridge 50+. Screening tool only - not a guarantee of eligibility.</div>
      </footer>
    </div>
  );
}
