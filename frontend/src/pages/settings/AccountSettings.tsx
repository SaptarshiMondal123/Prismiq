import { Button } from "@/components/ui/button";

const AccountSettings = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
      <p className="text-muted-foreground mb-6">
        You can manage your account or close it permanently from here.
      </p>
      <div className="flex gap-4">
        <Button variant="outline">Manage Subscription</Button>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
};

export default AccountSettings;