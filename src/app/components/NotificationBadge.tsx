/**
 * Small red circle with a count (1, 2, …), pinned to the top-right corner of
 * its relatively-positioned parent. Renders nothing when the count is zero,
 * and never shifts surrounding layout (absolute positioning).
 */
export function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={`${count} new`}
      style={{
        position: "absolute",
        top: -6,
        right: -8,
        minWidth: 16,
        height: 16,
        padding: "0 4px",
        borderRadius: 999,
        background: "#DC2626",
        color: "#ffffff",
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        boxSizing: "border-box",
        boxShadow: "0 1px 3px rgba(220,38,38,0.4)",
        pointerEvents: "none",
      }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
