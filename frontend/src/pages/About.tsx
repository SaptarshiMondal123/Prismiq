// src/pages/About.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Phone, Users } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const team = [
    { name: "Saptarshi Mondal", role: "Astrophysicist", linkedin: "https://www.linkedin.com/in/saptarshi-mondal-057059265/", email: "saptarshidev169@gmail.com" },
  ];

  return (
    <div className="container mx-auto px-6 pt-28 pb-16">
      {/* Title */}
      <motion.h1 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-4xl font-bold text-center mb-4"
  >
    About <span className="text-primary">ExoAnalytica</span>
  </motion.h1>

      {/* Mission */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-2xl mx-auto text-muted-foreground mb-12"
      >
        ExoAnalytica is a research-driven platform built for scientists to analyze, explore, and
        understand exoplanetary and astronomical data.  
        Our mission is to accelerate discoveries with the power of AI & advanced analytics.
      </motion.p>

      {/* Team Section */}
      <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
        <Users className="h-6 w-6 text-primary" /> Meet the Team
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
          >
            <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
                <div className="flex justify-center gap-3">
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <Button size="icon" variant="ghost">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href={`mailto:${member.email}`}>
                    <Button size="icon" variant="ghost">
                      <Mail className="h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Support Section */}
      <h2 className="text-2xl font-semibold mb-6 text-center">Contact Support</h2>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-muted-foreground mb-4">
          Have questions, issues, or feedback? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="gap-2">
            <Mail className="h-5 w-5" /> saptarshidev169@gmail.com
          </Button>
          <Button variant="outline" className="gap-2">
            <Phone className="h-5 w-5" /> +91 9876543210
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;