import { Link } from "wouter";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/use-services";
import * as Icons from "lucide-react";

// Helper to safely render icons by string name
const renderIcon = (name: string, className?: string) => {
  const IconComponent = (Icons as any)[name] || FileBadge;
  return <IconComponent className={className} />;
};

export function Home() {
  const { data: services, isLoading } = useServices();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 md:pt-24 pb-20 md:pb-32">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 md:pr-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm w-fit border border-primary/20">
                <ShieldCheck className="w-4 h-4" /> 
                Accredited CAC Agent
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight text-foreground">
                Register Your Business with <span className="text-primary relative whitespace-nowrap">
                  <span className="relative z-10">EllazConsult</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 -rotate-1"></span>
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fast, reliable, and completely stress-free Corporate Affairs Commission registrations. We handle the paperwork so you can focus on building your dream.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" className="rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 text-lg px-8 h-14 hover:-translate-y-0.5 transition-all">
                  <Link to="https://wa.me/2349065480499">Get Started Today</Link>
                </Button>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="rounded-xl text-lg px-8 h-14 border-2">
                    View All Services
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-6 text-sm font-medium text-foreground">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 100% Guaranteed</span>
                <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Fast Delivery</span>
              </div>
            </div>
            
            {/* Hero Image / Visual Element */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-transparent mix-blend-multiply z-10"></div>
                {/* Hero image showing modern business people in Nigeria */}
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000" 
                  alt="African business professionals" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                    <FileBadge className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold font-display text-foreground">Certificate Delivered</p>
                    <p className="text-sm text-muted-foreground font-medium">Just now for tech startup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">Our Core Services</h2>
            <p className="text-muted-foreground text-lg">We simplify the complex process of formalizing your business entity in Nigeria.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-8 shadow-sm border border-border animate-pulse h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.slice(0, 6).map((service) => (
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
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 font-semibold gap-1">
                      <Link to="https://wa.me/2349065480499">Talk to Agent</Link> <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="outline" size="lg" className="rounded-xl px-8 border-2">View All Available Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to make your business official?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of entrepreneurs who trust us with their CAC registrations. Start the process today and get your certificate in record time.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl rounded-xl h-14 px-10 text-lg font-bold">
            <Link to="https://wa.me/+2349065480499">Start Your Application Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
