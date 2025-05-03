
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMembers, getPublications, getSubscribers } from "@/services/api";

const DashboardStats = () => {
  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  const { data: publications = [] } = useQuery({
    queryKey: ['publications'],
    queryFn: getPublications,
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['subscribers'],
    queryFn: getSubscribers,
  });

  const stats = [
    {
      title: "Total Members",
      value: members.length,
      icon: <Users className="h-5 w-5 text-amodes" />,
      description: "Members in the organization",
    },
    {
      title: "Publications",
      value: publications.length,
      icon: <FileText className="h-5 w-5 text-amodes" />,
      description: "Total posts and news",
    },
    {
      title: "Subscribers",
      value: subscribers.length,
      icon: <Mail className="h-5 w-5 text-amodes" />,
      description: "Newsletter subscribers",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
