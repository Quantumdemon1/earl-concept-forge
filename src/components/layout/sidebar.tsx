
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Lightbulb, 
  Settings, 
  Plus,
  Home
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    title: "Concepts",
    href: "/concepts", 
    icon: Lightbulb
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="flex flex-col gap-2 p-4">
        <Button asChild className="justify-start">
          <Link to="/concepts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Concept
          </Link>
        </Button>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
