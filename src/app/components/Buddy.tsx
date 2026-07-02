import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { buddyApi, type BuddyTurn } from "../api/client";

/**
 * Buddy — ENTR's floating help chatbot.
 * Appears on every page. Stateless: the conversation lives only while the
 * window is open and is wiped completely when it closes.
 */

const NAVY = "#0A0F1E";
const GOLD = "#D4A853";

const WELCOME =
  "Hi! I'm Buddy. I can help you use ENTR — posting jobs, applying, " +
  "verifying your identity, scheduling interviews, or translating text. " +
  "You can write to me in any language.";

interface Message {
  role: "user" | "assistant";
  text: string;
  error?: boolean;
}

export function Buddy() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Opening starts a fresh session; closing wipes everything.
  const toggle = () => {
    if (open) {
      setOpen(false);
      setMessages([]);
      setInput("");
      setTyping(false);
    } else {
      setOpen(true);
      setMessages([{ role: "assistant", text: WELCOME }]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;

    // Session-only history for the stateless backend (skip the local welcome line)
    const history: BuddyTurn[] = messages
      .filter((m) => !m.error && m.text !== WELCOME)
      .map((m) => ({ role: m.role, content: m.text }));

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);
    try {
      const res = await buddyApi.send(text, history);
      setMessages((prev) => [...prev, { role: "assistant", text: res.reply }]);
    } catch (e: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: e instanceof Error ? e.message : "Sorry, I could not answer right now. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* Floating circle button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close Buddy chat" : "Open Buddy chat"}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: NAVY,
          border: `2px solid ${GOLD}`,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(10,15,30,0.45), 0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.span
              key="b"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 24,
                fontWeight: 800,
                color: GOLD,
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              B
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-label="Buddy chat"
            style={{
              position: "fixed",
              bottom: 96,
              right: 28,
              zIndex: 999,
              width: "min(360px, calc(100vw - 32px))",
              height: "min(540px, calc(100vh - 130px))",
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: "0 24px 64px rgba(10,15,30,0.25), 0 4px 16px rgba(0,0,0,0.1)",
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
                background: NAVY,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexShrink: 0,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: GOLD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: NAVY,
                }}
              >
                B
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>Buddy</div>
                <div style={{ fontSize: 11.5, fontWeight: 400, color: "rgba(255,255,255,0.65)" }}>
                  Ask me anything about ENTR
                </div>
              </div>
              <button
                onClick={toggle}
                aria-label="Close Buddy chat"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  padding: 6,
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "84%",
                      padding: "10px 13px",
                      borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: msg.role === "user" ? GOLD : msg.error ? "#FEF2F2" : "#F7F7F5",
                      color: msg.error ? "#DC2626" : NAVY,
                      fontSize: 14,
                      lineHeight: 1.55,
                      border: msg.role === "assistant"
                        ? `1px solid ${msg.error ? "#FECACA" : "#E5E7EB"}`
                        : "none",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div style={{ display: "flex", justifyContent: "flex-start" }} aria-label="Buddy is typing">
                  <div
                    style={{
                      padding: "11px 14px",
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
                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#9CA3AF" }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "12px 14px",
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "#FAFAFA",
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Type in any language…"
                aria-label="Message Buddy"
                lang=""
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: "Inter, sans-serif",
                  color: NAVY,
                  background: "#ffffff",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "9px 12px",
                  outline: "none",
                  minWidth: 0,
                }}
                onFocus={(e) => (e.target.style.borderColor = GOLD)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                aria-label="Send message"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: input.trim() && !typing ? GOLD : "#F3F4F6",
                  border: "none",
                  cursor: input.trim() && !typing ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                    stroke={input.trim() && !typing ? NAVY : "#9CA3AF"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
