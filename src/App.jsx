import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Auth/SignIn";
import ProtectedRoute from "./utils/Protector";

const App = () => {
  return (

      <Routes>
        {/* Public Route for SignIn */}
        <Route path="/auth" element={<SignIn />} />
        
        {/* Protected Route for Home */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
      </Routes>

  );
};

export default App;
