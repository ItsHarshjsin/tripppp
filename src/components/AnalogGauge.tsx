type Props = { value: number; max: number; unit: string };

const START = 135;
const SWEEP = 270;

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
};

const arc = (r: number, from: number, to: number) => {
  const [x1, y1] = polar(120, 120, r, from);
  const [x2, y2] = polar(120, 120, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

export function AnalogGauge({ value, max, unit }: Props) {
  const clamped = Math.min(Math.max(value, 0), max);
  const ratio = clamped / max;
  const angle = START + ratio * SWEEP;
  const ticks = Array.from({ length: 13 }, (_, i) => i);

  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <path
        d={arc(102, START, START + SWEEP)}
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={arc(102, START, Math.max(START + 0.01, angle))}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="10"
        strokeLinecap="round"
        style={{ transition: "d 0.4s ease" }}
      />
      {ticks.map((i) => {
        const a = START + (i / (ticks.length - 1)) * SWEEP;
        const major = i % 2 === 0;
        const [x1, y1] = polar(120, 120, major ? 82 : 86, a);
        const [x2, y2] = polar(120, 120, 90, a);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-muted-foreground)"
            strokeWidth={major ? 2.5 : 1.5}
            strokeLinecap="round"
            opacity={major ? 0.9 : 0.5}
          />
        );
      })}
      {ticks
        .filter((i) => i % 2 === 0)
        .map((i) => {
          const a = START + (i / (ticks.length - 1)) * SWEEP;
          const [x, y] = polar(120, 120, 66, a);
          return (
            <text
              key={i}
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-muted-foreground)"
            >
              {Math.round((i / (ticks.length - 1)) * max)}
            </text>
          );
        })}
      <g
        style={{ transition: "transform 0.4s ease", transformOrigin: "120px 120px" }}
        transform={`rotate(${angle} 120 120)`}
      >
        <line
          x1="120"
          y1="128"
          x2="120"
          y2="46"
          stroke="var(--color-accent)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <circle cx="120" cy="120" r="8" fill="var(--color-card)" stroke="var(--color-accent)" strokeWidth="3" />
      <text
        x="120"
        y="172"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill="var(--color-foreground)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {clamped < 10 ? clamped.toFixed(1) : Math.round(clamped)}
      </text>
      <text x="120" y="192" textAnchor="middle" fontSize="12" fill="var(--color-muted-foreground)">
        {unit}
      </text>
    </svg>
  );
}
