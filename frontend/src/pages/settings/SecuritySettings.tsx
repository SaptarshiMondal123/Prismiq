import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SecuritySettings = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <h1 className="text-3xl font-bold mb-4">Security Settings</h1>
      <div className="max-w-md space-y-4">
        <div>
          <Label>Current Password</Label>
          <Input type="password" placeholder="Enter current password" />
        </div>
        <div>
          <Label>New Password</Label>
          <Input type="password" placeholder="Enter new password" />
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary btn-glow">
          Update Password
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
