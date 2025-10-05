// components/StarSystem2D.tsx
import React from "react";

interface Planet {
  name: string;
  radius: number;
  orbit: number;
  color: string;
  confidence: string;
  reliability: number;
  anomaly: number;
  x?: number;
  y?: number;
}

const colorMap: Record<string, string> = {
    red: "#ff3b3b",
    orange: "#ff8c00",
    cyan: "#00e5ff",
  };

const StarSystem2D = ({ planets }: { planets: Planet[] }) => {
  return (
    <div 
    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,10,40,0.6),rgba(0,0,0,0.9))] pointer-events-none"
    style={{
      background:
        "radial-gradient(circle at center, rgba(5,5,15,1) 0%, rgba(0,0,10,1) 100%)",
    }}>
      {/* ✨ Background stars */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-20"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite, drift ${
              10 + Math.random() * 10
            }s ease-in-out infinite`,
          }}
        />
      ))}

      {/* 🌟 Central Star */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-[0_0_25px_10px_rgba(255,200,0,0.4)]" />

      {/* 🌀 Orbits */}
      {planets.map((p, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute rounded-full border border-white/10"
          style={{
            width: p.orbit * 280,
            height: p.orbit * 170,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* 🪐 Planets */}
      {planets.map((p, i) => {
  // Pick base color by anomaly
  let baseColor = "#00e5ff";
  if (p.anomaly > 70) baseColor = "#ff3b3b";
  else if (p.anomaly > 30) baseColor = "#ff8c00";

  // Planet size independent of anomaly
  const size = Math.max(6, p.radius * 6);

  // ✨ Cap glow radius & alpha so it can't flood the canvas
  const glow = Math.min(10 + p.anomaly * 0.2, 40); // <= 40px max
  const glowAlpha = p.anomaly > 70 ? "66" : "44"; // reduce red glow opacity

  return (
    <div
      key={`planet-${i}`}
      className="absolute rounded-full shadow-lg cursor-pointer"
      style={{
        width: size,
        height: size,
        backgroundColor: `${baseColor}33`,
        boxShadow: `0 0 ${glow}px ${baseColor}${glowAlpha}`,
        border: `1px solid ${baseColor}${glowAlpha}`,
        top: `calc(50% + ${(p.y || 0)}px)`,
        left: `calc(50% + ${(p.x || 0)}px)`,
        transform: "translate(-50%, -50%)",
      }}
      title={`${p.name} | Conf: ${p.confidence}% | Rel: ${p.reliability} | Anomaly: ${p.anomaly}`}
    />
  );
})}


      {/* 🌈 Soft nebula glow overlays */}
<div className="absolute inset-0 pointer-events-none">
  <div className="absolute w-[60%] h-[60%] top-[10%] left-[20%] bg-[radial-gradient(circle_at_center,rgba(80,120,255,0.15),transparent_70%)] blur-3xl" />
  <div className="absolute w-[70%] h-[70%] bottom-[10%] right-[10%] bg-[radial-gradient(circle_at_center,rgba(60,0,200,0.1),transparent_80%)] blur-3xl" />
</div>

      {/* 📘 Legend */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs p-2 rounded-lg space-y-1 backdrop-blur-sm border border-white/10">
        <div><span className="text-cyan-400">●</span> Low Anomaly</div>
        <div><span className="text-orange-400">●</span> Medium Anomaly</div>
        <div><span className="text-red-500">●</span> High Anomaly</div>
      </div>

      {/* Add keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(2px, 3px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default StarSystem2D;