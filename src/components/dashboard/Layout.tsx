
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={cn(
        "flex-1 md:ml-64", 
        "bg-gradient-to-b from-white to-amodes-background"
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
