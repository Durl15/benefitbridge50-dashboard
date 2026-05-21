import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const API = "https://web-production-26d78.up.railway.app";

export default function Dashboard( ) {
  const [activeNav, setActiveNav] = useState("screener");
  const [apiStatus, setApiStatus] = useState("loading");
  const [resources, setResources] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ user_alias:"", age:"", state:"", county:"", household_size:"", monthly_income:"", housing_status:"renting", food_insecurity:false, medicare_status:"none", disability_status:false, veteran_status:false, caregiving_role:"none", utility_help_needed:false, consent_to_process:false });
  const [screening, setScreening] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/health`).then(r=>r.json()).then(()=>setApiStatus("ok")).catch(()=>setApiStatus("error"));
    fetch(`${API}/api/resources`).then(r=>r.json()).then(setResources).catch(()=>{});
    fetch(`${API}/api/assessments`).then(r=>r.json()).then(setAssessments).catch(()=>{});
  }, []);

  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const sb = (k) => setForm(f=>({...f,[k]:!f[k]}));

  const handleScreen = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setScreening(null);
    try {
      const res = await fetch(`${API}/api/assessments`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          user_alias: form.user_alias || "Anonymous",
          age: parseInt(form.age),
          state: form.state,
          county: form.county,
          household_size: parseInt(form.household_size),
          monthly_income: parseFloat(form.monthly_income),
          housing_status: form.housing_status,
          food_insecurity: form.food_insecurity,
          medicare_status: form.medicare_status,
          disability_status: form.disability_status,
          veteran_status: form.veteran_status,
          caregiving_role: form.caregiving_role,
          utility_help_needed: form.utility_help_needed,
          consent_to_process: form.consent_to_process
        })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || "Failed"); }
      const data = await res.json();
      setScreening(data);
      fetch(`${API}/api/assessments`).then(r=>r.json()).then(setAssessments).catch(()=>{});
    } catch(err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const nav = [
    {id:"screener",label:"Benefit Screener"},
    {id:"resources",label:"Resources"},
    {id:"assessments",label:"Assessments"},
    {id:"status",label:"System Status"}
  ];

  const inp = {width:"100%",padding:"8px 12px",border:"1px solid #D1D5DB",borderRadius:"6px",fontSize:"14px"};
  const sel = {...inp,background:"white"};
  const lbl = {display:"block",fontSize:"13px",fontWeight:"600",color:"#374151",marginBottom:"4px"};

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"IBM Plex Sans, system-ui, sans-serif"}}>
      <div style={{width:"220px",background:"#0F2044",color:"white",padding:"24px 16px",flexShrink:0}}>
        <div style={{marginBottom:"32px"}}>
          <div style={{fontSize:"18px",fontWeight:"700"}}>BenefitBridge 50+</div>
          <div style={{fontSize:"12px",opacity:0.7,marginTop:"4px"}}>Project Dashboard</div>
        </div>
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setActiveNav(n.id)} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:"6px",border:"none",cursor:"pointer",marginBottom:"4px",background:activeNav===n.id?"rgba(255,255,255,0.15)":"transparent",color:"white",fontSize:"14px"}}>
            {n.label}
          </button>
        ))}
        <div style={{marginTop:"auto",paddingTop:"32px",fontSize:"12px",opacity:0.6}}>
          API: <span style={{color:apiStatus==="ok"?"#34D399":"#F87171"}}>{apiStatus==="ok"?"Online":"Offline"}</span>
        </div>
      </div>

      <main style={{flex:1,padding:"32px",background:"#F9FAFB",overflowY:"auto"}}>
        {activeNav==="screener" && (
          <div style={{maxWidth:"640px"}}>
            <h2 style={{fontSize:"24px",fontWeight:"700",color:"#0F2044",marginBottom:"8px"}}>Benefit Screener</h2>
            <p style={{color:"#6B7280",marginBottom:"24px"}}>Find benefits you may qualify for.</p>
            <form onSubmit={handleScreen} style={{background:"white",padding:"24px",borderRadius:"12px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                <div><label style={lbl}>Alias (optional)</label><input style={inp} value={form.user_alias} onChange={e=>sf("user_alias",e.target.value)} placeholder="e.g. John D." /></div>
                <div><label style={lbl}>Age *</label><input style={inp} type="number" value={form.age} onChange={e=>sf("age",e.target.value)} required min="50" max="120" /></div>
                <div><label style={lbl}>State *</label><input style={inp} value={form.state} onChange={e=>sf("state",e.target.value)} required placeholder="e.g. California" /></div>
                <div><label style={lbl}>County</label><input style={inp} value={form.county} onChange={e=>sf("county",e.target.value)} placeholder="e.g. Los Angeles" /></div>
                <div><label style={lbl}>Household Size *</label><input style={inp} type="number" value={form.household_size} onChange={e=>sf("household_size",e.target.value)} required min="1" /></div>
                <div><label style={lbl}>Monthly Income ($) *</label><input style={inp} type="number" value={form.monthly_income} onChange={e=>sf("monthly_income",e.target.value)} required min="0" /></div>
                <div><label style={lbl}>Housing Status</label><select style={sel} value={form.housing_status} onChange={e=>sf("housing_status",e.target.value)}><option value="renting">Renting</option><option value="owning">Owning</option><option value="homeless">Homeless</option><option value="other">Other</option></select></div>
                <div><label style={lbl}>Medicare Status</label><select style={sel} value={form.medicare_status} onChange={e=>sf("medicare_status",e.target.value)}><option value="none">None</option><option value="part_a">Part A</option><option value="part_b">Part B</option><option value="part_ab">Part A+B</option><option value="advantage">Advantage</option></select></div>
                <div><label style={lbl}>Caregiving Role</label><select style={sel} value={form.caregiving_role} onChange={e=>sf("caregiving_role",e.target.value)}><option value="none">None</option><option value="primary">Primary</option><option value="secondary">Secondary</option></select></div>
              </div>
              <div style={{marginTop:"16px",display:"flex",flexWrap:"wrap",gap:"16px"}}>
                {[["food_insecurity","Food Insecurity"],["disability_status","Disability"],["veteran_status","Veteran"],["utility_help_needed","Utility Help Needed"]].map(([k,l])=>(
                  <label key={k} style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"14px",cursor:"pointer"}}>
                    <input type="checkbox" checked={form[k]} onChange={()=>sb(k)} />
                    {l}
                  </label>
                ))}
              </div>
              <div style={{marginTop:"16px"}}>
                <label style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"14px",cursor:"pointer"}}>
                  <input type="checkbox" checked={form.consent_to_process} onChange={()=>sb("consent_to_process")} required />
                  I consent to processing my information to find benefits
                </label>
              </div>
              {error && <div style={{marginTop:"12px",padding:"12px",background:"#FEF2F2",color:"#DC2626",borderRadius:"6px",fontSize:"14px"}}>{error}</div>}
              <button type="submit" disabled={submitting} style={{marginTop:"20px",width:"100%",padding:"12px",background:"#0F2044",color:"white",border:"none",borderRadius:"8px",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>
                {submitting ? "Screening..." : "Find My Benefits"}
              </button>
            </form>
            {screening && (
              <div style={{marginTop:"24px",background:"white",padding:"24px",borderRadius:"12px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <h3 style={{fontSize:"18px",fontWeight:"700",color:"#0F2044",marginBottom:"16px"}}>Results</h3>
                {screening.recommended_benefits?.length > 0 ? (
                  <div>
                    <p style={{color:"#059669",fontWeight:"600",marginBottom:"12px"}}>Found {screening.recommended_benefits.length} potential benefits:</p>
                    {screening.recommended_benefits.map((b,i)=>(
                      <div key={i} style={{padding:"12px",background:"#F0FDF4",borderRadius:"8px",marginBottom:"8px",fontSize:"14px"}}>
                        <div style={{fontWeight:"600"}}>{b.name || b}</div>
                        {b.description && <div style={{color:"#6B7280",marginTop:"4px"}}>{b.description}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{color:"#6B7280"}}>No specific benefits found. Try adjusting your information.</p>
                )}
                {screening.action_plan && <div style={{marginTop:"16px",padding:"16px",background:"#EFF6FF",borderRadius:"8px",fontSize:"14px",whiteSpace:"pre-wrap"}}>{screening.action_plan}</div>}
              </div>
            )}
          </div>
        )}

        {activeNav==="resources" && (
          <div>
            <h2 style={{fontSize:"24px",fontWeight:"700",color:"#0F2044",marginBottom:"24px"}}>Resources</h2>
            {resources.length === 0 ? <p style={{color:"#6B7280"}}>Loading resources...</p> : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"16px"}}>
                {resources.map((r,i)=>(
                  <div key={i} style={{background:"white",padding:"20px",borderRadius:"12px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                    <div style={{fontWeight:"700",fontSize:"15px",color:"#0F2044",marginBottom:"8px"}}>{r.name || r.title}</div>
                    <div style={{fontSize:"13px",color:"#6B7280"}}>{r.description}</div>
                    {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:"12px",fontSize:"13px",color:"#3B82F6"}}>Learn more â†’</a>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav==="assessments" && (
          <div>
            <h2 style={{fontSize:"24px",fontWeight:"700",color:"#0F2044",marginBottom:"24px"}}>Assessments</h2>
            {assessments.length === 0 ? <p style={{color:"#6B7280"}}>No assessments yet.</p> : (
              <div style={{background:"white",borderRadius:"12px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"#F3F4F6"}}><th style={{padding:"12px 16px",textAlign:"left",fontSize:"13px",fontWeight:"600",color:"#374151"}}>Alias</th><th style={{padding:"12px 16px",textAlign:"left",fontSize:"13px",fontWeight:"600",color:"#374151"}}>State</th><th style={{padding:"12px 16px",textAlign:"left",fontSize:"13px",fontWeight:"600",color:"#374151"}}>Age</th><th style={{padding:"12px 16px",textAlign:"left",fontSize:"13px",fontWeight:"600",color:"#374151"}}>Date</th></tr></thead>
                  <tbody>{assessments.map((a,i)=>(
                    <tr key={i} style={{borderTop:"1px solid #F3F4F6"}}>
                      <td style={{padding:"12px 16px",fontSize:"14px"}}>{a.user_alias || "Anonymous"}</td>
                      <td style={{padding:"12px 16px",fontSize:"14px"}}>{a.state}</td>
                      <td style={{padding:"12px 16px",fontSize:"14px"}}>{a.age}</td>
                      <td style={{padding:"12px 16px",fontSize:"14px",color:"#6B7280"}}>{a.created_at ? new Date(a.created_at).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeNav==="status" && (
          <div style={{maxWidth:"560px"}}>
            <h2 style={{fontSize:"24px",fontWeight:"700",color:"#0F2044",marginBottom:"24px"}}>System Status</h2>
            <div style={{background:"white",borderRadius:"12px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              {[
                {label:"Backend API (Railway)",url:"https://web-production-26d78.up.railway.app",live:apiStatus==="ok"},
                {label:"Frontend (Netlify )",url:"https://benefitbridge50-dashboard.netlify.app",live:true},
                {label:"GitHub Backend",url:"https://github.com/Durl15/BenefitBridge50-backend",live:true},
                {label:"GitHub Dashboard",url:"https://github.com/Durl15/benefitbridge50-dashboard",live:true}
              ].map((item,i,arr )=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<arr.length-1?"1px solid #F3F4F6":"none"}}>
                  <div><div style={{fontWeight:"500",fontSize:"14px",color:"#0F2044"}}>{item.label}</div><a href={item.url} target="_blank" rel="noopener noreferrer" style={{fontSize:"12px",color:"#3B82F6"}}>{item.url}</a></div>
                  <span style={{fontSize:"12px",fontWeight:"600",color:item.live?"#059669":"#EF4444"}}>{item.live?"âœ“ Live":"âœ— Offline"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}