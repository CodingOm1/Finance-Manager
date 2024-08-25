import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Set loading to false after checking authentication
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Display loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the sign-in page
    return <Navigate to="/auth" />;
  }

  // If authenticated, render the children components (e.g., Home page)
  return children;
};

export default ProtectedRoute;
