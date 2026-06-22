import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useLang } from "../context/LanguageContext";

function useCountUp(target: number | null, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === null) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function MetricCell({
  value,
  label,
  description,
  hasBorder,
  index,
}: {
  value: string;
  label: string;
  description: string;
  hasBorder: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // Extract numeric portion for counting animation
  const numMatch = value.match(/^(\d+)/);
  const numericTarget = numMatch ? parseInt(numMatch[1]) : null;
  const suffix = numMatch ? value.slice(numMatch[1].length) : value;
  const countedNum = useCountUp(inView ? numericTarget : null);
  const displayValue = numericTarget !== null ? `${countedNum}${suffix}` : value;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="metrics-cell"
      style={{
        padding: "56px 40px",
        textAlign: "center",
        borderRight: hasBorder ? "1px solid #E5E7EB" : "none",
      }}
    >
      <motion.div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 36,
          fontWeight: 700,
          color: "#0A0F1E",
          lineHeight: 1.1,
          letterSpacing: "-0.5px",
          marginBottom: 4,
        }}
      >
        {displayValue}
      </motion.div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#C9A84C",
          marginBottom: 12,
          letterSpacing: "-0.25px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 300,
          color: "#6B7280",
          lineHeight: 1.65,
          maxWidth: 260,
          margin: "0 auto",
        }}
      >
        {description}
      </div>
    </motion.div>
  );
}

export function MetricsBar() {
  const { t } = useLang();
  const metrics = [
    t.metrics.languages,
    t.metrics.aiVerified,
    t.metrics.jobPost,
  ];

  return (
    <section
      style={{
        background: "#F7F7F5",
        borderTop: "1px solid #E5E7EB",
        borderBottom: "1px solid #E5E7EB",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        className="metrics-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {metrics.map((metric, i) => (
          <MetricCell
            key={i}
            value={metric.value}
            label={metric.label}
            description={metric.desc}
            hasBorder={i < metrics.length - 1}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
