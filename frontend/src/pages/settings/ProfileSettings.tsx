import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const ProfileSettings = () => {
  const [name, setName] = useState("Saptarshi Mondal");
  const [email, setEmail] = useState("saptarshimondal053@gmail.com");

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
      <div className="max-w-md space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary btn-glow">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;