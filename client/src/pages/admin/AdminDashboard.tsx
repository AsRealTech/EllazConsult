import { 
  Building2, 
  FileText, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { useServices } from "@/hooks/use-services";
import { usePosts } from "@/hooks/use-posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDashboard() {
  const { data: services } = useServices();
  const { data: posts } = usePosts();

  const stats = [
    {
      title: "Total Services",
      value: services?.length || 0,
      icon: Building2,
      description: "Active services offered",
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Blog Posts",
      value: posts?.length || 0,
      icon: FileText,
      description: "Published articles",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Registrations",
      value: "124",
      icon: TrendingUp,
      description: "Completed this month",
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      title: "Active Clients",
      value: "86",
      icon: Users,
      description: "In the portal",
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome to the NextGen CAC Agent administration portal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Recent Services</CardTitle>
          </CardHeader>
          <CardContent>
            {services?.slice(0, 5).map(service => (
              <div key={service.id} className="flex justify-between items-center py-3 border-b last:border-0 border-border">
                <span className="font-medium text-foreground">{service.title}</span>
                <span className="text-sm font-semibold text-primary">{service.price}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Latest Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {posts?.slice(0, 5).map(post => (
              <div key={post.id} className="py-3 border-b last:border-0 border-border">
                <p className="font-medium text-foreground truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
