
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Header: React.FC<HeaderProps> = ({ title, description, action }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b bg-white">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        {action && (
          <Button 
            onClick={action.onClick}
            className="bg-amodes hover:bg-amodes-dark text-white"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
