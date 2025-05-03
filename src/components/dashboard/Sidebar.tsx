
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, FileText, Mail, Home, LogOut, Menu, X 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const NavItem = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-amodes-light/10",
          isActive ? "bg-amodes-light/15 text-amodes font-medium" : "text-gray-700"
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="bg-white"
        >
          {isMobileSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 flex-col border-r bg-white transition-transform md:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b px-4">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 font-bold text-xl text-amodes"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <img
              src="/lovable-uploads/f31d2ffb-7e7f-40c8-9977-8f4c4ca6aae3.png"
              alt="AMODES Logo"
              className="h-8 w-auto"
            />
            AMODES
          </Link>
        </div>
        <div className="flex flex-col gap-1 p-4 pt-6">
          <div className="mb-6 px-3 py-2">
            <p className="text-xs font-medium text-gray-500">Logged in as</p>
            <p className="text-sm font-medium text-amodes">{user}</p>
          </div>

          <NavItem to="/dashboard" icon={Home} label="Dashboard" />
          <NavItem to="/members" icon={Users} label="Members" />
          <NavItem to="/publications" icon={FileText} label="Publications" />
          <NavItem to="/subscribers" icon={Mail} label="Subscribers" />
          
          <div className="mt-auto pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
