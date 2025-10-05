import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import StarSystem from "@/components/StarSystem";
import StarSystem2D from "@/components/StarSystem2D";

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSystem, setSelectedSystem] = useState("3D");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([
    { time: 0, O2: 15.2, CH4: 1.8 },
    { time: 1, O2: 15.4, CH4: 1.9 },
    { time: 2, O2: 15.7, CH4: 2.0 },
    { time: 3, O2: 16.0, CH4: 1.8 },
    { time: 4, O2: 16.3, CH4: 2.1 },
  ]);
  const [planets, setPlanets] = useState<any[]>([]);

  const analysisId = id ?? "1";
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/analysis/${analysisId}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [analysisId]);

  // Simulate live trend update
  useEffect(() => {
    const interval = setInterval(() => {
      setTrendData((prev) => {
        const last = prev[prev.length - 1];
        const nextTime = last.time + 1;
        const nextO2 = +(last.O2 + (Math.random() * 0.4 - 0.2)).toFixed(2);
        const nextCH4 = +(last.CH4 + (Math.random() * 0.2 - 0.1)).toFixed(2);
        const newPoint = { time: nextTime, O2: nextO2, CH4: nextCH4 };
        return prev.length >= 12 ? [...prev.slice(1), newPoint] : [...prev, newPoint];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [data]);

  // Map analysis data into planets for StarSystem visualization
  useEffect(() => {
    if (!data) return;

    const mapped = (data.outliers || []).map((o: any, idx: number) => ({
      name: `Outlier-${idx + 1}`,
      radius: Math.max(1, Math.abs(o.z) / 2), // scale z-score to planet size
      orbit: 0.2 + idx * 0.15,                 // space out orbits
      period: 8 + idx * 4,                     // orbital speed
      color:
        o.z >= 9
        ? "#ef4444" // Tailwind red-500
        : o.z >= 7
        ? "#f97316" // orange-500
        : "#22d3ee", // cyan-400
      confidence: data.confidence ? (data.confidence * 100).toFixed(1) : "N/A",
      reliability: data.reliability?.score || 0,
      anomaly: o.z?.toFixed(2) ?? "0.0",
    }));

    setPlanets(mapped);
  }, [data]);

  if (loading) return <div className="p-6">Loading analysis...</div>;
  if (!data) return <div className="p-6 text-red-500">No analysis found</div>;

  // Convenience variables
  const atmosphereData = data.likely_atmosphere?.likely_gases || [];
  const atmosphereComment = data.likely_atmosphere?.comment || "No comment available";
  const atmosphereConfidence = data.likely_atmosphere?.confidence || "Unknown";
  const prediction = data.prediction || "Unknown";
  const confidence = (data.confidence * 100).toFixed(2);
  const reliability = data.reliability?.label || "Unknown";
  const reliabilityScore = data.reliability?.score || 0;
  const planetType = data.planet_type?.ml_prediction || "N/A";
  const extremeOutlier = data.extreme_outlier;
  const stats = data.stats || {};

  // Label mapping for human readability
  const labelMap: Record<string, string> = {
    koi_period: "Orbital Period (days)",
    koi_duration: "Transit Duration (hrs)",
    koi_depth: "Transit Depth (ppm)",
    koi_prad: "Planet Radius (R⊕)",
    koi_sma: "Semi-Major Axis (AU)",
    koi_incl: "Inclination (°)",
    koi_teq: "Equilibrium Temp (K)",
    koi_model_snr: "Signal-to-Noise Ratio",
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Exoplanet Cluster Visualization
          </h1>
          <p className="text-muted-foreground">
            Interactive 3D visualization and detailed atmospheric analysis of exoplanet systems.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: System Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-space p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-glow">Star System Viewer</h2>
                </div>
                <div className="flex gap-2">
                  <Button
  variant={selectedSystem === "3D" ? "default" : "outline"}
  size="sm"
  onClick={() => setSelectedSystem("3D")}
>
  3D
</Button>
<Button
  variant={selectedSystem === "2D" ? "default" : "outline"}
  size="sm"
  onClick={() => setSelectedSystem("2D")}
>
  2D
</Button>
                </div>
              </div>

              {/* Star + Orbit Visualization */}
              <div className="relative aspect-video rounded-lg bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-primary/30 overflow-hidden">
                {selectedSystem === "3D" ? (
    <StarSystem planets={planets} />
  ) : (
    <StarSystem2D planets={planets} />
  )}
  <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
    System View: {selectedSystem === "3D" ? "Orbital" : "Flat"}
  </div>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Feature Importance</h2>
              {data.feature_importance ? (
                <div className="space-y-3">
                  {(() => {
                    const weights = Object.values(data.feature_importance).map(Number);
                    const maxWeight = Math.max(...weights) || 1;

                    return Object.entries(data.feature_importance).map(([feature, weight]: any, idx) => {
                      const label = labelMap[feature] || feature;
                      const normalizedWidth = (weight / maxWeight) * 100;

                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-48 text-sm text-left text-muted-foreground truncate">{label}</span>
                          <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                              style={{ width: `${normalizedWidth.toFixed(1)}%` }}
                            />
                          </div>
                          <span className="w-24 text-right text-xs font-medium text-cyan-400">{weight.toFixed(1)}%</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No feature importance available.</p>
              )}
            </div>
          </div>

          {/* Right Column: Prediction, Atmosphere, Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prediction Summary */}
            <div className="card-space p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-glow">Prediction Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prediction</span>
                  <span className="font-semibold">{prediction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold">{confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reliability</span>
                  <span className="font-semibold">{reliability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planet Type</span>
                  <span className="font-semibold">{planetType}</span>
                </div>
                {extremeOutlier && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mt-2">🚨 Extreme Outlier</Badge>
                )}
              </div>
              <div className="mt-4">
                <Progress value={reliabilityScore * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Reliability Score: {(reliabilityScore * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Atmosphere */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-glow">Atmosphere</h2>
                <Button size="icon" variant="ghost">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="composition" className="w-full">
                {/* Composition */}
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="composition">Composition</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="composition" className="space-y-3">
                  {atmosphereData.length > 0 ? (
                    atmosphereData.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.element}</span>
                        <span className="text-sm font-semibold text-secondary">{item.percentage}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No atmospheric data available.</p>
                  )}
                  <div className="mt-3 text-xs text-muted-foreground">
                    Confidence: {atmosphereConfidence} • {atmosphereComment}
                  </div>
                </TabsContent>

                {/* Trends */}
                <TabsContent value="trends">
                  <h3 className="text-sm font-medium mb-2">Atmospheric Trends</h3>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/30 shadow-inner">
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={trendData}>
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            background: "#0f172a",
                            border: "1px solid #3b82f6",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Line type="monotone" dataKey="O2" stroke="#3b82f6" strokeWidth={2} dot={false} name="O₂ (%)" />
                        <Line type="monotone" dataKey="CH4" stroke="#facc15" strokeWidth={2} dot={false} name="CH₄ (ppm)" />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 font-semibold tracking-wide">
                        Confidence: {atmosphereConfidence}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full animate-pulse ${
                          atmosphereConfidence === "High"
                            ? "bg-green-400"
                            : atmosphereConfidence === "Medium"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Logs */}
                <TabsContent value="logs">
                  <div className="space-y-2 text-xs">
                    {data.logs && data.logs.length > 0 ? (
                      data.logs.map((log: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-400" />
                          <span>{log}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No logs available.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Quick Stats */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(stats).map(([key, value]: any, index) => {
                  let colorClass = "text-cyan-400";
                  if (key.includes("teq")) colorClass = "text-orange-400";
                  if (key.includes("prad")) colorClass = "text-green-400";
                  if (key.includes("period")) colorClass = "text-purple-400";
                  const label = labelMap[key] || key;
                  return (
                    <div key={index} className="p-3 rounded-lg bg-background/40 border border-border hover:border-primary/40 transition-all">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className={`text-base font-semibold ${colorClass}`}>{value?.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Outliers */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Detected Outliers</h2>
              {data.outliers && data.outliers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.outliers.map((o: any, i: number) => {
                    const label = labelMap[o.feature] || o.feature;
                    return (
                      <Badge key={i} variant="destructive">
                        {label} (z={o.z.toFixed(2)})
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No outliers detected.</p>
              )}
            </div>

            {/* AI Insights */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">AI Insights</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {data.gemini_koi_explanation && !data.gemini_koi_explanation.includes("Gemini API key not configured")
                  ? data.gemini_koi_explanation
                  : "No Gemini explanation available."}
              </p>
            </div>

            {/* Planet Classification */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Planet Classification</h2>
              <div className="flex justify-between">
                <span>ML Model</span>
                <span className="font-semibold text-green-400">{data.planet_type?.ml_prediction}</span>
              </div>
              <div className="flex justify-between">
                <span>Rule-based</span>
                <span className="font-semibold text-blue-400">{data.planet_type?.rule_based_prediction}</span>
              </div>
              <div className="mt-2">
                {data.planet_type?.agreement ? (
                  <Badge className="bg-green-500/20 text-green-400">✅ Agreement</Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-400">❌ Disagreement</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
