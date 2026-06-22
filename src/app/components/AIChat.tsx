import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLang } from "../context/LanguageContext";

interface Message {
  role: "user" | "assistant";
  text: string;
}

function getResponse(input: string, responses: Record<string, string>): string {
  const lower = input.toLowerCase();
  if (lower.includes("screen") || lower.includes("ai") || lower.includes("score") || lower.includes("筛选") || lower.includes("评分")) {
    return responses.screening;
  }
  if (lower.includes("lang") || lower.includes("语言") || lower.includes("chinese") || lower.includes("mandarin") || lower.includes("spanish") || lower.includes("中文")) {
    return responses.languages;
  }
  if (lower.includes("pric") || lower.includes("cost") || lower.includes("fee") || lower.includes("$") || lower.includes("定价") || lower.includes("费用") || lower.includes("多少钱")) {
    return responses.pricing;
  }
  return responses.default;
}

export function AIChat() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", text: t.chat.welcome }]);
    }
  }, [open, t.chat.welcome]);

  useEffect(() => {
    if (open) {
      setMessages([{ role: "assistant", text: t.chat.welcome }]);
    }
  }, [t.chat.welcome]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getResponse(text, t.chat.responses);
      setTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 900 + Math.random() * 400);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #C9A84C 0%, #e8c46a 100%)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(201,168,76,0.5), 0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0A0F1E",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none"
            >
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="22" height="22" viewBox="0 0 24 24" fill="none"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              bottom: 96,
              right: 28,
              zIndex: 999,
              width: 340,
              maxHeight: 520,
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: "0 24px 64px rgba(10,15,30,0.2), 0 4px 16px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A0F1E 0%, #13203a 100%)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #C9A84C, #e8c46a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#0A0F1E" strokeWidth="1.5" />
                  <path d="M8.5 12c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5" stroke="#0A0F1E" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.2" fill="#0A0F1E" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>{t.chat.title}</div>
                <div style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>{t.chat.subtitle}</div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>online</span>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                scrollbarWidth: "none",
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 13px",
                      borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: msg.role === "user" ? "#C9A84C" : "#F7F7F5",
                      color: msg.role === "user" ? "#0A0F1E" : "#0A0F1E",
                      fontSize: 13,
                      fontWeight: 400,
                      lineHeight: 1.55,
                      border: msg.role === "assistant" ? "1px solid #E5E7EB" : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "14px 14px 14px 4px",
                      background: "#F7F7F5",
                      border: "1px solid #E5E7EB",
                      display: "flex",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: d * 0.15, repeat: Infinity }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#9CA3AF",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {t.chat.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#6B7280",
                      background: "#F7F7F5",
                      border: "1px solid #E5E7EB",
                      borderRadius: 20,
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "#FAFAFA",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder={t.chat.placeholder}
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  color: "#0A0F1E",
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "8px 12px",
                  outline: "none",
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: input.trim() ? "#C9A84C" : "#F3F4F6",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={input.trim() ? "#0A0F1E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
