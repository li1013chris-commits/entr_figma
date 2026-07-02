export function EmploymentDisclosure({ style = {} }: { style?: React.CSSProperties }) {
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
      ENTR is a hiring platform and is not the employer. All employment decisions
      are made by the restaurant owner.
    </p>
  );
}
