
import Layout from "@/components/dashboard/Layout";
import Header from "@/components/dashboard/Header";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Header 
        title={`Welcome, ${user || 'Admin'}`}
        description="AMODES Admin Dashboard"
      />
      
      <div className="p-6 space-y-6">
        <DashboardStats />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">AMODES Admin Portal</h2>
            <p className="text-gray-600 mb-3">
              This administration portal allows you to manage all aspects of the AMODES platform:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Manage member profiles and permissions</li>
              <li>Create and edit publications</li>
              <li>View subscriber information</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-full">
              <img
                src="/lovable-uploads/f31d2ffb-7e7f-40c8-9977-8f4c4ca6aae3.png"
                alt="AMODES Logo"
                className="max-h-40 max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
