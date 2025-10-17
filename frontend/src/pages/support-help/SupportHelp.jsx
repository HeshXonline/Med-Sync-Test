import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   Inline CSS (self-contained)
   ========================================================= */
const CSS_TEXT = `
:root {
  --bg: #f6f7fb;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #6b7280;
  --primary: #2563eb;
  --primary-600: #1d4ed8;
  --green: #059669;
  --amber: #d97706;
  --red: #dc2626;
  --ring: rgba(37, 99, 235, 0.35);
  --border: #e5e7eb;
}
* { box-sizing: border-box; }
body { margin: 0; }
.support-root { background: var(--bg); color: var(--text); min-height: 100vh; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
.container { max-width: 1180px; margin: 0 auto; padding: 24px; }
.header {
  position: sticky; top: 0; z-index: 20;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.header-inner { display:flex; flex-direction: column;  align-items:center; gap:12px; padding: 14px 24px; max-width: 100%;  margin:0 auto; }
.h-title { font-weight: 700; margin:0; }
.h-sub { margin:0; font-size: 13px; color: var(--muted); }
.search { margin-left:auto; display:flex; gap:8px; align-items:center; border:1px solid var(--border); background:var(--card); border-radius: 12px; padding: 8px 10px; width:100%; max-width: 420px; }
.search input { border:0; outline:0; font-size:14px; flex:1; background:transparent; }
.btn { cursor:pointer; border:1px solid var(--border); background:white; padding:8px 12px; border-radius: 10px; font-size: 14px; }
.btn:hover { background: #f8fafc; }
.btn.primary { border-color: var(--primary); background: var(--primary); color: white; }
.btn.primary:hover { background: var(--primary-600); }
.grid { display:grid; gap: 20px; }

.left-rail { display:grid; gap: 20px; grid-auto-rows: min-content; }
.card { background: var(--card); border:1px solid var(--border); border-radius: 16px; box-shadow: 0 1px 1px rgba(0,0,0,0.02); }
.card.pad { padding: 16px; overflow: hidden; } /* prevent visual spill from children */
.title { font-weight: 600; margin: 0 0 8px; }
.muted { color: var(--muted); font-size: 13px; }

/* --- robust two-column layout (prevents overlap) --- */
.support-columns {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  align-items: start;
}
.support-columns > * { min-width: 0; } /* CRITICAL: allow grid children to shrink */
@media (min-width: 1024px) {
  .support-columns { grid-template-columns: 280px minmax(0,1fr); }
}

/* Category Nav */
.cat-item { display:flex; justify-content:center; align-items:center; width:150px; height:40px; border-radius:9999px; border:1px solid var(--primary); cursor:pointer; background:white; transition: all 0.2s; font-weight:500; text-align:center; padding:0; }
.cat-item.active { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }

/* System Status */
.status-grid { display:grid; gap: 12px; grid-template-columns: 1fr 1fr; }
@media (min-width: 1024px) { .status-grid { grid-template-columns: 1fr; } }
.status-item { border:1px solid var(--border); border-radius: 12px; padding: 10px; }
.badge { font-size: 12px; padding: 2px 8px; border-radius: 999px; display:inline-block; }
.badge.op { background:#dcfce7; color:#166534; }
.badge.dg { background:#fef3c7; color:#92400e; }
.badge.og { background:#fee2e2; color:#991b1b; }

/* FAQ */
.faq-item { border-radius: 12px; background: white; }
.faq-q { width:100%; display:flex; justify-content:space-between; align-items:center; padding: 12px 14px; cursor:pointer; border:1px solid var(--border); border-radius:12px; background:white; }
.faq-item + .faq-item { margin-top: 10px; }
.faq-a-wrap { display:grid; transition: grid-template-rows 220ms ease; }
.faq-a-inner { overflow:hidden; }
.faq-a { padding: 0 14px 12px; color:#334155; font-size: 14px; }

/* Help Articles */
.article { padding: 14px; border:1px solid var(--border); border-radius: 12px; background:white; }
.article h4 { margin: 0 0 6px; }
.article-meta { font-size:12px; color: var(--muted); margin-bottom: 8px; }
.article ul { margin: 8px 0 0 16px; }

/* Video Library */
.video-grid { display:grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
@media (max-width: 420px) { .video-grid { grid-template-columns: 1fr; } }
.video { border:1px solid var(--border); border-radius: 12px; overflow:hidden; background:white; }
.video-thumb { background:#0b1020; aspect-ratio: 16/9; display:flex; align-items:center; justify-content:center; color:white; font-size:13px; }
.video-body { padding: 10px; }

/* Chat */
.chat { height: 420px; display:flex; flex-direction:column; }
.chat-body { flex:1; overflow:auto; background:#f1f5f9; padding: 12px; display:grid; gap: 8px; }
.bubble { max-width: 80%; padding: 8px 10px; border-radius: 12px; font-size: 14px; }
.bubble.me { margin-left:auto; background: var(--primary); color:white; }
.bubble.bot { background:white; border:1px solid var(--border); }
.chat-input { display:flex; gap:8px; align-items:center; padding: 10px; border-top:1px solid var(--border); }

/* Tickets */
.table-wrap { overflow:auto; border:1px solid var(--border); border-radius: 12px; }
table { width:100%; border-collapse:collapse; font-size: 14px; }
th, td { padding: 10px; text-align:left; }
thead { background:#f8fafc; color:#334155; }
tbody tr + tr { border-top:1px solid var(--border); }
.id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

/* Contact & Feedback */
input, textarea, select {
  width: 100%; border:1px solid var(--border); border-radius: 10px; padding: 10px; font-size: 14px; outline: none; background:white;
}
input:focus, textarea:focus, select:focus { box-shadow: 0 0 0 4px var(--ring); border-color: var(--primary); }

/* Highlight */
mark { background: #fde68a; border-radius: 4px; padding: 1px 3px; }

/* Layout areas */
.main-grid { display:grid; gap: 20px; grid-template-columns: 1fr; }
@media (min-width: 1024px) { .main-grid { grid-template-columns: 2fr 1fr; } }
.popular { display:grid; gap: 12px; grid-template-columns: 1fr; }
@media (min-width: 640px) { .popular { grid-template-columns: 1fr 1fr; } }
.popular a { border:1px solid var(--border); border-radius: 12px; padding: 12px; text-decoration:none; color: inherit; background:white; display:block; }
.popular a:hover { background:#f8fafc; }

.footer { border-top:1px solid var(--border); background:white; font-size:12px; color: var(--muted); }
.footer-inner { max-width:1180px; margin:0 auto; padding: 20px 24px; }
`;

