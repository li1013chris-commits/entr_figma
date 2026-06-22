import { useState } from "react";
import { motion } from "motion/react";

interface ExtractionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  details?: string;
  timestamp?: string;
}

export function TestVerificationPage() {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [idResult, setIdResult] = useState<ExtractionResult | null>(null);
  const [selfieResult, setSelfieResult] = useState<ExtractionResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "id" | "selfie"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      addLog(`Selected ${type} file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      if (type === "id") {
        setIdFile(file);
      } else {
        setSelfieFile(file);
      }
    }
  };

  const extractFromImage = async (file: File, type: "id" | "selfie") => {
    if (!file) return;

    addLog(`Starting ${type} extraction...`);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      addLog(`Sending ${type} to backend API...`);

      const response = await fetch("/api/admin/test-verification", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      addLog(`Received response with status: ${response.status}`);

      if (response.ok) {
        addLog(`${type} extraction succeeded`);
        const result = {
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
        };
        if (type === "id") {
          setIdResult(result);
        } else {
          setSelfieResult(result);
        }
      } else {
        addLog(`${type} extraction failed: ${data.error || "Unknown error"}`);
        const result = {
          success: false,
          error: data.error || "Unknown error",
          details: data.details,
          timestamp: new Date().toISOString(),
        };
        if (type === "id") {
          setIdResult(result);
        } else {
          setSelfieResult(result);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      addLog(`Error: ${errorMsg}`);
      const result = {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      };
      if (type === "id") {
        setIdResult(result);
      } else {
        setSelfieResult(result);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px 24px",
        fontFamily: "Inter, sans-serif",
        color: "#0A0F1E",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 40 }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>
            Claude Vision ID Test
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
            Upload government ID and selfie to test Claude Vision extraction
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* ID Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>
              Government ID
            </h2>
            <div
              style={{
                border: "2px dashed #D1D5DB",
                borderRadius: 8,
                padding: 24,
                textAlign: "center",
                marginBottom: 16,
                background: "#F9FAFB",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "id")}
                style={{ display: "none" }}
                id="id-input"
                disabled={loading}
              />
              <label
                htmlFor="id-input"
                style={{
                  display: "block",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
                  Click to upload or drag and drop
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                  PNG, JPG, GIF up to 10MB
                </div>
              </label>
              {idFile && (
                <div style={{ marginTop: 12, fontSize: 13, color: "#059669" }}>
                  ✓ {idFile.name}
                </div>
              )}
            </div>
            <button
              onClick={() => idFile && extractFromImage(idFile, "id")}
              disabled={!idFile || loading}
              style={{
                width: "100%",
                padding: "10px",
                background: idFile && !loading ? "#C9A84C" : "#E5E7EB",
                color: "#0A0F1E",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: idFile && !loading ? "pointer" : "not-allowed",
                opacity: idFile && !loading ? 1 : 0.6,
              }}
            >
              {loading ? "Extracting..." : "Extract ID Data"}
            </button>

            {idResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 16 }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    background: idResult.success ? "#D1FAE5" : "#FEE2E2",
                    border: `1px solid ${
                      idResult.success ? "#6EE7B7" : "#FECACA"
                    }`,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: idResult.success ? "#065F46" : "#991B1B",
                    }}
                  >
                    {idResult.success ? "✓ Success" : "✗ Failed"}
                  </div>
                </div>

                {idResult.data && (
                  <div
                    style={{
                      background: "#F3F4F6",
                      border: "1px solid #D1D5DB",
                      borderRadius: 6,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        color: "#374151",
                        maxHeight: 300,
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(idResult.data, null, 2)}
                    </div>
                  </div>
                )}

                {idResult.error && (
                  <div style={{ fontSize: 12, color: "#DC2626", marginBottom: 8 }}>
                    Error: {idResult.error}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Selfie Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>
              Selfie
            </h2>
            <div
              style={{
                border: "2px dashed #D1D5DB",
                borderRadius: 8,
                padding: 24,
                textAlign: "center",
                marginBottom: 16,
                background: "#F9FAFB",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "selfie")}
                style={{ display: "none" }}
                id="selfie-input"
                disabled={loading}
              />
              <label
                htmlFor="selfie-input"
                style={{
                  display: "block",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
                  Click to upload or drag and drop
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                  PNG, JPG, GIF up to 10MB
                </div>
              </label>
              {selfieFile && (
                <div style={{ marginTop: 12, fontSize: 13, color: "#059669" }}>
                  ✓ {selfieFile.name}
                </div>
              )}
            </div>
            <button
              onClick={() => selfieFile && extractFromImage(selfieFile, "selfie")}
              disabled={!selfieFile || loading}
              style={{
                width: "100%",
                padding: "10px",
                background: selfieFile && !loading ? "#C9A84C" : "#E5E7EB",
                color: "#0A0F1E",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: selfieFile && !loading ? "pointer" : "not-allowed",
                opacity: selfieFile && !loading ? 1 : 0.6,
              }}
            >
              {loading ? "Extracting..." : "Extract Face Data"}
            </button>

            {selfieResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 16 }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    background: selfieResult.success ? "#D1FAE5" : "#FEE2E2",
                    border: `1px solid ${
                      selfieResult.success ? "#6EE7B7" : "#FECACA"
                    }`,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: selfieResult.success ? "#065F46" : "#991B1B",
                    }}
                  >
                    {selfieResult.success ? "✓ Success" : "✗ Failed"}
                  </div>
                </div>

                {selfieResult.data && (
                  <div
                    style={{
                      background: "#F3F4F6",
                      border: "1px solid #D1D5DB",
                      borderRadius: 6,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        color: "#374151",
                        maxHeight: 300,
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(selfieResult.data, null, 2)}
                    </div>
                  </div>
                )}

                {selfieResult.error && (
                  <div style={{ fontSize: 12, color: "#DC2626", marginBottom: 8 }}>
                    Error: {selfieResult.error}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginTop: 24,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>
            Detailed Logs
          </h2>
          <div
            style={{
              background: "#1F2937",
              color: "#D1D5DB",
              padding: 16,
              borderRadius: 8,
              fontFamily: "monospace",
              fontSize: 11,
              maxHeight: 300,
              overflow: "auto",
              lineHeight: 1.6,
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: "#9CA3AF" }}>No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))
            )}
          </div>
          <button
            onClick={() => {
              setLogs([]);
              setIdResult(null);
              setSelfieResult(null);
              setIdFile(null);
              setSelfieFile(null);
            }}
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "#F3F4F6",
              border: "1px solid #D1D5DB",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            Clear All
          </button>
        </motion.div>
      </div>
    </div>
  );
}
