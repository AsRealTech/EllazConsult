import { Link } from "wouter";
import { ArrowRight, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/use-services";
import * as Icons from "lucide-react";

// Helper to safely render icons by string name
const renderIcon = (name: string, className?: string) => {
  const IconComponent = (Icons as any)[name] || FileBadge;
  return <IconComponent className={className} />;
};

export function Services() {
  const { data: services, isLoading } = useServices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">Our Services</h1>
        <p className="text-muted-foreground text-lg">Explore all the services we offer and choose the one that fits your needs.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-8 shadow-sm border border-border animate-pulse h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-3xl p-8 shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {renderIcon(service.icon || 'FileText', 'w-7 h-7')}
              </div>
              <h3 className="text-xl font-bold font-display mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-1">{service.description}</p>
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <span className="font-bold text-lg text-foreground">{service.price || 'Contact for price'}</span>
                <Link href={`https://wa.me/2349065480499?text=Hello%20I%20am%20interested%20in%20the%20service%20${encodeURIComponent(service.title)}`} target="_blank">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 font-semibold gap-1">
                    <Link to="https://wa.me/2349065480499">Talk to Agent</Link> <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
