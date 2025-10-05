import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const NotificationSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(false);

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <h1 className="text-3xl font-bold mb-4">Notification Preferences</h1>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <span>Email Alerts</span>
          <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
        </div>
        <div className="flex items-center justify-between border-b pb-4">
          <span>System Notifications</span>
          <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;