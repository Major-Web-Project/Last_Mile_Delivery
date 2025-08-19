import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-xl text-muted-foreground">Oops! Page not found.</p>
        <a
          href="/"
          className="text-primary hover:underline text-lg font-medium"
        >
          ← Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
