/**
 * Client-side "unseen" tracking that powers the red count badges.
 *
 * Employers: how many new applicants arrived per job since they last opened
 * that job's applications page.
 * Workers: how many of their applications changed status since they last
 * looked at their dashboard, plus interviews still waiting for confirmation.
 *
 * Seen-state lives in localStorage (per user id) so it survives reloads.
 * Components listen for the "entr-notifications-changed" event to refresh
 * badges as soon as something is marked seen.
 */

export const NOTIFICATIONS_CHANGED = "entr-notifications-changed";

function read(key: string): Record<string, unknown> {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function write(key: string, value: Record<string, unknown>) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* private mode etc. */ }
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
}

// ── Employer: unseen applicants ────────────────────────────────────────────────

const appsKey = (userId: number) => `entr_seen_apps_${userId}`;

export function unseenForJob(userId: number, jobId: number, applicationCount: number): number {
  const seen = Number(read(appsKey(userId))[jobId] ?? 0);
  return Math.max(0, (applicationCount ?? 0) - seen);
}

export function totalUnseenApplications(
  userId: number,
  jobs: { id: number; application_count?: number | null }[],
): number {
  return jobs.reduce((sum, j) => sum + unseenForJob(userId, j.id, j.application_count ?? 0), 0);
}

export function markJobApplicationsSeen(userId: number, jobId: number, count: number) {
  const map = read(appsKey(userId));
  map[jobId] = count;
  write(appsKey(userId), map);
}

// ── Worker: status updates on own applications ─────────────────────────────────

const statusKey = (userId: number) => `entr_seen_status_${userId}`;

/** Applications whose status changed since the worker last viewed the dashboard. */
export function countStatusUpdates(
  userId: number,
  applications: { id: number; status: string }[],
): number {
  const seen = read(statusKey(userId));
  return applications.filter((a) => String(seen[a.id] ?? "pending") !== a.status).length;
}

export function markStatusesSeen(
  userId: number,
  applications: { id: number; status: string }[],
) {
  const map: Record<string, unknown> = {};
  for (const a of applications) map[a.id] = a.status;
  write(statusKey(userId), map);
}
