// src/pages/Notifications.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New dataset uploaded successfully", time: "2m ago", read: false },
    { id: 2, text: "Model training completed", time: "10m ago", read: false },
    { id: 3, text: "Anomaly detected in Kepler dataset", time: "1h ago", read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="container mx-auto px-6 pt-28 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 flex items-center gap-2"
      >
        <Bell className="h-7 w-7 text-primary" />
        Notifications
      </motion.h1>

      <div className="flex justify-end mb-4">
        <Button onClick={markAllAsRead} variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      <div className="grid gap-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`rounded-xl transition ${
                n.read ? "opacity-60" : "border-primary"
              }`}
            >
              <CardContent className="p-4">
                <p className="text-sm">{n.text}</p>
                <p className="text-xs text-muted-foreground">{n.time}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
