// components/StarSystem.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Planet {
  name: string;
  radius: number;
  orbit: number;
  period: number;
  color: string;
  confidence: string;
  reliability: number;
  anomaly: number;
  x?: number;
  y?: number;
}

const StarSystem = ({ planets }: { planets: Planet[] }) => {
  const [positions, setPositions] = useState<Planet[]>([]);
  const [hovered, setHovered] = useState<Planet | null>(null);

  useEffect(() => {
    if (!planets.length) return;
    let frame: number;
    const animate = () => {
      const t = Date.now() / 1000;
      setPositions(
        planets.map((p) => {
          const angle = (t / p.period) * 2 * Math.PI;
          return {
            ...p,
            x: Math.cos(angle) * p.orbit * 200,
            y: Math.sin(angle) * p.orbit * 120,
          };
        })
      );
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [planets]);

  const colorMap: Record<string, string> = {
    red: "#ff3b3b",
    orange: "#ff8c00",
    cyan: "#00e5ff",
  };

  return (
    <div
      className="relative aspect-video rounded-2xl border border-primary/30 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(5,5,15,1) 0%, rgba(0,0,10,1) 100%)",
      }}
    >
      {/* ✨ Background stars with parallax drift */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-40"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite, drift ${10 +
              Math.random() * 10}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* 🌈 Nebula Glow Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-2/3 h-2/3 bg-gradient-radial from-purple-800/20 to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-2/3 h-2/3 bg-gradient-radial from-cyan-700/15 to-transparent blur-3xl" />
      </div>

      {/* 🌟 Central Star (fixed in center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 animate-pulse shadow-[0_0_50px_25px_rgba(255,200,0,0.7)]" />

      {/* 🪩 Rotating System Group */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
      >
        {/* 🌀 Orbits */}
        {planets.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: p.orbit * 300,
              height: p.orbit * 180,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          />
        ))}

        {/* 🪐 Planets */}
        {positions.map((p, i) => {
          const baseColor = colorMap[p.color] || p.color;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full shadow-lg cursor-pointer"
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: (p.radius * 5) * (p.anomaly / 5),
                height: (p.radius * 5) * (p.anomaly / 5),
                backgroundColor: `${baseColor}40`,
                boxShadow: `0 0 ${p.anomaly > 8 ? 25 : 12}px ${baseColor}aa`,
                border: `1px solid ${baseColor}aa`,
                top: `calc(50% + ${p.y}px)`,
                left: `calc(50% + ${p.x}px)`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: hovered?.name === p.name ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </motion.div>

      {/* 📊 Floating HUD for hovered planet */}
      {hovered && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm">
          <div className="font-semibold">{hovered.name}</div>
          <div>Confidence: {hovered.confidence}%</div>
          <div>Reliability: {hovered.reliability}</div>
          <div>Anomaly: {hovered.anomaly}</div>
        </div>
      )}

      {/* 📖 Legend */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs p-2 rounded-lg space-y-1 backdrop-blur-md">
        <div><span className="text-cyan-400">●</span> Low Anomaly</div>
        <div><span className="text-orange-400">●</span> Medium Anomaly</div>
        <div><span className="text-red-500">●</span> High/Critical Anomaly</div>
      </div>

      {/* ✨ CSS animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
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

export default StarSystem;
