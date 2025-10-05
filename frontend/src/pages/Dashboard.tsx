"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Compass,
  ActivitySquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";

interface Signal {
  analysis_id: number;
  prediction: string;
  confidence: number;
  reliability_score: number;
  reliability_label: string;
  planet_type?: string;
}

const Dashboard = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "http://localhost:8000/explorer?limit=8";

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setSignals(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching signals:", error);
      }
    };
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, []);

  const actions = [
    {
      title: "Analysis",
      description: "Run new AI-powered scans",
      icon: <Target className="h-8 w-8 text-blue-400" />,
      link: "/analysis",
    },
    {
      title: "Data Upload",
      description: "Your DataUpload overview",
      icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
      link: "/data-upload",
    },
    {
      title: "Anomalies",
      description: "Investigate irregular signals",
      icon: <ActivitySquare className="h-8 w-8 text-red-400" />,
      link: "/anomalies",
    },
    {
      title: "Explore",
      description: "Discover new exoplanets",
      icon: <Compass className="h-8 w-8 text-green-400" />,
      link: "/explorer",
    },
  ];

  const tips = [
    {
      title: "Understanding Confidence Scores",
      description:
        "The confidence metric indicates the AI’s certainty about a detection. A score close to 100% means strong evidence of an exoplanet.",
    },
    {
      title: "Monitoring Reliability Labels",
      description:
        "Reliability labels classify the stability of detection models — 'High' suggests consistent prediction across multiple analyses.",
    },
    {
      title: "Analyzing Planet Types",
      description:
        "Planet types like 'Super Earth' or 'Gas Giant' help determine atmosphere composition and potential habitability.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Welcome back, Dr. Sammo
          </h1>
          <p className="text-muted-foreground">
            Dive into the cosmos — your real-time discoveries and AI analyses await.
          </p>
        </div>

        {/* Actions + Onboarding */}
        <div className="lg:col-span-2 space-y-6 mb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card-space p-6 text-left hover:scale-105 transition-transform rounded-xl border border-slate-700/50 bg-[#0e1524]/50 hover:bg-[#1a2238]/60 backdrop-blur-sm"
              >
                <div className="mb-4">{action.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Onboarding Tips */}
          <div className="card-space p-6 rounded-xl border border-slate-700/50 bg-[#0e1524]/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Onboarding Tips
            </h2>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <details
                  key={index}
                  className="group border border-slate-800/50 rounded-lg overflow-hidden"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between p-4 bg-background/30 hover:bg-background/50 transition-colors">
                    <span className="font-medium text-white">{tip.title}</span>
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-2 p-4 text-sm text-slate-400 bg-[#0c1120]/70">
                    {tip.description}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Confirmed Exoplanets"
            value="5,312"
            icon={<CheckCircle className="h-6 w-6 text-green-400" />}
            percentage="88%"
            trend="up"
            color="success"
          />
          <StatCard
            title="Candidates"
            value="12,839"
            icon={<Target className="h-6 w-6 text-yellow-400" />}
            percentage="65%"
            trend="up"
            color="warning"
          />
          <StatCard
            title="False Positives"
            value="4,120"
            icon={<AlertCircle className="h-6 w-6 text-red-400" />}
            percentage="23%"
            trend="down"
          />
          <StatCard
            title="Anomalies"
            value="1,496"
            icon={<TrendingUp className="h-6 w-6 text-purple-400" />}
            percentage="95%"
            trend="up"
            color="secondary"
          />
        </div>

        {/* Signal Explorer */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Signal Explorer
          </h2>
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-300 border-blue-500/30 animate-pulse backdrop-blur-sm"
          >
            {isLoading ? "Loading Signals..." : "Real-Time Active Feed"}
          </Badge>
        </div>

        {/* Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {signals.length === 0 && !isLoading ? (
            <p className="text-muted-foreground text-center col-span-full">
              No signals detected yet.
            </p>
          ) : (
            signals.map((signal) => {
              const confidencePercent = (signal.confidence * 100).toFixed(1);
              const updatedTime = new Date().toLocaleTimeString();

              const borderColor =
                signal.prediction === "Exoplanet"
                  ? "border-green-500/40 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
                  : signal.prediction === "Candidate"
                  ? "border-yellow-500/40 shadow-[0_0_25px_rgba(234,179,8,0.15)]"
                  : "border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.1)]";

              return (
                <div
                  key={signal.analysis_id}
                  className={`relative rounded-2xl p-5 bg-[#0d1321]/60 border ${borderColor}
                    backdrop-blur-md transition-all duration-500 
                    hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]
                    hover:border-indigo-500/50`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white/90">
                      Signal #{signal.analysis_id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        signal.prediction === "Exoplanet"
                          ? "bg-green-500/15 text-green-400 border border-green-400/30"
                          : signal.prediction === "Candidate"
                          ? "bg-yellow-500/15 text-yellow-400 border border-yellow-400/30"
                          : "bg-red-500/15 text-red-400 border border-red-400/30"
                      }`}
                    >
                      {signal.prediction}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence</span>
                      <span className="font-semibold text-white">
                        {confidencePercent}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reliability</span>
                      <span
                        className={`font-medium ${
                          signal.reliability_score > 0.7
                            ? "text-green-400"
                            : signal.reliability_score > 0.4
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {signal.reliability_label}
                      </span>
                    </div>
                    {signal.planet_type && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Planet Type</span>
                        <span className="text-sky-400 font-medium">
                          {signal.planet_type}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 border-t border-slate-700/40 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Live update active</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Updated {updatedTime}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isLoading && (
          <div className="flex justify-center mt-10">
            <p className="text-blue-400 text-sm animate-pulse">
              🔄 Updating every 5 seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
