"use client";
import { useEffect, useState } from "react";
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

const Explorer = () => {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/explorer`)
      .then((res) => res.json())
      .then((data) => {
        // handle both {results: []} or []
        const results = Array.isArray(data) ? data : data.results || [];
        const filtered = results.filter(
          (signal: any) =>
            signal.prediction?.toLowerCase() !== "false positive"
        );
      setSignals(filtered);
      })
      .catch((err) => console.error("Failed to fetch explorer:", err));
  }, [page]);

  const statusColor = (pred: string) => {
    switch (pred.toLowerCase()) {
      case "exoplanet": return "text-green-400";
      case "candidate": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

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


  const handleGenerateReport = () => {
    if (!signals.length) return;
    const csvContent = [
      ["ID", "Prediction", "Confidence", "Reliability", "Planet Type", "Outlier Count"].join(","),
      ...signals.map(s => [
        s.analysis_id,
        s.prediction,
        (s.confidence * 100).toFixed(2) + "%",
        s.reliability,
        s.planet_type,
        s.outlier_count
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signals_report.csv";
    a.click();
  };
  const applyFilter = (filter: string) => {
    setFilter(filter);
    if (filter === "All") return setSignals(signals);
    setSignals(prev => prev.filter(s => s.prediction.toLowerCase() === filter.toLowerCase()));
  };
  const handleSort = (key: keyof Signal) => {
    setSignals(prev =>
      [...prev].sort((a, b) => {
        if (typeof a[key] === "number" && typeof b[key] === "number") {
          return (b[key] as number) - (a[key] as number);
        }
        return String(a[key]).localeCompare(String(b[key]));
      })
    );
  };

  const [view, setView] = useState("grid");

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Signal Classification Results
          </h1>
          <p className="text-muted-foreground">
            Explore AI-driven classifications, probabilities, and recommended follow-ups for potential exoplanet signals.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8 animate-fade-in">
          <Button className="bg-primary/20 btn-glow" onClick={handleGenerateReport}>Generate Report</Button>
          <Button variant="outline" onClick={() => applyFilter("Exoplanet")}>Filter</Button>
          <Button variant="outline" onClick={() => handleSort("confidence")}>Sort By</Button>
          <Button variant="outline" size="icon" onClick={() => setView("grid")}>⊞</Button>
          <Button variant="outline" size="icon" onClick={() => setView("list")}>☰</Button>
        </div>
        
        {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Signal Grid (8 boxes) */}
        <div
          className={
            view === "grid"
            ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
          }
        >
          {paginatedSignals.map((signal, idx) => (
  <div
    key={signal.analysis_id || idx}
    className="card-space p-0 overflow-hidden group cursor-pointer animate-fade-in"
    style={{ animationDelay: `${idx * 0.05}s` }}
  >
    {/* Card Image */}
    <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 relative">
      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
        🪐
      </div>
      <Badge
        className={`absolute top-3 right-3 ${statusColor(signal.prediction).replace("text-", "bg-")}/20 border-none`}
      >
        {signal.prediction.toUpperCase()}
      </Badge>
    </div>

    {/* Card Body */}
    <div className="p-4">
      <h3 className="font-semibold mb-2 group-hover:text-secondary transition-colors">
        {signal.planet_type || "Unknown"}
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Uploaded: {signal.created_at ? new Date(signal.created_at).toLocaleDateString() : "N/A"}
      </p>

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

{/* fill remaining slots to maintain grid spacing */}
{paginatedSignals.length < itemsPerPage &&
  Array.from({ length: itemsPerPage - paginatedSignals.length }).map((_, idx) => (
    <div key={`empty-${idx}`} className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
      Empty Slot
    </div>
  ))}
        </div>

        {/* ✅ Place Pagination here */}
    {filteredSignals.length > 8 && (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          ←
        </Button>

        {Array.from({ length: Math.ceil(filteredSignals.length / 8) }).map((_, i) => (
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
          disabled={page === Math.ceil(filteredSignals.length / 8)}
          onClick={() => setPage(p => p + 1)}
        >
          →
        </Button>
      </div>
    )}
      </div>
    </div>
  );
};

export default Explorer;
