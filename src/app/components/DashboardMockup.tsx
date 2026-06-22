export function DashboardMockup() {
  const jobs = [
    { title: "Line Cook", location: "Brooklyn, NY", applicants: 14, status: "Active", statusColor: "#22c55e" },
    { title: "Prep Cook", location: "Queens, NY", applicants: 8, status: "Active", statusColor: "#22c55e" },
    { title: "Server", location: "Manhattan, NY", applicants: 21, status: "Reviewing", statusColor: "#C9A84C" },
  ];

  const candidates = [
    { name: "Maria G.", role: "Line Cook", verified: true, score: 94, initials: "MG", bg: "#dbeafe" },
    { name: "Carlos R.", role: "Prep Cook", verified: true, score: 88, initials: "CR", bg: "#dcfce7" },
    { name: "Anh T.", role: "Server", verified: true, score: 91, initials: "AT", bg: "#fef9c3" },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 24px 64px rgba(10,15,30,0.18), 0 4px 16px rgba(10,15,30,0.08)",
        border: "1px solid #E5E7EB",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#F7F7F5",
          borderBottom: "1px solid #E5E7EB",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            background: "#ffffff",
            border: "1px solid #E5E7EB",
            borderRadius: 6,
            padding: "3px 12px",
            fontSize: 11,
            color: "#6B7280",
            fontWeight: 300,
          }}
        >
          app.entr.work/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div style={{ padding: 20, background: "#FAFAFA" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E" }}>Employer Dashboard</div>
            <div style={{ fontSize: 11, fontWeight: 300, color: "#6B7280" }}>3 active postings</div>
          </div>
          <div
            style={{
              background: "#C9A84C",
              color: "#0A0F1E",
              fontSize: 11,
              fontWeight: 600,
              padding: "5px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            + Post Job
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Total Applicants", value: "43" },
            { label: "AI Verified", value: "38" },
            { label: "Interviews Set", value: "7" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, color: "#0A0F1E" }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 300, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Job listings */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Active Jobs
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {jobs.map((job) => (
              <div
                key={job.title}
                style={{
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E" }}>{job.title}</div>
                  <div style={{ fontSize: 10, fontWeight: 300, color: "#6B7280" }}>{job.location}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 300, color: "#6B7280" }}>{job.applicants} applicants</div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: job.statusColor,
                      background: `${job.statusColor}18`,
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top candidates */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Top Candidates
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {candidates.map((c) => (
              <div
                key={c.name}
                style={{
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: c.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#0A0F1E",
                    flexShrink: 0,
                  }}
                >
                  {c.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E" }}>{c.name}</span>
                    {c.verified && (
                      <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 600 }}>AI Verified</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 300, color: "#6B7280" }}>{c.role}</div>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#C9A84C",
                    background: "#fef9e7",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {c.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
