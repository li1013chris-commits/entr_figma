const BASE = "https://entr-production.up.railway.app";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.error || message;
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

function json(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  role: "employer" | "worker";
  phone: string | null;
  language_pref: string;
  language_dialect: string | null;
  bio: string | null;
  experience_years: number | null;
  languages_spoken: string | null;
  restaurant_name: string | null;
  // Worker profile fields
  skills: string | null;
  availability: string | null;
  profile_complete: boolean;
}

export interface Job {
  id: number;
  employer_id: number;
  title: string;
  description: string | null;
  pay: string;
  hours: string;
  experience_required: number;
  language_preference: string | null;
  location: string | null;
  status: "open" | "closed";
  created_at: string;
  expires_at?: string | null;
  application_count?: number;
  employer_name?: string;
  restaurant_name?: string;
  // Structured pay (Step 2)
  pay_amount?: string | null;
  pay_type?: string | null;
  tips_included?: number;
  skills_text?: string | null;
  additional_info?: string | null;
  // Contact methods (Step 3)
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_wechat?: string | null;
  contact_line?: string | null;
  contact_gchat?: string | null;
  // Location search
  distance_miles?: number;
}

export interface Application {
  id: number;
  job_id: number;
  worker_id: number;
  cover_letter: string | null;
  ai_score: number | null;
  ai_summary: string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected" | "hired";
  created_at: string;
  // joined fields
  name?: string;
  email?: string;
  phone?: string | null;
  bio?: string | null;
  experience_years?: number | null;
  languages_spoken?: string | null;
  verification_status?: string | null;
  age_verified?: number | null;
  face_match_score?: number | null;
  extracted_name?: string | null;
  extracted_dob?: string | null;
  verification_id?: number | null;
  // worker view joins
  title?: string;
  pay?: string;
  hours?: string;
  location?: string | null;
  employer_name?: string;
  restaurant_name?: string | null;
  // referral data (employer view)
  referrals?: Referral[];
  referral_count?: number;
  already_referred?: boolean;
}

export interface EmployerVerification {
  id: number;
  employer_id: number;
  business_license_path: string | null;
  business_name_entered: string | null;
  address_entered: string | null;
  extracted_business_name: string | null;
  extracted_address: string | null;
  document_type: string | null;
  match_confidence: number | null;
  business_verified: number;
  business_verification_status: "pending" | "verified" | "failed";
  verified_at: string | null;
  failure_reason: string | null;
}

export interface Referral {
  id: number;
  referring_employer_id: number;
  referral_note: string | null;
  created_at: string;
  employer_name: string;
  restaurant_name: string | null;
}

export interface Verification {
  id: number;
  worker_id: number;
  id_document_path: string | null;
  selfie_path: string | null;
  extracted_name: string | null;
  extracted_dob: string | null;
  face_match_score: number | null;
  age_verified: number;
  identity_verified: number;
  verification_status: "pending" | "verified" | "flagged" | "manual_review";
  failure_reason: string | null;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  me: () => request<{ user: User | null }>("/api/auth/me"),

  signup: (body: {
    email: string;
    password: string;
    name: string;
    role: "employer" | "worker";
    language_pref?: string;
    restaurant_name?: string;
    phone?: string;
  }) => request<{ user: User }>("/api/auth/signup", json(body)),

  login: (body: { email: string; password: string }) =>
    request<{ user: User }>("/api/auth/login", json(body)),

  logout: () =>
    request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

  forgotPassword: (email: string) =>
    request<{ ok: boolean }>("/api/auth/forgot-password", json({ email })),

  resetPassword: (token: string, new_password: string) =>
    request<{ ok: boolean }>("/api/auth/reset-password", json({ token, new_password })),
};

// ── Employer ───────────────────────────────────────────────────────────────

