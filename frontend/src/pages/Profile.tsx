import { Mail, MapPin, Calendar, Award, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";

const Profile = () => {
  const achievements = [
    { title: "First Discovery", date: "Jan 2024", icon: <Target className="h-5 w-5" /> },
    { title: "100 Confirmations", date: "Mar 2024", icon: <Award className="h-5 w-5" /> },
    { title: "AI Pioneer", date: "Jun 2024", icon: <TrendingUp className="h-5 w-5" /> },
  ];

  const recentActivity = [
    { action: "Confirmed exoplanet", target: "Kepler-186f", time: "2 hours ago" },
    { action: "Analyzed signal", target: "TOI-700 d", time: "5 hours ago" },
    { action: "Uploaded dataset", target: "TESS Survey Batch-42", time: "1 day ago" },
    { action: "Published findings", target: "Research Paper #127", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            ← Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-space p-8 text-center animate-fade-in">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary p-1 animate-glow-pulse">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold">
                    DR
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-1 text-glow">Dr. Evelyn Reed</h1>
              <p className="text-muted-foreground mb-6">Senior Exoplanet Researcher</p>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span>evelyn.reed@exoanalytica.ai</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span>NASA Ames Research Center</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-secondary" />
                  <span>Joined January 2024</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-gradient-to-r from-primary to-secondary btn-glow">
                Edit Profile
              </Button>
            </div>

            {/* Achievements */}
            <div className="card-space p-6 mt-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-lg font-semibold mb-4 text-glow">Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-primary/20"
                  >
                    <div className="p-2 rounded-lg bg-primary/20 text-secondary">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <StatCard
                title="Total Discoveries"
                value="147"
                icon={<Target className="h-6 w-6 text-secondary" />}
                color="secondary"
              />
              <StatCard
                title="Success Rate"
                value="94.2%"
                icon={<TrendingUp className="h-6 w-6 text-green-400" />}
                color="success"
              />
            </div>

            {/* Bio */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                Dr. Evelyn Reed is a leading researcher in exoplanet discovery and characterization,
                specializing in AI-driven analysis of astronomical data. With over 147 confirmed
                discoveries and a 94.2% success rate, she has contributed significantly to our
                understanding of potentially habitable worlds beyond our solar system.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Her work focuses on utilizing machine learning algorithms to identify biosignatures
                in atmospheric spectra and developing novel techniques for detecting Earth-like
                exoplanets in the habitable zones of distant stars.
              </p>
            </div>

            {/* Recent Activity */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors border border-primary/10"
                  >
                    <div className="h-2 w-2 rounded-full bg-secondary mt-2 animate-glow-pulse" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.action}{" "}
                        <span className="text-secondary">{activity.target}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Interests */}
            <div className="card-space p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <h2 className="text-xl font-semibold mb-4 text-glow">Research Interests</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Exoplanet Atmospheres",
                  "Habitable Zone",
                  "Biosignatures",
                  "Transit Photometry",
                  "Machine Learning",
                  "Spectroscopy",
                  "Astrobiology",
                  "TESS Mission",
                ].map((interest) => (
                  <span
                    key={interest}
                    className="stat-badge px-4 py-2 text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
