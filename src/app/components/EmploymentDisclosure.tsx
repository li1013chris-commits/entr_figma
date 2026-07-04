import { useLang } from "../context/LanguageContext";

export function EmploymentDisclosure({ style = {} }: { style?: React.CSSProperties }) {
  const { t } = useLang();
  return (
    <p
      style={{
        fontSize: 12.5,
        color: "#9CA3AF",
        lineHeight: 1.6,
        textAlign: "center",
        margin: "28px auto 0",
        maxWidth: 560,
        ...style,
      }}
    >
      {t.app.disclosure}
    </p>
  );
}
