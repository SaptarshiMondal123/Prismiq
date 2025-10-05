import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-4 text-glow">404</div>
        <h1 className="mb-4 text-4xl font-bold">Lost in Space</h1>
        <p className="mb-8 text-xl text-muted-foreground">This sector of the cosmos hasn't been discovered yet.</p>
        <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg btn-glow">
          Return to Base
        </a>
      </div>
    </div>
  );
};

export default NotFound;
