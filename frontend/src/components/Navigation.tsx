import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, Atom, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/NotificationBell";
import Settings from "@/pages/Settings";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on login/signup page
  if (location.pathname === "/auth") {
    return null;
  }

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/explorer", label: "Explorer" },
    { path: "/analysis", label: "Analysis" },
    { path: "/data-upload", label: "Data Upload" },
    { path: "/models", label: "Models" },
    { path: "/statistics", label: "Statistics & Reports" },
    { path: "/anomalies", label: "Anomaly Explorer" },
    { path: "/help", label: "Help & Docs" },
    { path: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/auth");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <Atom className="h-6 w-6 text-secondary animate-float" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                ExoAnalytica
              </span>
            </Link>

            {/* Nav Items */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${
                      isActive(item.path)
                        ? "bg-primary/20 text-secondary"
                        : "text-muted-foreground hover:text-foreground"
                    } transition-all`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right Section (Notifications + Profile) */}
            <div className="flex items-center gap-2">
              <NotificationBell />

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/20"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 bg-background/90 backdrop-blur-lg border border-primary/20 shadow-lg"
                  align="end"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={openSettings}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <SettingsIcon className="h-4 w-4" /> Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex justify-center items-start pt-20">
          <div className="bg-background rounded-2xl shadow-lg w-full max-w-4xl p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={closeSettings}
              className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
            >
              ✕
            </button>
            <Settings />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;