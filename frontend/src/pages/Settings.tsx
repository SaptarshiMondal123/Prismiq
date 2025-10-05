// src/pages/Settings.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage your account preferences and settings here.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card-space p-6 border rounded-2xl bg-background/50 hover:bg-background/70 transition-all">
            <h2 className="font-semibold mb-2">Profile Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Update your personal information, email, and display settings.
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary btn-glow"
              onClick={() => navigate("/settings/profile")}
            >
              Edit Profile
            </Button>
          </div>

          <div className="card-space p-6 border rounded-2xl bg-background/50 hover:bg-background/70 transition-all">
            <h2 className="font-semibold mb-2">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your notifications, alerts, and email preferences.
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary btn-glow"
              onClick={() => navigate("/settings/notifications")}
            >
              Update Preferences
            </Button>
          </div>

          <div className="card-space p-6 border rounded-2xl bg-background/50 hover:bg-background/70 transition-all">
            <h2 className="font-semibold mb-2">Security</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Change password, enable 2FA, and manage login sessions.
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary btn-glow"
              onClick={() => navigate("/settings/security")}
            >
              Security Settings
            </Button>
          </div>

          <div className="card-space p-6 border rounded-2xl bg-background/50 hover:bg-background/70 transition-all">
            <h2 className="font-semibold mb-2">Account</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Close account or manage account-related preferences.
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary btn-glow"
              onClick={() => navigate("/settings/account")}
            >
              Manage Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
