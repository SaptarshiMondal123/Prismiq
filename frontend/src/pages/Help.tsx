import { Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Help = () => {

  const [query, setQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [activeMethodologyIndex, setActiveMethodologyIndex] = useState(null);
  const [activeFAQIndex, setActiveFAQIndex] = useState(null);
  const [feedback, setFeedback] = useState({});

  const activityData = [
    { day: "Mon", interactions: 3 },
    { day: "Tue", interactions: 5 },
    { day: "Wed", interactions: 2 },
    { day: "Thu", interactions: 7 },
    { day: "Fri", interactions: 6 },
    { day: "Sat", interactions: 9 },
    { day: "Sun", interactions: 4 },
  ];

  const docs = [
    {
      title: "What is a light curve?",
      content:
        "A light curve is a graph of light intensity of a celestial object over time. It helps detect transits, eclipses, and other periodic variations that indicate exoplanets or variable stars.",
    },
    {
      title: "How do I upload data?",
      content:
        "To upload data, navigate to the 'Data Upload' page. You can drag and drop a CSV or JSON file, or select one manually. Once uploaded, it will automatically process and prepare your dataset for analysis.",
    },
    {
      title: "How does the analysis page work?",
      content:
        "The Analysis page processes your uploaded data through trained ML models to detect patterns, outliers, or possible planetary signals. It then visualizes key insights for deeper understanding.",
    },
    {
      title: "How can I share my findings?",
      content:
        "You can share your discoveries by generating a shareable report or exporting data. The 'Share Findings' option allows quick export to PDF or public dashboard view.",
    },
    {
      title: "How do I detect anomalies?",
      content:
        "Go to the 'Anomalies' section to view automatically detected outliers in your dataset. These could represent noise, unusual events, or potential new findings worth investigating.",
    },
  ];

  const suggestions = docs.map((d) => d.title);

  // Filter docs for search suggestions
  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  // When Search is clicked or Enter pressed
  const handleSearch = () => {
    const found = docs.find(
      (d) => d.title.toLowerCase() === query.toLowerCase()
    );
    setSelectedDoc(found || null);
  };

  const tutorials = [
    {
      title: "Exploring Exoplanet Light Curves",
      description: "Learn how to analyze stellar brightness to detect transits.",
      steps: [
        "Go to the Explorer tab and select 'Light Curve Data'.",
        "Upload your CSV or choose a sample dataset.",
        "Use the zoom and smoothing tools to highlight dips in brightness.",
        "Interpret the dips as potential exoplanet transits."
      ],
    },
    {
      title: "Detecting Anomalies in Data",
      description: "Step-by-step guide to identify unusual readings or noise.",
      steps: [
        "Navigate to the 'Anomalies' section.",
        "Click 'Run Detection' to start the algorithm.",
        "Review detected anomalies and filter by confidence score.",
        "Export anomaly report or flag false positives."
      ],
    },
    {
      title: "Performing Radial Velocity Analysis",
      description: "Understand how stellar motion helps find exoplanets.",
      steps: [
        "Upload radial velocity data from your observations.",
        "Choose a smoothing algorithm (Savitzky–Golay recommended).",
        "Visualize the velocity curve and periodic oscillations.",
        "Fit the curve with a Keplerian model to estimate planet mass."
      ],
    },
    {
      title: "Building a Custom Exoplanet Detection Model",
      description: "Learn how to train your own ML model using uploaded data.",
      steps: [
        "Go to the 'Analysis' tab and open the 'Custom Model' section.",
        "Upload your preprocessed CSV dataset with labeled columns.",
        "Select your preferred algorithm — Random Forest, SVM, or CNN.",
        "Adjust parameters like learning rate, epochs, and validation split.",
        "Click 'Train Model' to start training and monitor live metrics.",
        "Once complete, test the model using unseen exoplanet data.",
        "Save your model configuration for reuse in future sessions."
      ],
    },
  ];


  const datasets = [
    {
      title: "Kepler Dataset",
      description:
        "Light curves and confirmed exoplanet candidates observed by the Kepler Space Telescope.",
      image: "📈",
      source:
        "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative",
    },
    {
      title: "TESS Dataset",
      description:
        "Candidate and confirmed exoplanet data from the Transiting Exoplanet Survey Satellite (TESS).",
      image: "📊",
      source:
        "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=TOI",
    },
  ];

  const methodology = [
    {
      title: "Neural Network Architecture",
      description:
        "Our AI model uses a hybrid CNN–LSTM architecture trained on light curves to detect subtle exoplanet transit signals.",
      details: `
        The Convolutional Neural Network (CNN) extracts spatial features from normalized light curve data, 
        identifying characteristic dips caused by transits. The Long Short-Term Memory (LSTM) layers then 
        analyze temporal dependencies, improving accuracy on variable stars and noisy signals.
        The final dense layers classify candidates with confidence scores and uncertainty estimates.`,
    },
    {
      title: "Data Preprocessing & Training Strategy",
      description:
        "Before training, raw Kepler and TESS data undergo normalization, noise filtering, and phase folding.",
      details: `
        1️⃣ We perform outlier removal using sigma clipping to ensure clean signal representation.  
        2️⃣ Data is normalized to a consistent flux scale and augmented to simulate various observation conditions.  
        3️⃣ We apply stratified sampling to maintain class balance and train using Adam optimizer with cyclical learning rate scheduling.  
        4️⃣ Validation includes cross-survey testing between Kepler and TESS datasets to ensure generalization.`,
    },
  ];

  const faqs = [
    {
      question: "What is a light curve?",
      answer:
        "A light curve is a graph showing how the brightness of a celestial object changes over time. For exoplanet detection, we observe dips in a star's brightness that occur when a planet passes in front of it.",
      category: "Data Formats",
    },
    {
      question: "How do I start my first analysis?",
      answer:
        "Navigate to the dashboard and click 'Start New Analysis'. You'll be guided through selecting data sources or uploading your own datasets for processing.",
      category: "Getting Started",
    },
    {
      question: "What does 'Anomaly Score' mean?",
      answer:
        "The anomaly score (0-10) represents how unusual or interesting a signal is compared to known exoplanet signatures. Higher scores indicate more unique or unexpected patterns that may warrant further investigation.",
      category: "Understanding Results",
    },
  ];

  const troubleshooting = [
    {
      icon: "❌",
      title: "Error: Data Upload Failed",
      description: "Check the format and return code. See 'Data Formats' FAQ.",
      color: "text-red-400",
    },
    {
      icon: "⚠️",
      title: "Warning: Model Overfitting",
      description:
        "Try increasing dropout rate or adding regularization (0.01-0.1 L2).",
      color: "text-yellow-400",
    },
  ];
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="card-space p-6 mb-8 animate-fade-in bg-background/40 backdrop-blur-sm rounded-2xl shadow-sm">
      {/* Search Section */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-10 bg-background/60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Button
          className="bg-gradient-to-r from-primary to-secondary btn-glow"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Suggestions */}
      {!selectedDoc && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            {query ? "Search Results:" : "AI Suggested Questions:"}
          </p>
          {filtered.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filtered.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="text-xs transition hover:scale-105"
                  onClick={() => {
                    setQuery(question);
                    setSelectedDoc(docs.find((d) => d.title === question));
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          ) : (
            query && (
              <p className="text-xs text-muted-foreground italic mt-2">
                No results found for "{query}"
              </p>
            )
          )}
        </div>
      )}

      {/* Documentation Display */}
      {selectedDoc && (
        <div className="mt-6 p-4 bg-background/60 rounded-lg border border-border animate-fade-in">
          <h3 className="text-lg font-semibold mb-2 text-glow">
            {selectedDoc.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {selectedDoc.content}
          </p>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 text-xs text-primary hover:underline"
            onClick={() => setSelectedDoc(null)}
          >
            ← Back to suggestions
          </Button>
        </div>
      )}
    </div>
        {/* Tutorials & Interactive Guides */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <h2 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
        🎓 Tutorials & Interactive Guides
      </h2>

      {/* Tutorial List */}
      {!selectedTutorial && (
        <div className="grid sm:grid-cols-2 gap-4">
          {tutorials.map((tutorial, index) => (
            <button
              key={index}
              className="card-space p-6 text-left hover:scale-105 transition-all"
              onClick={() => setSelectedTutorial(tutorial)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">▶️</span>
                <h3 className="font-semibold">{tutorial.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {tutorial.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Tutorial Step-by-Step View */}
      {selectedTutorial && (
        <div className="card-space p-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-glow">
            {selectedTutorial.title}
          </h3>

          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            {selectedTutorial.steps.map((step, idx) => (
              <li
                key={idx}
                className="p-3 rounded-md bg-background/40 border border-border hover:bg-background/60 transition-all"
              >
                {step}
              </li>
            ))}
          </ol>

          <Button
            variant="ghost"
            size="sm"
            className="mt-4 text-xs text-primary hover:underline"
            onClick={() => setSelectedTutorial(null)}
          >
            ← Back to tutorials
          </Button>
        </div>
      )}
    </div>

        {/* Dataset Explanation & Insights */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
        📊 Dataset Explanation & Insights
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {datasets.map((dataset, index) => (
          <div key={index} className="card-space p-6">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 flex items-center justify-center text-6xl">
              {dataset.image}
            </div>
            <h3 className="font-semibold mb-2">{dataset.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {dataset.description}
            </p>
            <a
              href={dataset.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full text-secondary border-secondary/30 hover:bg-secondary/10"
              >
                🔗 View Source
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>

        {/* AI Methodology Overview */}
        <div
      className="card-space p-6 mb-8 animate-fade-in"
      style={{ animationDelay: "0.3s" }}
    >
      <h2 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
        🧠 AI Methodology Overview
      </h2>
      {methodology.map((item, index) => (
        <div key={index} className="mb-3">
          <button
            onClick={() => setActiveMethodologyIndex(activeMethodologyIndex === index ? null : index)}
            className="w-full p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all text-left flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <ChevronDown
              className={`transition-transform duration-300 ${
                activeMethodologyIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {activeMethodologyIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-primary/5 border-l-2 border-primary/40 mt-2 rounded-lg text-sm leading-relaxed text-muted-foreground whitespace-pre-line"
              >
                {item.details}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>

        {/* FAQ & Quick Search */}
         <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <h2 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
        ❓ FAQ & Quick Search
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="card-space p-4 group cursor-pointer border border-primary/10 rounded-lg"
          >
            <button
              onClick={() =>
                setActiveFAQIndex(activeFAQIndex === index ? null : index)
              }
              className="flex items-center justify-between w-full text-left font-medium"
            >
              <span>{faq.question}</span>
              <motion.span
                animate={{ rotate: activeFAQIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {activeFAQIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t border-primary/10"
                >
                  <p className="text-sm text-muted-foreground mb-3">
                    {faq.answer}
                  </p>

                  {/* Yes / No Feedback Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={
                        feedback[index] === "yes" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFeedback((prev) => ({ ...prev, [index]: "yes" }))
                      }
                      className="text-xs px-3 py-1"
                    >
                      👍 Yes
                    </Button>
                    <Button
                      variant={feedback[index] === "no" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() =>
                        setFeedback((prev) => ({ ...prev, [index]: "no" }))
                      }
                      className="text-xs px-3 py-1"
                    >
                      👎 No
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>

        {/* Troubleshooting */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <h2 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
            🔧 Troubleshooting
          </h2>
          <div className="space-y-3">
            {troubleshooting.map((item, index) => (
              <div
                key={index}
                className="card-space p-4 border-l-4"
                style={{
                  borderColor: item.color.includes("red")
                    ? "hsl(0 84% 60%)"
                    : "hsl(38 92% 50%)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${item.color}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Activity */}
        <div
      className="card-space p-6 animate-fade-in"
      style={{ animationDelay: "0.6s" }}
    >
      <h2 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
        📈 Your Activity
      </h2>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-background/50 border border-primary/10 text-center hover:scale-105 transition-transform">
          <p className="text-lg font-semibold text-primary">27</p>
          <p className="text-xs text-muted-foreground">Docs Viewed</p>
        </div>
        <div className="p-4 rounded-lg bg-background/50 border border-primary/10 text-center hover:scale-105 transition-transform">
          <p className="text-lg font-semibold text-secondary">8</p>
          <p className="text-xs text-muted-foreground">Tutorials Completed</p>
        </div>
        <div className="p-4 rounded-lg bg-background/50 border border-primary/10 text-center hover:scale-105 transition-transform">
          <p className="text-lg font-semibold text-accent">15</p>
          <p className="text-xs text-muted-foreground">Questions Asked</p>
        </div>
      </div>

      {/* Chart */}
      <div className="aspect-[2/1] rounded-lg bg-gradient-to-br from-muted/50 to-background border border-primary/20 p-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activityData}>
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                borderRadius: "8px",
                border: "1px solid rgba(59, 130, 246, 0.4)",
              }}
            />
            <Line
              type="monotone"
              dataKey="interactions"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ r: 4, stroke: "#22d3ee", strokeWidth: 2, fill: "#0f172a" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3">
        Activity tracked based on recent interactions in Explorer, Analysis, and Dataset pages.
      </p>
    </div>

        {/* Footer Links */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm">
  {/* Dashboard → goes to your running app */}
  <a
    href="http://localhost:8080/"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    Dashboard
  </a>

  {/* Datasets → scrolls to datasets section on same help page */}
  <a
    href="#datasets"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    Datasets
  </a>

  {/* AI Models → your models route */}
  <a
    href="http://localhost:8080/models"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    AI Models
  </a>

  {/* API → swagger/docs page */}
  <a
    href="http://localhost:8000/docs"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    API
  </a>

  {/* Tutorials → on this help page */}
  <a
    href="#tutorials"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    Tutorials
  </a>

  {/* Community → placeholder */}
  <a
    href="https://discord.gg/coming-soon"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    Community
  </a>

  {/* Blog → placeholder */}
  <a
    href="https://blog.example.com"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    Blog
  </a>
</div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <a
            href="mailto:support@exoanalytica.com"
            className="inline-block"
          >
            <Button className="bg-gradient-to-r from-primary to-secondary btn-glow">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </a>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          © 2024 ExoAnalytica AI. All rights reserved. Real for the future of
          space exploration.
        </div>
      </div>
    </div>
  );
};

export default Help;
