import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { workerApi, type Job } from "../../api/client";
import { useLang } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { ShareModal } from "../../components/ShareModal";
import { ContactEmployer } from "../../components/ContactEmployer";
import { EmploymentDisclosure } from "../../components/EmploymentDisclosure";

// ── Fuzzy search ──────────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function tokenScore(token: string, text: string): number {
  if (!token || token.length < 2) return 0;
  if (text.includes(token)) return 60;                              // substring hit
  const words = text.split(/[\s,\-/]+/);
  for (const w of words) {
    if (!w) continue;
    if (w.startsWith(token) || token.startsWith(w.slice(0, 4))) return 40; // prefix
    if (w.length >= 3 && token.length >= 3 && levenshtein(token, w) <= 2) return 25; // typo
  }
  return 0;
}

function fuzzyScore(query: string, job: Job): number {
  const q = query.toLowerCase().trim();
  if (!q) return 100;
  const haystack = [
    job.title,
    job.restaurant_name ?? "",
    job.employer_name ?? "",
    job.location ?? "",
    job.description ?? "",
  ].join(" ").toLowerCase();

  if (haystack.includes(q)) return 100;                             // exact phrase match

  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return 0;

  let total = 0;
  for (const tok of tokens) total += tokenScore(tok, haystack);
  return total;
}

function bestSuggestion(query: string, jobs: Job[]): string | null {
  if (!query.trim() || jobs.length === 0) return null;
  let best = { score: -1, title: "" };
  for (const job of jobs) {
    const s = fuzzyScore(query, job);
    if (s > best.score) best = { score: s, title: job.title };
  }
  return best.score > 10 ? best.title : null;
}

// ── Translation cache (module-level, survives re-renders) ─────────────────────

const translationCache = new Map<string, string>();

const LANG_LABELS: Record<string, string> = {
  zh: "中文",
  es: "Español",
  fr: "Français",
  pt: "Português",
  vi: "Tiếng Việt",
};

// ── Translate widget ──────────────────────────────────────────────────────────

