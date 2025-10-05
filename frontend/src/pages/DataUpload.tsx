import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Database } from "lucide-react";
import { toast } from "sonner";

const DataUpload = () => {
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  // manual form state
  const [koiPeriod, setKoiPeriod] = useState("");
  const [koiDuration, setKoiDuration] = useState("");
  const [koiDepth, setKoiDepth] = useState("");
  const [koiPrad, setKoiPrad] = useState("");
  const [koiSma, setKoiSma] = useState("");
  const [koiIncl, setKoiIncl] = useState("");
  const [koiTeq, setKoiTeq] = useState("");
  const [koiSnr, setKoiSnr] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const templates = [
    {
      icon: <div className="text-4xl">📡</div>,
      title: "Transit Photometry",
      description: "Light curve data from transit observations",
    },
    {
      icon: <div className="text-4xl">📊</div>,
      title: "Radial Velocity",
      description: "Stellar wobble measurements",
    },
    {
      icon: <div className="text-4xl">🌊</div>,
      title: "Atmospheric Spectra",
      description: "Spectroscopic atmospheric composition data",
    },
    {
      icon: <div className="text-4xl">🔬</div>,
      title: "Microlensing",
      description: "Gravitational microlensing event data",
    },
  ];

  const templateValues: Record<string, any> = {
    "Transit Photometry": {
      koi_period: 10.3,
      koi_duration: 3.5,
      koi_depth: 550,
      koi_prad: 1.2,
      koi_sma: 0.05,
      koi_incl: 89.7,
      koi_teq: 1200,
      koi_model_snr: 48,
    },
    "Radial Velocity": {
      koi_period: 32.1,
      koi_duration: 6.0,
      koi_depth: 0,
      koi_prad: 1.0,
      koi_sma: 0.21,
      koi_incl: 88.2,
      koi_teq: 500,
      koi_model_snr: 70,
    },
    "Atmospheric Spectra": {
      koi_period: 3.2,
      koi_duration: 1.5,
      koi_depth: 300,
      koi_prad: 1.8,
      koi_sma: 0.04,
      koi_incl: 87.9,
      koi_teq: 1500,
      koi_model_snr: 55,
    },
    "Microlensing": {
      koi_period: 200.5,
      koi_duration: 20.3,
      koi_depth: 0,
      koi_prad: 5.0,
      koi_sma: 1.5,
      koi_incl: 90,
      koi_teq: 250,
      koi_model_snr: 20,
    },
  };

  const animateFill = (targetSetter: (val: string) => void, target: number) => {
    let current = 0;
    const step = target / 20; // animate in ~20 steps
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      targetSetter(current.toFixed(2));
    }, 50);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    setIsAnalyzing(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`https://prismiq-opo2.onrender.com/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResult(data);

      // Simulate analysis progress
      let prog = 10;
      const interval = setInterval(() => {
        prog += 10;
        setProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
        }
      }, 200);

      toast.success("Analysis initiated successfully!");
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  const handlePredict = async () => {
    if (!koiPeriod ||
      !koiDuration ||
      !koiDepth ||
      !koiPrad ||
      !koiSma ||
      !koiIncl ||
      !koiTeq ||
      !koiSnr
    ) {
      toast.error("Please fill all parameters!");
      return;
    }

    setIsAnalyzing(true);
    setProgress(10);

    try {
      const payload = {
        koi_period: parseFloat(koiPeriod),
        koi_duration: parseFloat(koiDuration),
        koi_depth: parseFloat(koiDepth),
        koi_prad: parseFloat(koiPrad),
        koi_sma: parseFloat(koiSma),
        koi_incl: parseFloat(koiIncl),
        koi_teq: parseFloat(koiTeq),
        koi_model_snr: parseFloat(koiSnr),
      };

      const response = await fetch("http://localhost:8000/predict_manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Prediction failed");
      const data = await response.json();
      setResult(data);

      let prog = 10;
      const interval = setInterval(() => {
        prog += 10;
        setProgress(prog);
        if (prog >= 100) clearInterval(interval);
      }, 200);

      toast.success("Manual analysis started!");
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Data Ingestion Protocol
          </h1>
          <p className="text-muted-foreground">
            Upload your observational data or input parameters manually to initiate AI-driven exoplanetary analysis.
          </p>
        </div>

        {/* Predefined Templates */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-glow">
            Predefined Data Templates
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => {
                  const vals = templateValues[template.title];
                  animateFill(setKoiPeriod, vals.koi_period);
                  animateFill(setKoiDuration, vals.koi_duration);
                  animateFill(setKoiDepth, vals.koi_depth);
                  animateFill(setKoiPrad, vals.koi_prad);
                  animateFill(setKoiSma, vals.koi_sma);
                  animateFill(setKoiIncl, vals.koi_incl);
                  animateFill(setKoiTeq, vals.koi_teq);
                  animateFill(setKoiSnr, vals.koi_model_snr);
                }}
                className="card-space p-6 text-center hover:scale-105 transition-all"
              >
                <div className="mb-3">{template.icon}</div>
                <h3 className="font-semibold mb-2">{template.title}</h3>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div
            className="card-space p-8 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-16 w-16 mx-auto mb-4 text-primary animate-float" />
              <h3 className="text-xl font-semibold mb-2">
                Drag & Drop Data Files
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: CSV, JSON, FITS, TXT
              </p>

              {/* 🔥 Added file input here */}
              <Input
                type="file"
                onChange={handleFileChange}
                className="mb-4"
              />

              <Button
                onClick={handleUpload}
                className="bg-gradient-to-r from-primary to-secondary btn-glow"
              >
                Upload & Analyze
              </Button>
            </div>

            {isAnalyzing && (
              <div className="mt-6 p-4 rounded-lg bg-background/50 border border-primary/20 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">AI Analysis Core</span>
                      <span className="text-secondary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Initializing quantum heuristics...
                </p>
              </div>
            )}
          </div>

          {/* Manual Parameter Entry */}
          <div className="card-space p-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 text-glow">
              Manual Parameter Entry
            </h2>
            <div className="space-y-4">
              <Input placeholder="Orbital Period (days)" value={koiPeriod} onChange={(e) => setKoiPeriod(e.target.value)} />
              <Input placeholder="Transit Duration (hrs)" value={koiDuration} onChange={(e) => setKoiDuration(e.target.value)} />
              <Input placeholder="Transit Depth (ppm)" value={koiDepth} onChange={(e) => setKoiDepth(e.target.value)} />
              <Input placeholder="Planet Radius (Earth radii)" value={koiPrad} onChange={(e) => setKoiPrad(e.target.value)} />
              <Input placeholder="Semi-major Axis (AU)" value={koiSma} onChange={(e) => setKoiSma(e.target.value)} />
              <Input placeholder="Inclination (deg)" value={koiIncl} onChange={(e) => setKoiIncl(e.target.value)} />
              <Input placeholder="Equilibrium Temperature (K)" value={koiTeq} onChange={(e) => setKoiTeq(e.target.value)} />
              <Input placeholder="Signal-to-noise Ratio" value={koiSnr} onChange={(e) => setKoiSnr(e.target.value)} />

              <Button
                onClick={handlePredict}
                className="w-full bg-gradient-to-r from-primary to-secondary btn-glow mt-6"
                size="lg"
              >
                Initiate Manual Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Status Log */}
        <div
          className="mt-8 card-space p-6 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-glow">
              Stellar Data Stream
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-glow-pulse" />
              <span className="text-xs text-muted-foreground">
                All systems nominal
              </span>
            </div>
          </div>
          {/* Real logs from backend */}
          <div className="space-y-2 font-mono text-xs">
            {result?.logs?.map((log: string, i: number) => {
              // 🎨 pick colors dynamically based on log text
              let color = "text-cyan-400";
              if (log.toLowerCase().includes("warning")) color = "text-yellow-400";
              if (log.toLowerCase().includes("error") || log.toLowerCase().includes("no match")) color = "text-red-400";
              if (log.toLowerCase().includes("boot") || log.toLowerCase().includes("ok")) color = "text-green-400";
              if (log.toLowerCase().includes("multi-spectrum")) color = "text-purple-400";

              return (
                <div key={i} className={color}>
                  &gt; {log}
                </div>
              );
            })}
            <div className="animate-pulse">▋</div>
          </div>
          {/* Summary after logs */}
          {result && (
          <div className="mt-6 p-4 rounded-lg bg-background/70 border border-primary/30 animate-fade-in">
            <h3 className="text-lg font-semibold text-glow mb-3">Final Analysis Report</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-bold">Prediction:</span>{" "}
        <span className="text-green-400">{result.prediction}</span>
      </div>
      <div>
        <span className="font-bold">Confidence:</span>{" "}
        {result.confidence?.toFixed(2)}%
      </div>
      <div>
        <span className="font-bold">Reliability:</span>{" "}
        <span className={result.reliability === "Low" ? "text-yellow-400" : "text-green-400"}>
          {result.reliability}
        </span>
      </div>
      <div>
        <span className="font-bold">Planet Type:</span>{" "}
        {result.planet_type || "Unknown"}
      </div>
      <div>
        <span className="font-bold">Extreme Outlier:</span>{" "}
        {result.extreme_outlier ? "Yes 🚨" : "No"}
      </div>
      <div>
        <span className="font-bold">Analysis ID:</span> {result.analysis_id}
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
