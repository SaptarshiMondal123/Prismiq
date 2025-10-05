import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Signal {
  analysis_id: number;
  prediction: string;
  confidence: number;
  reliability: string;
  planet_type: string;
  outlier_count: number;
  created_at?: string;
}

const Anomalies = () => {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [page, setPage] = useState(1);
  const [watchlist, setWatchlist] = useState<Signal[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/explorer`)
      .then((res) => res.json())
      .then((data) => {
        const results = Array.isArray(data) ? data : data.results || [];
        // takes false positives
        const filtered = results.filter(
          (s: any) => s.prediction?.toLowerCase() === "false positive"
        );
        const top3 = [...filtered]
        .sort((a, b) => b.outlier_count - a.outlier_count)
        .slice(0, 3);
        
        setWatchlist(top3);
        setSignals(filtered);
      })
      .catch((err) => console.error("Failed to fetch anomalies:", err));
  }, [page]);

  const filters = ["All", "Low (0-3)", "Medium (3-7)", "High (7-9)", "Critical (9+)"];

  const filteredSignals = signals.filter(signal => {
    if (filter === "All") return true;
    if (filter === "Low (0-3)") return signal.outlier_count >= 0 && signal.outlier_count <= 3;
    if (filter === "Medium (3-7)") return signal.outlier_count >= 3 && signal.outlier_count <= 7;
    if (filter === "High (7-9)") return signal.outlier_count >= 7 && signal.outlier_count <= 9;
    if (filter === "Critical (9+)") return signal.outlier_count >= 9;
    return true;
  });

  const itemsPerPage = 8;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSignals = filteredSignals.slice(startIndex, endIndex);

  const statusColor = (pred: string) => {
    switch (pred.toLowerCase()) {
      case "false positive": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Unknown / Anomaly Explorer
          </h1>
          <p className="text-muted-foreground">
            Explore and analyze unknown signals flagged by AI as potential anomalies.
          </p>
        </div>

        {/* My Watchlist */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-glow">My Watchlist</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item, index) => (
              <div
                key={index}
                className="card-space p-6 hover:scale-105 transition-all cursor-pointer"
              >
                <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-900/30 to-cyan-900/30 mb-4 flex items-center justify-center">
                  <div className="text-6xl">📡</div>
                </div>
                <h3 className="font-semibold mb-1">{item.planet_type || "Unknown"}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.prediction}</span>
                  <Badge
                    className={`${
                      item.outlier_count >= 9
                      ? "bg-red-400/20"
                      : item.outlier_count >= 7
                      ? "bg-orange-400/20"
                      : "bg-yellow-400/20"
                    } border-none`}
                  >
                  <span
                    className={
                      item.outlier_count >= 9
                      ? "text-red-400"
                      : item.outlier_count >= 7
                      ? "text-orange-400"
                      : "text-yellow-400"
                    }
                  >
                  Anomaly {item.outlier_count} • {(item.confidence * 100).toFixed(1)}%
                  </span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Score Distribution */}
        <div className="card-space p-6 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-semibold mb-4 text-glow">
            Anomaly Score Distribution
          </h2>
          
          <div className="mb-6">
            <div className="h-48 flex items-end justify-center gap-1">
              {[
                { height: 20, color: "bg-cyan-400" },
                { height: 25, color: "bg-cyan-400" },
                { height: 30, color: "bg-cyan-400" },
                { height: 45, color: "bg-green-400" },
                { height: 55, color: "bg-green-400" },
                { height: 70, color: "bg-yellow-400" },
                { height: 85, color: "bg-orange-400" },
                { height: 95, color: "bg-orange-400" },
                { height: 90, color: "bg-red-400" },
                { height: 80, color: "bg-red-400" },
                { height: 65, color: "bg-orange-400" },
                { height: 50, color: "bg-yellow-400" },
                { height: 35, color: "bg-green-400" },
                { height: 25, color: "bg-cyan-400" },
                { height: 20, color: "bg-cyan-400" },
              ].map((bar, index) => (
                <div
                  key={index}
                  className={`flex-1 ${bar.color} rounded-t transition-all hover:opacity-80`}
                  style={{ height: `${bar.height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {filters.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                className={filter === f ? "bg-primary/20" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
              ))}
          </div>
        </div>
        
        {/* Anomalies Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedSignals.map((signal, idx) => (
            <div
              key={signal.analysis_id || idx}
              className="card-space p-0 overflow-hidden group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="aspect-square bg-gradient-to-br from-purple-600/30 to-cyan-600/30 relative flex items-center justify-center">
                <div className="text-6xl">📡</div>
                <Badge
                  className={`absolute top-3 right-3 ${statusColor(signal.prediction).replace("text-", "bg-")}/20 border-none`}
                >
                  {signal.prediction.toUpperCase()}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 group-hover:text-secondary transition-colors">
                  {signal.planet_type || `Anomaly #${signal.analysis_id}`}
                </h3>
                <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">Reliability:</span>
        <span className="text-sm font-medium">{signal.reliability}</span>
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Confidence</span>
          <span className={statusColor(signal.prediction)}>
            {(signal.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className={`h-full ${statusColor(signal.prediction).replace("text-", "bg-")}`}
            style={{ width: `${signal.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Details Button */}
      <Button 
        size="sm" 
        onClick={() => navigate(`/analysis/${signal.analysis_id}`)}
      >
        View Details
      </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {signals.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ←
            </Button>

            {Array.from({ length: Math.ceil(filteredSignals.length / itemsPerPage) }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className={page === i + 1 ? "bg-primary/20" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={page === Math.ceil(signals.length / itemsPerPage)}
              onClick={() => setPage((p) => p + 1)}
            >
              →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anomalies;