function TranslateWidget({ job, userLang }: { job: Job; userLang: string }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<string>(userLang !== "en" ? `translate:${userLang}` : "simplify");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!job.description) return null;

  const cacheKey = `${job.id}|${mode}`;

  const handleRun = async () => {
    setError("");
    if (translationCache.has(cacheKey)) {
      setResult(translationCache.get(cacheKey)!);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(false);
    try {
      const [action, lang] = mode.startsWith("translate:") ? ["translate", mode.split(":")[1]] : ["simplify", "en"];
      const res = await workerApi.translateJob(job.id, action as "translate" | "simplify", lang);
      translationCache.set(cacheKey, res.result);
      setResult(res.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const modeLabel = mode === "simplify"
    ? "Simplify"
    : `Translate → ${LANG_LABELS[mode.split(":")[1]] ?? mode.split(":")[1]}`;

  return (
    <div style={{ marginTop: 12 }}>
      {/* Controls row */}
      <div ref={containerRef} style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
        {/* Dropdown trigger */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 11, fontWeight: 600, color: "#6B7280",
              background: "#F7F7F5", border: "1.5px solid #E5E7EB",
              borderRadius: 6, padding: "4px 9px", cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 3c-3 3.5-3 14.5 0 18M12 3c3 3.5 3 14.5 0 18M3 12h18"/>
            </svg>
            {modeLabel}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                  background: "#ffffff", border: "1px solid #E5E7EB",
                  borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  minWidth: 180, overflow: "hidden",
                }}
              >
                {[
                  { value: "simplify", label: "Simplify to plain language" },
                  ...Object.entries(LANG_LABELS).map(([code, name]) => ({
                    value: `translate:${code}`,
                    label: `Translate → ${name}`,
                  })),
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setMode(opt.value); setOpen(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "9px 12px", fontSize: 12, fontWeight: mode === opt.value ? 600 : 400,
                      color: mode === opt.value ? "#C9A84C" : "#374151",
                      background: mode === opt.value ? "#FFFBF0" : "transparent",
                      border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif",
                      borderBottom: "1px solid #F3F4F6",
                    }}
                    onMouseEnter={(e) => { if (mode !== opt.value) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = mode === opt.value ? "#FFFBF0" : "transparent"; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Go button */}
        <button
          onClick={handleRun}
          disabled={loading}
          style={{
            fontSize: 11, fontWeight: 600, color: loading ? "#9CA3AF" : "#0A0F1E",
            background: loading ? "#F3F4F6" : "#C9A84C",
            border: "none", borderRadius: 6, padding: "4px 10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Inter, sans-serif",
            display: "flex", alignItems: "center", gap: 4,
            transition: "background 0.15s",
          }}
        >
          {loading ? (
            <>
              <div style={{ width: 10, height: 10, border: "1.5px solid #D1D5DB", borderTop: "1.5px solid #6B7280", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              ...
            </>
          ) : "Go"}
        </button>

        {/* Clear button if result exists */}
        {result && (
          <button
            onClick={() => setResult(null)}
            style={{ fontSize: 11, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: "4px 4px", fontFamily: "Inter, sans-serif" }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: 12, color: "#DC2626", margin: "6px 0 0" }}>{error}</p>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              marginTop: 10, padding: "12px 14px",
              background: "#F7F7F5", border: "1px solid #E5E7EB",
              borderLeft: "3px solid #C9A84C", borderRadius: 8,
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 5px" }}>
                {modeLabel}
              </p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {result}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function BrowseJobsPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const b = t.browseJobs;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [shareJob, setShareJob] = useState<Job | null>(null);

  // Location search (approximate, ~30 miles via backend)
  const [locationQuery, setLocationQuery] = useState("");
  const [locJobs, setLocJobs] = useState<Job[] | null>(null);
  const [locNote, setLocNote] = useState("");
  const [locActive, setLocActive] = useState("");   // the location currently applied
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  useEffect(() => {
    workerApi.getJobs().then((d) => setJobs(d.jobs)).finally(() => setLoading(false));
  }, []);

  const runLocationSearch = async () => {
    const q = locationQuery.trim();
    setLocError("");
    if (!q) { clearLocationSearch(); return; }
    setLocLoading(true);
    try {
      const res = await workerApi.searchJobs(q);
      setLocJobs(res.jobs);
      setLocNote(res.expanded ? (res.message || "No jobs nearby — showing results within 60 miles") : "");
      setLocActive(q);
    } catch (e: unknown) {
      setLocError(e instanceof Error ? e.message : "Location search failed");
    } finally {
      setLocLoading(false);
    }
  };

  const clearLocationSearch = () => {
    setLocationQuery("");
    setLocJobs(null);
    setLocNote("");
    setLocActive("");
    setLocError("");
  };

  // Base list: location results when active, otherwise all jobs
  const baseJobs = locJobs ?? jobs;

  // Fuzzy filter: keep jobs with score > 0, sort by score desc
  const scored = search.trim()
    ? baseJobs
        .map((j) => ({ job: j, score: fuzzyScore(search, j) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.job)
    : baseJobs;

  const suggestion = scored.length === 0 && search.trim()
    ? bestSuggestion(search, baseJobs)
    : null;

  const userLang = user?.language_pref ?? "en";

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{b.label}</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>{b.title}</h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "6px 0 0" }}>{jobs.length} {b.title.toLowerCase()}</p>
      </motion.div>

      {/* Location search */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, maxWidth: 480, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <svg aria-hidden="true" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runLocationSearch()}
              placeholder="Search by city or town (e.g. Greensboro)"
              aria-label="Search jobs by location"
              style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, fontSize: 14, border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none", fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#fff", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>
          <button
            onClick={runLocationSearch}
            disabled={locLoading}
            style={{ padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: locLoading ? "#F3F4F6" : "#D4A853", border: "none", borderRadius: 8, cursor: locLoading ? "not-allowed" : "pointer", boxShadow: locLoading ? "none" : "0 2px 6px rgba(212,168,83,0.3)" }}
          >
            {locLoading ? "Searching…" : "Search area"}
          </button>
          {locActive && (
            <button
              onClick={clearLocationSearch}
              style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, fontFamily: "Inter, sans-serif", color: "#6B7280", background: "transparent", border: "1.5px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {locError && (
          <p role="alert" style={{ fontSize: 13, color: "#DC2626", margin: "8px 0 0" }}>{locError}</p>
        )}
        {locActive && !locError && (
          <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 0" }}>
            Showing jobs near <strong style={{ color: "#0A0F1E" }}>{locActive}</strong>
          </p>
        )}
        {locNote && (
          <div style={{ marginTop: 10, maxWidth: 480, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#92400E" }}>
            {locNote}
          </div>
        )}
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ position: "relative", maxWidth: 420 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={b.searchPlaceholder}
            style={{ width: "100%", paddingLeft: 36, paddingRight: search ? 32 : 14, paddingTop: 10, paddingBottom: 10, fontSize: 14, border: "1.5px solid #E5E7EB", borderRadius: 8, outline: "none", fontFamily: "Inter, sans-serif", color: "#0A0F1E", background: "#fff", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
            onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 14, padding: 2, lineHeight: 1 }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 64, color: "#6B7280" }}>{b.loading}</div>
      ) : scored.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 48, textAlign: "center" }}>
          <p style={{ color: "#6B7280", fontSize: 15, margin: 0 }}>
            {search ? b.noMatch : b.noJobs}
          </p>
          {suggestion && (
            <p style={{ marginTop: 12, fontSize: 14, color: "#0A0F1E" }}>
              Did you mean{" "}
              <button
                onClick={() => setSearch(suggestion)}
                style={{ color: "#C9A84C", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, padding: 0, textDecoration: "underline" }}
              >
                "{suggestion}"
              </button>
              ?
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {scored.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0A0F1E", margin: "0 0 4px" }}>{job.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>{job.restaurant_name || job.employer_name}</p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "3px 10px", borderRadius: 20 }}>{job.pay}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", background: "#F7F7F5", border: "1px solid #E5E7EB", padding: "3px 10px", borderRadius: 20 }}>{job.hours}</span>
                {job.location && (
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", background: "#F7F7F5", border: "1px solid #E5E7EB", padding: "3px 10px", borderRadius: 20 }}>{job.location}</span>
                )}
                {job.distance_miles != null && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", padding: "3px 10px", borderRadius: 20 }}>
                    <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {job.distance_miles < 1 ? "Less than 1 mile away"
                      : `${job.distance_miles} mile${job.distance_miles !== 1 ? "s" : ""} away`}
                  </span>
                )}
              </div>

              {job.description && (
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 4px", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {job.description}
                </p>
              )}

              {/* Translate / Simplify widget */}
              <TranslateWidget job={job} userLang={userLang} />

              {/* Contact methods the employer provided */}
              <ContactEmployer job={job} compact />

              <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", gap: 8 }}>
                <Link
                  to={`/worker/jobs/${job.id}/apply`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#0A0F1E", background: "#C9A84C", textDecoration: "none", padding: 10, borderRadius: 8, boxShadow: "0 2px 6px rgba(201,168,76,0.3)" }}
                >
                  {b.applyNow}
                </Link>
                <button
                  onClick={() => setShareJob(job)}
                  title="Share this job"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "10px 14px", background: "#F7F7F5", border: "1.5px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#0A0F1E", whiteSpace: "nowrap", flexShrink: 0 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#C9A84C"; (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#F7F7F5"; (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <EmploymentDisclosure />

      {shareJob && (
        <ShareModal jobId={shareJob.id} jobTitle={shareJob.title} onClose={() => setShareJob(null)} />
      )}
    </div>
  );
}
