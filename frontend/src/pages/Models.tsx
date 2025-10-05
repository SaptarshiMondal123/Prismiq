import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Models = () => {
  const [learningRate, setLearningRate] = useState([0.001]);
  const [batchSize, setBatchSize] = useState([64]);
  const [dropoutRate, setDropoutRate] = useState([0.2]);
  const [modelDepth, setModelDepth] = useState([8]);
  const [numTrees, setNumTrees] = useState([150]);
  const [epochs, setEpochs] = useState([100]);
  const [regularization, setRegularization] = useState([0.01]);
  const [isBayesian, setIsBayesian] = useState(false);
  const [continuousTraining, setContinuousTraining] = useState(true);
  const [activeLearning, setActiveLearning] = useState(false);

  const suggestions = [
    {
      param: "Learning Rate",
      range: "0.0008 - 0.0045",
      suggested: "0.005",
    },
    {
      param: "Batch Size",
      range: "32 - 128",
      suggested: "64",
    },
    {
      param: "Dropout Rate",
      range: "0.1 - 0.3",
      suggested: "0.2",
    },
  ];

  const handleApplyOptimal = () => {
    setLearningRate([0.005]);
    setBatchSize([64]);
    setDropoutRate([0.2]);
    toast.success("Optimal ranges applied!");
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Model Settings
          </h1>
          <p className="text-muted-foreground">
            Fine-tune the exoplanet detection model hyperparameters and training configuration.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Hyperparameter Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-space p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 text-glow">
                Hyperparameter Controls
              </h2>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-secondary">
                      Learning Rate
                    </label>
                    <span className="text-sm font-mono bg-background/50 px-3 py-1 rounded">
                      {learningRate[0]}
                    </span>
                  </div>
                  <Slider
                    value={learningRate}
                    onValueChange={setLearningRate}
                    max={0.1}
                    step={0.001}
                    className="[&_[role=slider]]:bg-secondary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-secondary">
                      Batch Size
                    </label>
                    <span className="text-sm font-mono bg-background/50 px-3 py-1 rounded">
                      {batchSize[0]}
                    </span>
                  </div>
                  <Slider
                    value={batchSize}
                    onValueChange={setBatchSize}
                    max={256}
                    min={16}
                    step={16}
                    className="[&_[role=slider]]:bg-secondary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-secondary">
                      Dropout Rate
                    </label>
                    <span className="text-sm font-mono bg-background/50 px-3 py-1 rounded">
                      {dropoutRate[0]}
                    </span>
                  </div>
                  <Slider
                    value={dropoutRate}
                    onValueChange={setDropoutRate}
                    max={0.5}
                    step={0.05}
                    className="[&_[role=slider]]:bg-secondary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-secondary">
                      Model Depth / Layers
                    </label>
                    <span className="text-sm font-mono bg-background/50 px-3 py-1 rounded">
                      {modelDepth[0]}
                    </span>
                  </div>
                  <Slider
                    value={modelDepth}
                    onValueChange={setModelDepth}
                    max={16}
                    min={4}
                    step={1}
                    className="[&_[role=slider]]:bg-secondary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-secondary">
                      Number of Trees
                    </label>
                    <span className="text-sm font-mono bg-background/50 px-3 py-1 rounded">
                      {numTrees[0]}
                    </span>
                  </div>
                  <Slider
                    value={numTrees}
                    onValueChange={setNumTrees}
                    max={300}
                    min={50}
                    step={10}
                    className="[&_[role=slider]]:bg-secondary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-secondary">
                      Epochs / Iterations
                    </label>
                    <span className="text-sm font-mono bg-background/50 px-3 py-1 rounded">
                      {epochs[0]}
                    </span>
                  </div>
                  <Slider
                    value={epochs}
                    onValueChange={setEpochs}
                    max={200}
                    min={50}
                    step={10}
                    className="[&_[role=slider]]:bg-secondary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-secondary">
                      Regularization (L1/L2)
                    </label>
                    <span className="text-sm font-mono bg-background/50 px-3 py-1 rounded">
                      {regularization[0]}
                    </span>
                  </div>
                  <Slider
                    value={regularization}
                    onValueChange={setRegularization}
                    max={0.1}
                    step={0.01}
                    className="[&_[role=slider]]:bg-secondary"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Activation Function
                    </label>
                    <Select defaultValue="relu">
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relu">ReLU</SelectItem>
                        <SelectItem value="sigmoid">Sigmoid</SelectItem>
                        <SelectItem value="tanh">Tanh</SelectItem>
                        <SelectItem value="leaky">Leaky ReLU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Optimizer
                    </label>
                    <Select defaultValue="adam">
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adam">Adam</SelectItem>
                        <SelectItem value="sgd">SGD</SelectItem>
                        <SelectItem value="rmsprop">RMSprop</SelectItem>
                        <SelectItem value="adagrad">Adagrad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bayesian Optimization */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Bayesian Optimization</h3>
                  <p className="text-xs text-muted-foreground">
                    Mode: <span className="text-secondary">{isBayesian ? "Bayesian" : "Manual"}</span>
                  </p>
                </div>
                <Switch checked={isBayesian} onCheckedChange={setIsBayesian} />
              </div>

              {isBayesian && (
                <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/30 animate-fade-in">
                  <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-sm text-muted-foreground">Holographic Chart</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded bg-background/50">
                    <p className="text-xs text-secondary font-medium mb-1">
                      AI Recommendation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Set Learning Rate to <span className="text-foreground font-mono">0.005</span> for optimal convergence.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Real-Time Metrics */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">
                Real-Time Metrics
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Loss & Accuracy</span>
                    <Badge className="bg-primary/20 text-secondary border-none">
                      Live
                    </Badge>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-glow mb-2">0.85</div>
                      <p className="text-xs text-muted-foreground">Current Accuracy</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Uncertainty & Calibration</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-glow mb-2">92%</div>
                      <p className="text-xs text-muted-foreground">Calibration Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Mode */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Training Mode</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      🔄
                    </div>
                    <div>
                      <p className="font-medium text-sm">Continuous Training</p>
                      <p className="text-xs text-muted-foreground">Auto-update model</p>
                    </div>
                  </div>
                  <Switch
                    checked={continuousTraining}
                    onCheckedChange={setContinuousTraining}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      💡
                    </div>
                    <div>
                      <p className="font-medium text-sm">Active Learning</p>
                      <p className="text-xs text-muted-foreground">Query uncertain samples</p>
                    </div>
                  </div>
                  <Switch
                    checked={activeLearning}
                    onCheckedChange={setActiveLearning}
                  />
                </div>

                {activeLearning && (
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 animate-fade-in">
                    <p className="text-xs font-medium mb-1">Active Learning Queue</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-secondary font-mono">1,492</span> samples awaiting review
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Utilities */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Utilities</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  💾 Preset Profiles
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  📜 Experiment History
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  ⚙️ Export Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  🧪 What-If Simulator
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mt-8 card-space p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-glow mb-2">
                ✨ Predictive AI: Optimal Range Suggestions
              </h2>
              <p className="text-sm text-muted-foreground">
                The AI has analyzed the current dataset and suggests the following hyperparameter ranges for maximum model performance.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/30"
              >
                <p className="text-sm font-medium text-secondary mb-1">
                  {suggestion.param}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {suggestion.range}
                </p>
                <p className="text-sm">
                  Suggested: <span className="font-mono text-foreground">{suggestion.suggested}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleApplyOptimal}
              className="bg-gradient-to-r from-secondary to-primary btn-glow"
            >
              Apply Optimal Ranges
            </Button>
            <Button variant="outline">Ignore Suggestions</Button>
          </div>
        </div>

        {/* Model Status */}
        <div className="mt-8 card-space p-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Idle - Ready for Training
              </Badge>
              <span className="text-sm text-muted-foreground">
                Exo-Analytica Platform v24.1 © 2024 Celestial Dynamics Corp.
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Documentation</Button>
              <Button variant="ghost" size="sm">Support</Button>
              <Button variant="ghost" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
