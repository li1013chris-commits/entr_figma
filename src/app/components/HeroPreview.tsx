import { motion } from "motion/react";

export function EmployerDashboardPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        aspectRatio: "16 / 10",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#F7F7F5",
          padding: "12px 16px",
          borderBottom: "1px solid #E5E7EB",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FCD34D",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#10B981",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#EF4444",
          }}
        />
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            fontSize: 11,
            color: "#9CA3AF",
            fontFamily: "monospace",
          }}
        >
          employer.entr.app/dashboard
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 28, fontFamily: "Inter, sans-serif", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>Dashboard</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", margin: "6px 0 0" }}>Your Restaurants</h2>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Active Jobs", value: "5" },
            { label: "Total Applications", value: "23" },
            { label: "Verified Workers", value: "8" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#F7F7F5",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0, fontWeight: 500 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", margin: "3px 0 0" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Job List */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 14, flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#0A0F1E", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recent Jobs</p>
          {[
            { title: "Line Cook", location: "San Francisco, CA", apps: "4" },
            { title: "Host", location: "Oakland, CA", apps: "3" },
            { title: "Prep Cook", location: "San Jose, CA", apps: "5" },
          ].map((job, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 8,
                borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#0A0F1E", margin: 0 }}>
                  {job.title}
                </p>
                <p style={{ fontSize: 10, color: "#9CA3AF", margin: "2px 0 0" }}>
                  {job.location}
                </p>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#C9A84C",
                  background: "#FFFBF0",
                  padding: "3px 8px",
                  borderRadius: 16,
                  whiteSpace: "nowrap",
                  marginLeft: 8,
                }}
              >
                {job.apps} apps
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkerBrowseJobsPreview() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        aspectRatio: "16 / 10",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#F7F7F5",
          padding: "12px 16px",
          borderBottom: "1px solid #E5E7EB",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#FCD34D",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#10B981",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#EF4444",
          }}
        />
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            fontSize: 11,
            color: "#9CA3AF",
            fontFamily: "monospace",
          }}
        >
          worker.entr.app/jobs
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 28, fontFamily: "Inter, sans-serif", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>Find Work</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", margin: "6px 0 0" }}>Browse Jobs</h2>
        </div>

        {/* Search bar */}
        <div
          style={{
            background: "#F7F7F5",
            border: "1.5px solid #E5E7EB",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 14,
            fontSize: 12,
            color: "#9CA3AF",
          }}
        >
          Search jobs, restaurants...
        </div>

        {/* Job Cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
          {[
            { title: "Line Cook", restaurant: "Golden Dragon", pay: "$22/hr", location: "SF" },
            { title: "Server", restaurant: "Trattoria Luna", pay: "$18/hr + tips", location: "Oakland" },
            { title: "Dishwasher", restaurant: "Bay Area Grill", pay: "$17/hr", location: "SJ" },
          ].map((job, i) => (
            <div
              key={i}
              style={{
                background: "#F7F7F5",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0F1E", margin: 0 }}>
                    {job.title}
                  </p>
                  <p style={{ fontSize: 10, color: "#9CA3AF", margin: "1px 0 0" }}>
                    {job.restaurant}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#16A34A",
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    padding: "2px 8px",
                    borderRadius: 16,
                    whiteSpace: "nowrap",
                    marginLeft: 8,
                  }}
                >
                  {job.pay}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "#6B7280" }}>{job.location}</span>
                <button
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#0A0F1E",
                    background: "#C9A84C",
                    border: "none",
                    borderRadius: 6,
                    padding: "3px 10px",
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
