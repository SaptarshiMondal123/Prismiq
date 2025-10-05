import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Explorer from "./pages/Explorer";
import Analysis from "./pages/Analysis";
import DataUpload from "./pages/DataUpload";
import Models from "./pages/Models";
import Statistics from "./pages/Statistics";
import Anomalies from "./pages/Anomalies";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import ProfileSettings from "./pages/settings/ProfileSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import AccountSettings from "./pages/settings/AccountSettings";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative min-h-screen">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                <>
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/explorer" element={<Explorer />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/analysis/:id" element={<Analysis />} />
                    <Route path="/data-upload" element={<DataUpload />} />
                    <Route path="/models" element={<Models />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/anomalies" element={<Anomalies />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings/profile" element={<ProfileSettings />} />
                    <Route path="/settings/notifications" element={<NotificationSettings />} />
                    <Route path="/settings/security" element={<SecuritySettings />} />
                    <Route path="/settings/account" element={<AccountSettings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