export const employerApi = {
  getJobs: () => request<{ jobs: Job[] }>("/api/employer/jobs"),

  createJob: (body: {
    title: string;
    pay_amount: string;
    pay_type: string;
    tips_included: boolean;
    hours: string;
    experience_required: number;
    location: string;
    skills_text?: string;
    additional_info?: string;
    contact_phone?: string;
    contact_whatsapp?: string;
    contact_wechat?: string;
    contact_line?: string;
    contact_gchat?: string;
  }) => request<{ job: Job }>("/api/employer/jobs", json(body)),

  toggleJob: (jobId: number) =>
    request<{ status: string }>(
      `/api/employer/jobs/${jobId}/toggle`,
      { method: "POST" }
    ),

  renewJob: (jobId: number) =>
    request<{ ok: boolean; expires_at: string }>(
      `/api/employer/jobs/${jobId}/renew`,
      { method: "POST" }
    ),

  getApplications: (jobId: number) =>
    request<{ job: Job; applications: Application[] }>(
      `/api/employer/jobs/${jobId}/applications`
    ),

  updateApplicationStatus: (appId: number, status: string) =>
    request<{ ok: boolean }>(
      `/api/employer/applications/${appId}/status`,
      json({ status })
    ),
};

// ── Worker ─────────────────────────────────────────────────────────────────

export interface JobSearchResult {
  jobs: Job[];
  radius_miles: number | null;
  expanded: boolean;
  message?: string;
}

export const workerApi = {
  getJobs: () => request<{ jobs: Job[] }>("/api/worker/jobs"),

  searchJobs: (location: string) =>
    request<JobSearchResult>(
      `/api/worker/jobs/search?location=${encodeURIComponent(location)}`
    ),

  apply: (jobId: number, cover_letter: string) =>
    request<{ application: Application }>(
      `/api/worker/jobs/${jobId}/apply`,
      json({ cover_letter })
    ),

  getApplications: () =>
    request<{ applications: Application[] }>("/api/worker/applications"),

  getVerification: () =>
    request<{ verification: Verification | null }>("/api/worker/verify"),

  uploadId: (file: File) => {
    const form = new FormData();
    form.append("id_document", file);
    return request<{ step: number; message: string }>(
      "/api/worker/verify/upload-id",
      { method: "POST", body: form }
    );
  },

  uploadSelfie: (file: File) => {
    const form = new FormData();
    form.append("selfie", file);
    return request<{ verification: Verification }>(
      "/api/worker/verify/upload-selfie",
      { method: "POST", body: form }
    );
  },

  resubmitVerification: () =>
    request<{ ok: boolean }>("/api/worker/verify/resubmit", { method: "POST" }),

  translateJob: (jobId: number, action: "translate" | "simplify", lang: string) =>
    request<{ result: string }>(
      `/api/worker/jobs/${jobId}/translate`,
      json({ action, lang })
    ),

  updateProfile: (body: {
    bio: string;
    experience_years: number;
    languages_spoken: string;
    phone: string;
    skills?: string;
    availability?: string;
  }) =>
    request<{ user: User }>("/api/worker/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  completeProfile: (body: {
    phone: string;
    languages_spoken: string;
    experience_years: number;
    skills: string;
    availability: string;
    bio: string;
  }) =>
    request<{ user: User }>("/api/worker/profile/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};

// ── Employer verification ─────────────────────────────────────────────────────

export const employerVerifyApi = {
  getStatus: () =>
    request<{ verification: EmployerVerification | null }>("/api/employer/verify"),

  submit: (businessName: string, businessAddress: string, file: File) => {
    const form = new FormData();
    form.append("business_name", businessName);
    form.append("business_address", businessAddress);
    form.append("business_document", file);
    return request<{ verification: EmployerVerification }>(
      "/api/employer/verify/submit",
      { method: "POST", body: form }
    );
  },
};

// ── User account ──────────────────────────────────────────────────────────────

export const userApi = {
  deleteAccount: () =>
    request<{ ok: boolean }>("/api/user/delete-account", { method: "POST" }),
};

// ── Buddy chatbot ──────────────────────────────────────────────────────────────

export interface BuddyTurn {
  role: "user" | "assistant";
  content: string;
}

export const buddyApi = {
  send: (message: string, history: BuddyTurn[]) =>
    request<{ reply: string }>("/api/buddy", json({ message, history })),
};

// ── Public jobs ────────────────────────────────────────────────────────────────

export const publicApi = {
  getJob: (jobId: number) =>
    request<{ job: Job }>(`/api/jobs/${jobId}/public`),
};

// ── Referrals ─────────────────────────────────────────────────────────────────

export const referralApi = {
  create: (appId: number, note: string) =>
    request<{ ok: boolean }>(
      `/api/employer/applications/${appId}/refer`,
      json({ note })
    ),

  revoke: (referralId: number) =>
    request<{ ok: boolean }>(
      `/api/employer/referrals/${referralId}/revoke`,
      { method: "POST" }
    ),
};
