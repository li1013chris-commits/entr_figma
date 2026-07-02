/**
 * Subtle back-navigation arrow. Small, gray, top-left, above the form.
 * Uses browser history so it returns wherever the user came from.
 */
export function BackArrow({ floating = false }: { floating?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label="Go back"
      title="Go back"
      style={{
        ...(floating
          ? { position: "absolute" as const, top: 20, left: 20 }
          : { display: "inline-flex", marginBottom: 10 }),
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        background: "transparent",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        color: "#9CA3AF",
        padding: 0,
        transition: "color 0.15s, background 0.15s",
        display: "inline-flex",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "#0A0F1E";
        (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "#9CA3AF";
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    </button>
  );
}