function useInjectCssOnce(id = "support-help-inline-css") {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = CSS_TEXT;
    document.head.appendChild(tag);
  }, [id]);    //It’s a custom React Hook that automatically adds (injects) your CSS styles into the page’s <head> — but only once
}

/* =========================================================
   Utilities
   ========================================================= */
function highlight(text, query) {
  if (!query) return text;
  try {
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${safe})`, "ig");
    const parts = String(text).split(re);
    return parts.map((p, i) =>
      re.test(p) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>
    );
  } catch {
    return text;
  }
}

/* =========================================================
   Components
   ========================================================= */
function SearchInterface({ value, onChange, onClear }) {
  return (
    <div className="search">
      <span role="img" aria-label="search">🔎</span>
      <input
        placeholder="Search help, FAQs, tickets, videos…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? <button className="btn" onClick={onClear}>Clear</button> : null}
    </div>
  );
}

function FAQAccordion({ items, query }) {
  const [open, setOpen] = useState(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(it =>
      it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="grid" style={{ gap: 10 }}>
      {filtered.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div className="faq-item" key={idx}>
            <button className="faq-q" onClick={() => setOpen(isOpen ? null : idx)}>
              <b>{highlight(it.q, query)}</b>
              <span aria-hidden>▾</span>
            </button>
            <div
              className="faq-a-wrap"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="faq-a-inner">
                <div className="faq-a">{highlight(it.a, query)}</div>
              </div>
            </div>
          </div>
        );
      })}
      {!filtered.length && <p className="muted">No FAQ results.</p>}
    </div>
  );
}

function ArticleAccordion({ article, query, openId, setOpenId }) {
  const isOpen = openId === article.id;

  return (
    <article
      className="article"
      style={{
        border: "1px solid var(--border)",
        borderRadius: "12px",
        marginBottom: "10px",
        background: "white",
        overflow: "visible",
      }}
    >
      <button
        onClick={() => setOpenId(isOpen ? null : article.id)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "12px 16px",
          fontWeight: "600",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{highlight(article.title, query)}</span>
        <span aria-hidden>{isOpen ? "▴" : "▾"}</span>
      </button>

      <div
        style={{
          maxHeight: isOpen ? "80vh" : "0px",
          overflowY: isOpen ? "auto" : "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", textAlign: "left" }}>
          <div className="article-meta">
            Category: {article.category} · Updated {article.updated}
          </div>
          <p>{highlight(article.summary, query)}</p>
          <ul style={{ margin: "8px 0 0 16px", listStyle: "disc", listStylePosition: "outside", paddingLeft: "18px" }}>
            {article.steps.map((s, i) => (
              <li key={i}>{highlight(s, query)}</li>
            ))}
          </ul>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <span className="muted">Was this helpful?</span>
            <button className="btn">👍 Yes</button>
            <button className="btn">👎 No</button>
          </div>
        </div>
      </div>
    </article>
  );
}



function LiveChat({ onEscalate }) {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  function send() {
    const t = input.trim();
    if (!t) return;
    setMessages((m) => [...m, { id: Date.now(), from: "me", text: t }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "bot",
          text:
            "Thanks! I’ve logged your question. If you need a human, click ‘Create Ticket’.",
        },
      ]);
    }, 500);
  }

  return (
    <div className="card chat">
      <div className="pad" style={{ borderBottom: "1px solid var(--border)" }}>
        <b>💬 Live Chat</b>{" "}
        <span className="muted" style={{ marginLeft: 6 }}>• Online</span>
      </div>
      <div className="chat-body">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.from === "me" ? "me" : "bot"}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="chat-input">
        <input
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="btn primary" onClick={send}>Send</button>
        <button className="btn" onClick={onEscalate}>Create Ticket</button>
      </div>
    </div>
  );
}

function TicketSystem({ query }) {
  const [tickets, setTickets] = useState([
    { id: "TCK-1024", subject: "Can’t log in", status: "Open", priority: "High", updated: "2025-09-18" },
    { id: "TCK-1025", subject: "Billing mismatch", status: "Pending", priority: "Medium", updated: "2025-09-20" },
    { id: "TCK-1026", subject: "Dark mode request", status: "Resolved", priority: "Low", updated: "2025-09-27" },
  ]);
  const [form, setForm] = useState({ subject: "", description: "", priority: "Medium" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(t =>
      [t.id, t.subject, t.status, t.priority].some(v => String(v).toLowerCase().includes(q))
    );
  }, [tickets, query]);

  function createTicket() {
    if (!form.subject.trim()) return alert("Please enter a subject");
    const id = `TCK-${Math.floor(Math.random() * 9000 + 1000)}`;
    setTickets(ts => [
      { id, subject: form.subject.trim(), status: "Open", priority: form.priority, updated: new Date().toISOString().slice(0,10) },
      ...ts,
    ]);
    setForm({ subject: "", description: "", priority: "Medium" });
    alert("Ticket created! We’ll email you updates.");
  }

  function nextStatus(id) {
    setTickets(ts =>
      ts.map(t => {
        if (t.id !== id) return t;
        const order = ["Open", "Pending", "Resolved"];
        const next = order[(order.indexOf(t.status) + 1) % order.length];
        return { ...t, status: next, updated: new Date().toISOString().slice(0,10) };
      })
    );
  }

  function badgeCls(s) {
    if (s === "Open") return "badge og";
    if (s === "Pending") return "badge dg";
    return "badge op";
  }

  return (
    <div className="card pad">
      <h3 className="title">🎟️ Support Tickets</h3>

      <div className="grid" style={{ gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <div className="grid" style={{ gap: 10 }}>
          <input
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
            rows={4}
            placeholder="Describe your issue"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="muted" style={{ minWidth: 60 }}>Priority</span>
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              style={{ maxWidth: 160 }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button className="btn primary" onClick={createTicket}>+ Create Ticket</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Subject</th><th>Priority</th><th>Status</th><th>Updated</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="id">{highlight(t.id, query)}</td>
                  <td>{highlight(t.subject, query)}</td>
                  <td>{highlight(t.priority, query)}</td>
                  <td><span className={badgeCls(t.status)}>{t.status}</span></td>
                  <td className="muted">{t.updated}</td>
                  <td><button className="btn" onClick={() => nextStatus(t.id)}>Next</button></td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={6} className="muted">No tickets match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VideoLibrary({ videos, query }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(v =>
      v.title.toLowerCase().includes(q) || v.tags.join(" ").toLowerCase().includes(q)
    );
  }, [videos, query]);

  return (
    <div className="card pad">
      <h3 className="title">🎥 Video Tutorials</h3>
      <div className="video-grid">
        {filtered.map(v => (
          <div className="video" key={v.id}>
            <div className="video-thumb">
              <a href={v.url} target="_blank" rel="noreferrer" style={{ color:"white", textDecoration:"underline" }}>
                Open Video
              </a>
            </div>
            <div className="video-body">
              <b>{highlight(v.title, query)}</b>
              <div className="muted" style={{ marginTop: 4 }}>
                {v.duration} · {v.tags.slice(0,3).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!filtered.length && <p className="muted">No videos found.</p>}
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="card pad">
      <h3 className="title">📞 Contact Us</h3>
      <div className="grid" style={{ gap: 8 }}>
        <div>✉️ <a href="mailto:support@medicalsign.app">support@medicalsign.app</a></div>
        <div>📱 <a href="tel:+94112223344">+94 11 222 3344</a> (09:00–17:00 IST)</div>
        <div>📍 123 Help Street, Colombo</div>
      </div>
    </div>
  );
}

function FeedbackForm() {
  const [form, setForm] = useState({ topic: "", message: "" });
  const [sent, setSent] = useState(false);

  function submit() {
    if (!form.topic.trim() || !form.message.trim()) {
      alert("Please fill all fields");
      return;
    }
    setSent(true);
    setTimeout(() => setSent(false), 2200);
    setForm({ topic: "", message: "" });
  }

  return (
    <div className="card pad">
      <h3 className="title">📝 Send Feedback</h3>
      <div className="grid" style={{ gap: 10 }}>
        <input
          placeholder="Topic"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
        />
        <textarea
          rows={4}
          placeholder="Your feedback helps us improve…"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
        <div style={{ display:"flex", gap: 10, alignItems:"center" }}>
          <button className="btn primary" onClick={submit}>Submit</button>
          {sent && <span style={{ color: "var(--green)" }}>Thanks for the feedback! ✅</span>}
        </div>
      </div>
    </div>
  );
}

function SystemStatus() {
  const [services, setServices] = useState([
    { name: "API", status: "Operational", latency: 120 },
    { name: "Database", status: "Degraded", latency: 240 },
    { name: "EMR", status: "Operational", latency: 160 },
    { name: "Email/SMS", status: "Outage", latency: null },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setServices(sv =>
        sv.map(s => ({
          ...s,
          latency: s.latency ? Math.max(90, Math.min(420, Math.round(s.latency + (Math.random()*40-20)))) : null
        }))
      );
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card pad">
      <h3 className="title">📊 System Status</h3>
      <div className="status-grid">
        {services.map(s => (
          <div className="status-item" key={s.name}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <b>{s.name}</b>
              <span className={`badge ${
                s.status === "Operational" ? "op" :
                s.status === "Degraded" ? "dg" : "og"
              }`}>{s.status}</span>
            </div>
            <div className="muted" style={{ marginTop: 6 }}>
              Latency: {s.latency ? `${s.latency} ms` : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryNav({ categories, active, onChange }) {
  return (
    <div className="card pad">
      <h4 className="title" style={{ marginBottom: 5}}>Categories</h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",   // wrap to next line if too many
          gap: "35px",          // space between buttons
        }}
      >
        {categories.map(c => (
          <button
            key={c}
            className={`cat-item ${active === c ? "active" : ""}`}
            onClick={() => onChange(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}



/* =========================================================
   Root Page
   ========================================================= */
export default function SupportHelpPage() {
  useInjectCssOnce();

  // Mock data
  const faqs = [
    { q: "How do I reset my password?", a: "Go to Settings → Security → Reset Password, then follow the email link." },
    { q: "How to create a support ticket?", a: "Open the Tickets section, fill subject/description/priority and submit." },
    { q: "Where can I view system status?", a: "The System Status card shows API/DB/EMR/email health and latency." },
    { q: "Is live chat 24/7?", a: "Live chat is available 09:00–17:00 IST weekdays. Tickets are monitored 24/7." },
  ];

  const articles = [
    { id: 1, title: "Book or Reschedule Appointments", category: "Appointments", updated: "2025-09-25",
      summary: "Step-by-step guide to book, reschedule, or cancel clinic appointments.",
      steps: ["Open Appointments module.", "Choose date/time and doctor.", "Confirm or reschedule in My Appointments."],
      popular: true },
    { id: 2, title: "Insurance & Billing Guide", category: "Billing", updated: "2025-09-18",
      summary: "Upload insurance, view invoices, pay securely, and download receipts.",
      steps: ["Go to Billing → Invoices.", "Filter by date.", "Click Pay / Download."],
      popular: true },
    { id: 3, title: "Troubleshooting Login Issues", category: "Troubleshooting", updated: "2025-09-20",
      summary: "Fix common sign-in errors; reset credentials; contact support if locked.",
      steps: ["Check Caps Lock.", "Reset password via email link.", "Open a ticket if still blocked."],
      popular: false },
    { id: 4, title: "Telemedicine Visit Checklist", category: "Telemedicine", updated: "2025-09-12",
      summary: "Prepare your device, camera, mic and stable internet before session.",
      steps: ["Test audio/video.", "Keep ID ready.", "Join link 5 minutes early."],
      popular: true },
  ];

  const videos = [
    { id: "v1", title: "Clinic Dashboard Tour", url: "https://example.com/video1", duration: "4:30", tags: ["getting started", "tour"] },
    { id: "v2", title: "Managing Patient Profiles", url: "https://example.com/video2", duration: "6:12", tags: ["admin", "patients"] },
    { id: "v3", title: "Generating Reports", url: "https://example.com/video3", duration: "7:55", tags: ["analytics"] },
  ];

  const categories = useMemo(() => ["All", ...Array.from(new Set(articles.map(a => a.category)))], [articles]);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [showTicketHint, setShowTicketHint] = useState(false);
  const [openId, setOpenId] = useState(null);

  const filteredArticles = useMemo(() => {
      const q = query.trim().toLowerCase();
      
      // If there is a query, filter articles based on search
      if (q) {
        return articles.filter(a =>
          (activeCategory === "All" || a.category === activeCategory) &&
          (
            a.title.toLowerCase().includes(q) || 
            a.summary.toLowerCase().includes(q) || 
            a.steps.join(" ").toLowerCase().includes(q)
          )
        );
      } 
      
      // If there's no search query, show all articles
      return articles.filter(a => activeCategory === "All" || a.category === activeCategory);
    }, [articles, activeCategory, query]);


  const popularArticles = useMemo(() => articles.filter(a => a.popular), [articles]);

  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <h1 className="h-title" style={{ textAlign: "center" }}>Support & Help Center</h1>
          <div style={{ padding: "8px 40px", maxWidth: "100%", margin: "0 auto" }}>
            <SearchInterface
              value={query}
              onChange={setQuery}
              onClear={() => setQuery("")}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container" style={{ width: "100%", padding: "24px 40px" }}>
        <section style={{ display: "grid", gap: 20 }}>
          {/* Categories */}
          <CategoryNav
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />

          {/* Articles Section */}
          <div className="card pad" style={{ width: "100%", overflow: "visible" }}>
            <h3 className="title">📰 Articles</h3>

            {/* Sorting Articles by Popularity */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "440px", overflowY: "auto", paddingRight: "4px" }}>
              {filteredArticles
                .sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1)) // Sort by popularity
                .map((a, i) => (
                  <ArticleAccordion key={i} article={a} query={query} openId={openId} setOpenId={setOpenId} />
              ))}
            </div>
          </div>




          {/* FAQs */}
          <div className="card pad" style={{ width: "100%" }}>
            <h3 className="title">❓ FAQs</h3>
            <FAQAccordion items={faqs} query={query} />
          </div>

          {/* Videos and Contextual Help */}
          <div className="grid" style={{ gap: 20, gridTemplateColumns: "1fr", display: "grid" }}>
            <VideoLibrary videos={videos} query={query} />

            <div className="card pad">
              <h3 className="title">🧠 Contextual Help</h3>
              <p className="muted" style={{ textAlign: "left" }}>Tips based on your current page (wire your app state to feed this).</p>
              <ul style={{ margin: "8px 0 0 18px" }}>
                <li>Press <kbd>/</kbd> to jump to search</li>
                <li>Invite teammates from <b>Admin → Users</b></li>
                <li>Check <b>System Status</b> if something seems slow</li>
              </ul>
            </div>
          </div>

          {/* Chat + Tickets */}
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 20 }}>
            <LiveChat onEscalate={() => setShowTicketHint(true)} />
            <TicketSystem query={query} />
          </div>

          {showTicketHint && (
            <div
              className="card pad"
              style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}
            >
              <b>Escalation ready.</b> The ticket form is open on the right—fill it and click <i>Create Ticket</i>.
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-inner">
          © {new Date().getFullYear()} Medical Sign. Help content is provided as-is. For emergencies, call our hotline.
        </div>
      </div>
    </div>
  );
}
