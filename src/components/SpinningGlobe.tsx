import React, { useRef, useState, useEffect } from "react";

export const SpinningGlobe: React.FC<{ className?: string }> = ({ className = "" }) => {
  const angleRef = useRef(0);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let id: number;
    const tick = () => {
      angleRef.current = (angleRef.current + 0.25) % 360;
      setAngle(angleRef.current);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const cx = 150, cy = 150, R = 118;

  const lats = [-60, -30, 0, 30, 60];
  const lons = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const nodes = [
    { lat: 37.7, lon: -122.4 },
    { lat: 51.5, lon: -0.1 },
    { lat: 35.7, lon: 139.7 },
    { lat: 1.3, lon: 103.8 },
    { lat: -33.8, lon: 151.2 },
    { lat: 50.1, lon: 8.6 },
    { lat: 40.7, lon: -74.0 },
    { lat: -23.5, lon: -46.6 },
  ];

  const projNodes = nodes.map(n => {
    const rlat = (n.lat * Math.PI) / 180;
    const rlon = ((n.lon + angle) * Math.PI) / 180;
    return {
      x: cx + R * Math.cos(rlat) * Math.sin(rlon),
      y: cy - R * Math.sin(rlat) * 0.95,
      front: Math.cos(rlon) >= 0,
    };
  });

  return (
    <svg
      viewBox="0 0 300 300"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bgGlobe" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
          <stop offset="55%" stopColor="#1e3a8a" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx={cx} cy={cy} r={R} fill="url(#bgGlobe)" />

      {/* Outer orbital ring */}
      <circle cx={cx} cy={cy} r={R + 18} fill="none" stroke="#3b82f6"
        strokeOpacity="0.10" strokeWidth="1" strokeDasharray="4,14" />

      {/* Latitude lines */}
      {lats.map((lat, i) => {
        const rl = (lat * Math.PI) / 180;
        const rx = R * Math.cos(rl);
        const yc = cy + R * Math.sin(rl) * 0.15;
        return (
          <ellipse key={i} cx={cx} cy={yc} rx={rx} ry={rx * 0.15}
            fill="none" stroke="#60a5fa"
            strokeOpacity={0.10 + (1 - Math.abs(lat) / 90) * 0.08}
            strokeWidth="0.7" />
        );
      })}

      {/* Longitude lines */}
      {lons.map((lon, i) => {
        const rl = ((lon + angle) * Math.PI) / 180;
        const rx = R * Math.abs(Math.cos(rl));
        const front = Math.sin(rl) >= 0;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={R}
            fill="none" stroke="#93c5fd"
            strokeOpacity={front ? 0.18 : 0.04}
            strokeWidth="0.7"
            strokeDasharray={front ? "" : "2,3"} />
        );
      })}

      {/* Poles */}
      <circle cx={cx} cy={cy - R} r="2" fill="#93c5fd" fillOpacity="0.6" />
      <circle cx={cx} cy={cy + R} r="2" fill="#93c5fd" fillOpacity="0.6" />

      {/* Network cables between front nodes */}
      {projNodes.map((n1, i) =>
        projNodes.map((n2, j) => {
          if (j <= i || !n1.front || !n2.front) return null;
          const d = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (d > 120) return null;
          return (
            <path key={`${i}-${j}`}
              d={`M${n1.x} ${n1.y} Q150 150 ${n2.x} ${n2.y}`}
              fill="none" stroke="#60a5fa" strokeOpacity="0.18"
              strokeWidth="0.7" strokeDasharray="2,4" />
          );
        })
      )}

      {/* City dots */}
      {projNodes.map((n, i) =>
        n.front ? (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="6" fill="none"
              stroke="#60a5fa" strokeOpacity="0.25" strokeWidth="0.5"
              className="animate-ping" style={{ animationDuration: `${1.6 + (i % 3) * 0.4}s` }} />
            <circle cx={n.x} cy={n.y} r="2.5" fill="#93c5fd"
              filter="drop-shadow(0 0 4px rgba(147,197,253,0.8))" />
          </g>
        ) : (
          <circle key={i} cx={n.x} cy={n.y} r="1.5"
            fill="#60a5fa" fillOpacity="0.08" />
        )
      )}

      {/* Center crosshair */}
      <path d="M144 150 L156 150 M150 144 L150 156"
        stroke="#93c5fd" strokeWidth="0.7" strokeOpacity="0.25" />
    </svg>
  );
};
