
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the main app
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-amodes-background">
      <div className="text-center">
        <div className="animate-pulse">
          <img 
            src="/lovable-uploads/f31d2ffb-7e7f-40c8-9977-8f4c4ca6aae3.png"
            alt="AMODES Logo" 
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-amodes mb-4">AMODES Admin Portal</h1>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
