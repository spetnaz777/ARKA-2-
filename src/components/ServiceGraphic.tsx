import { ContourPattern, DotMatrix } from "./graphics";

/* One signature graphic per discipline, all in the shared line language:
   ai → semiconductor pathways, web → architectural interface layers,
   marketing → data contours, consulting → modular system diagram. */
export function ServiceGraphic({ kind }: { kind: "ai" | "web" | "marketing" | "consulting" }) {
  return (
    <div className={`svc-graphic svc-graphic--${kind}`} aria-hidden="true">
      {kind === "ai" && <AiGraphic />}
      {kind === "web" && <WebGraphic />}
      {kind === "marketing" && <ContourPattern variant={2} lines={40} className="svc-graphic__contour" />}
      {kind === "consulting" && <ConsultingGraphic />}
      <DotMatrix cols={5} rows={4} gap={12} className="svc-graphic__dots" />
    </div>
  );
}

function AiGraphic() {
  // central die with pins, traces leaving at 45° and terminating in nodes
  const traces = [
    "M200 150 V110 L170 80 H60",
    "M220 150 V90 L250 60 H360",
    "M240 150 V120 L270 90 H330 L350 70",
    "M180 150 V130 L150 100 H90",
    "M200 250 V290 L170 320 H70",
    "M220 250 V300 L250 330 H340",
    "M240 250 V270 L270 300 H380",
    "M160 190 H110 L80 160 H30",
    "M160 210 H90 L60 240 H20",
    "M280 190 H330 L360 160 H400",
    "M280 210 H350 L380 240 H410",
  ];
  const ends = [
    [60, 80], [360, 60], [350, 70], [90, 100], [70, 320], [340, 330], [380, 300], [30, 160], [20, 240], [400, 160], [410, 240],
  ];
  return (
    <svg viewBox="0 0 430 400" fill="none" className="svc-graphic__svg">
      {traces.map((d, i) => (
        <path key={i} d={d} className={`tr ${i % 4 === 0 ? "tr--ink" : "tr--line"} draw-auto`} pathLength={1} style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
      {ends.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} className="nd nd--bg" />
      ))}
      <rect x="160" y="150" width="120" height="100" className="die" />
      <rect x="185" y="172" width="70" height="56" className="tr tr--line" />
      <path d="M160 150 l14 -0 M280 250 l-14 0" className="tr tr--thick" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <g key={k}>
          <line x1={170 + k * 20} y1={150} x2={170 + k * 20} y2={142} className="tr tr--line" />
          <line x1={170 + k * 20} y1={250} x2={170 + k * 20} y2={258} className="tr tr--line" />
        </g>
      ))}
    </svg>
  );
}

function WebGraphic() {
  return (
    <svg viewBox="0 0 430 400" fill="none" className="svc-graphic__svg">
      {[0, 1, 2].map((k) => {
        const x = 40 + k * 46;
        const y = 50 + k * 46;
        return (
          <g key={k} className="layer" style={{ animationDelay: `${k * 0.6}s` }}>
            <path d={`M${x + 16} ${y} H${x + 280} V${y + 190} L${x + 264} ${y + 206} H${x} V${y + 16} Z`} className={`panel ${k === 2 ? "panel--front" : ""}`} />
            <line x1={x} y1={y + 34} x2={x + 280} y2={y + 34} className="tr tr--faint" />
            <circle cx={x + 16} cy={y + 17} r={3} className="nd" />
            <circle cx={x + 28} cy={y + 17} r={3} className="nd" />
            {k === 2 && (
              <>
                <rect x={x + 20} y={y + 56} width={110} height={10} className="fill-ink" />
                <rect x={x + 20} y={y + 76} width={170} height={5} className="fill-line" />
                <rect x={x + 20} y={y + 88} width={140} height={5} className="fill-line" />
                <path d={`M${x + 20} ${y + 112} h80 l-8 8 h-72 z`} className="fill-ink" />
                <rect x={x + 160} y={y + 56} width={100} height={100} className="tr tr--line" />
                <path d={`M${x + 160} ${y + 156} L${x + 260} ${y + 56}`} className="tr tr--faint" />
              </>
            )}
          </g>
        );
      })}
      <path d="M20 380 H200 L220 360 H410" className="tr tr--line draw-auto" pathLength={1} />
    </svg>
  );
}

function ConsultingGraphic() {
  const mods = [
    [40, 60, "Strategy"], [170, 60, "Architecture"], [300, 60, "Security"],
    [105, 200, "Tools"], [235, 200, "Automation"], [170, 320, "Team"],
  ] as const;
  return (
    <svg viewBox="0 0 430 400" fill="none" className="svc-graphic__svg">
      <path d="M100 100 V140 H165 V200 M230 100 V200 M360 100 V140 H295 V200 M165 240 V280 H230 V320 M295 240 V280 H230" className="tr tr--line draw-auto" pathLength={1} />
      {mods.map(([x, y, t], i) => (
        <g key={t}>
          <path d={`M${x + 10} ${y} H${x + 120} V${y + 30} L${x + 110} ${y + 40} H${x} V${y + 10} Z`} className={`panel ${i === 1 ? "panel--front" : ""}`} />
          <text x={x + 14} y={y + 25} className="svc-graphic__t">{t}</text>
        </g>
      ))}
    </svg>
  );
}
