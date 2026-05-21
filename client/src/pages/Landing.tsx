import { useState } from "react";
import { Link } from "wouter";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) { setSubmitted(true); }
      else { alert(data.error || "Something went wrong. Please try again."); }
    } catch { alert("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const stats = [
    { num: "10,000+", label: "Federal & state benefit programs" },
    { num: "50M+", label: "Americans 50+ leave benefits unclaimed" },
    { num: "Free", label: "No cost, no account required" },
  ];

  const steps = [
    { icon: "ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬Â¹", title: "Answer 10 questions", desc: "Tell us your age, income, location, and situation. Takes under 3 minutes." },
    { icon: "ÃƒÂ°Ã…Â¸Ã‚Â¤Ã¢â‚¬â€œ", title: "AI screens your eligibility", desc: "Our system checks hundreds of federal, state, and local programs instantly." },
    { icon: "ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦", title: "Get your matched benefits", desc: "See exactly which programs you likely qualify for, with next steps to apply." },
  ];

  const testimonials = [
    { quote: "I had no idea I qualified for SNAP and LIHEAP. This saved me over $400 a month.", name: "Margaret T., 71 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Florida" },
    { quote: "Found out I was eligible for Medicare Extra Help. My prescription costs dropped to almost nothing.", name: "Robert K., 68 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Ohio" },
    { quote: "My social worker uses this with every client. It finds things we used to miss.", name: "Case Manager, NY Area Agency on Aging" },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#1a1a2e", background: "white" }}>
      <nav style={{ background: "#0F2044", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>ÃƒÂ°Ã…Â¸Ã…â€™Ã¢â‚¬Â°</span>
          <span style={{ color: "white", fontWeight: "700", fontSize: "17px" }}>BenefitBridge 50+</span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="#how-it-works" style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", textDecoration: "none" }}>How it works</a>
          <a href="#partners" style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", textDecoration: "none" }}>For Organizations</a>
          <Link href="/screen">
            <span style={{ background: "#F59E0B", color: "#0F2044", padding: "8px 18px", borderRadius: "6px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              Check My Benefits ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
            </span>
          </Link>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #0F2044 0%, #162B52 60%, #1e3a6e 100%)", color: "white", padding: "80px 2rem 100px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#FCD34D", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "24px" }}>
            Free Ãƒâ€šÃ‚Â· No account required Ãƒâ€šÃ‚Â· AI-powered
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "800", lineHeight: 1.15, marginBottom: "20px" }}>
            Find the benefits you are  

            <span style={{ color: "#F59E0B" }}>entitled to ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â in 3 minutes</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px" }}>
            Millions of Americans 50+ are missing out on SNAP, Medicare savings, utility assistance, and hundreds of other programs. BenefitBridge screens your eligibility instantly.
          </p>
          <Link href="/screen">
            <button style={{ background: "#F59E0B", color: "#0F2044", padding: "16px 40px", borderRadius: "8px", border: "none", fontWeight: "800", fontSize: "18px", cursor: "pointer", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}>
              Screen for Benefits ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â It is Free ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
            </button>
          </Link>
          <p style={{ marginTop: "16px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>No signup. No personal data stored. Results in under 3 minutes.</p>
        </div>
      </section>

      <section style={{ background: "#F9FAFB", padding: "48px 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "24px", background: "white", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#0F2044" }}>{s.num}</div>
              <div style={{ fontSize: "14px", color: "#6B7280", marginTop: "6px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ padding: "80px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0F2044", marginBottom: "12px" }}>How it works</h2>
          <p style={{ color: "#6B7280", fontSize: "16px", marginBottom: "48px" }}>Simple, private, and takes less time than a cup of coffee.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{step.icon}</div>
                <div style={{ fontWeight: "700", fontSize: "16px", color: "#0F2044", marginBottom: "8px" }}>{step.title}</div>
                <div style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "48px" }}>
            <Link href="/screen">
              <button style={{ background: "#0F2044", color: "white", padding: "14px 36px", borderRadius: "8px", border: "none", fontWeight: "700", fontSize: "16px", cursor: "pointer" }}>
                Start My Free Screening ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: "#F9FAFB", padding: "80px 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2044", textAlign: "center", marginBottom: "48px" }}>Real people. Real results.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: "3px solid #F59E0B" }}>
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, marginBottom: "16px", fontStyle: "italic" }}>"{t.quote}"</p>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#6B7280" }}>ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#0F2044", padding: "80px 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "white", marginBottom: "12px" }}>Get benefit updates for your state</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", marginBottom: "32px" }}>New programs open every month. Enter your email and we will notify you when benefits matching your profile become available.</p>
          {submitted ? (
            <div style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: "10px", padding: "20px", color: "#6EE7B7", fontSize: "16px", fontWeight: "600" }}>
              You are on the list! We will notify you of new benefits.
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} style={{ display: "flex", gap: "12px", maxWidth: "440px", margin: "0 auto" }}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="your@email.com"
                style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "none", fontSize: "15px", color: "#111827", background: "white" }} />
              <button type="submit" disabled={submitting}
                style={{ background: "#F59E0B", color: "#0F2044", padding: "12px 24px", borderRadius: "8px", border: "none", fontWeight: "700", fontSize: "15px", cursor: "pointer", whiteSpace: "nowrap" }}>
                {submitting ? "..." : "Notify Me"}
              </button>
            </form>
          )}
          <p style={{ marginTop: "12px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <section id="partners" style={{ padding: "80px 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#F59E0B", letterSpacing: "1px", marginBottom: "12px", textTransform: "uppercase" }}>For Organizations</div>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2044", marginBottom: "16px" }}>Embed BenefitBridge in your workflow</h2>
            <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>Senior centers, hospitals, social workers, and nonprofits use BenefitBridge to screen clients faster and find more benefits.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0" }}>
              {["Embed on your website","Export results to CSV","Custom branding","Bulk screening for case managers"].map((f,i)=>(
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", fontSize: "14px", color: "#374151" }}>
                  <span style={{ color: "#059669", fontWeight: "700" }}>ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“</span> {f}
                </li>
              ))}
            </ul>
            <a href="mailto:contact@benefitbridge50.com" style={{ display: "inline-block", background: "#0F2044", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>
              Contact Us About Partnerships ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
            </a>
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>ÃƒÂ°Ã…Â¸Ã‚ÂÃ‚Â¥</div>
            <div style={{ fontWeight: "700", fontSize: "18px", color: "#0F2044", marginBottom: "8px" }}>Partner Pricing</div>
            <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "24px" }}>Starting at $99/month</div>
            {[["Unlimited screenings",true],["White-label branding",true],["CSV export",true],["API access",false],["Dedicated support",false]].map(([f,inc],i)=>(
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i<4?"1px solid #E5E7EB":"none", fontSize: "14px" }}>
                <span style={{ color: "#374151" }}>{f}</span>
                <span style={{ color: inc?"#059669":"#D1D5DB", fontWeight: "600" }}>{inc?"ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“":"ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#F9FAFB", padding: "60px 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F2044", marginBottom: "12px" }}>Ready to find your benefits?</h2>
        <p style={{ color: "#6B7280", marginBottom: "28px", fontSize: "15px" }}>Free. Private. Takes 3 minutes.</p>
        <Link href="/screen">
          <button style={{ background: "#F59E0B", color: "#0F2044", padding: "14px 36px", borderRadius: "8px", border: "none", fontWeight: "800", fontSize: "16px", cursor: "pointer" }}>
            Screen for Benefits Now ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢
          </button>
        </Link>
      </section>

      <footer style={{ background: "#0F2044", color: "rgba(255,255,255,0.5)", padding: "24px 2rem", textAlign: "center", fontSize: "13px" }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ marginRight: "24px" }}>ÃƒÂ°Ã…Â¸Ã…â€™Ã¢â‚¬Â° BenefitBridge 50+</span>
          <a href="mailto:contact@benefitbridge50.com" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", marginRight: "24px" }}>contact@benefitbridge50.com</a>
          <Link href="/screen"><span style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>Screener</span></Link>
        </div>
        <div>2026 BenefitBridge 50+. Screening tool only ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â not a guarantee of eligibility.</div>
      </footer>
    </div>
  );
}