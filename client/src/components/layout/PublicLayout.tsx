import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { FileBadge, Phone, Mail, MapPin, Menu, X, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsMap } from "@/hooks/use-settings";
import { useState } from "react";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettingsMap();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Contact Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {settings.phone || "+234 800 000 0000"}</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {settings.email || "support@cac-agent.ng"}</span>
          </div>
          <div>
            Fast & Reliable CAC Registration Services
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:scale-105 transition-transform">
                <FileBadge className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold font-display text-foreground">EllazConsult <span className="text-primary">CAC</span></span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 font-medium">
              <Link href="/" className={`hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-foreground'}`}>Home</Link>
              <Link href="/services" className={`hover:text-primary transition-colors ${location === '/services' ? 'text-primary' : 'text-foreground'}`}>Services</Link>
              <Link href="/blog" className={`hover:text-primary transition-colors ${location.startsWith('/blog') ? 'text-primary' : 'text-foreground'}`}>Blog</Link>
              <Link href="/contact" className={`hover:text-primary transition-colors ${location === '/contact' ? 'text-primary' : 'text-foreground'}`}>Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a href="/login">
                <Button variant="outline" className="font-semibold rounded-full px-6">Client Portal</Button>
              </a>
              <Button className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 font-semibold gap-2">
                Start Registration <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border p-4 flex flex-col gap-4 shadow-xl absolute w-full z-40 top-[116px] md:top-20">
          <Link href="/" onClick={closeMenu} className="font-medium p-2 text-foreground">Home</Link>
          <Link href="/services" onClick={closeMenu} className="font-medium p-2 text-foreground">Services</Link>
          <Link href="/blog" onClick={closeMenu} className="font-medium p-2 text-foreground">Blog</Link>
          <Link href="/contact" onClick={closeMenu} className="font-medium p-2 text-foreground">Contact</Link>
          <div className="h-px bg-border my-2"></div>
          <a href="/login" onClick={closeMenu} className="block">
            <Button variant="outline" className="w-full justify-center rounded-xl mb-2">Client Portal</Button>
          </a>
          <Button className="w-full justify-center rounded-xl gap-2">
            Start Registration <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground inline-flex">
                <FileBadge className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold font-display text-white">NextGen CAC</span>
            </div>
            <p className="text-slate-400 mt-2 leading-relaxed">
              Your trusted partner for fast, reliable, and authentic business registrations in Nigeria.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 font-display">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Latest News</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 font-display">Services</h3>
            <ul className="flex flex-col gap-3">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Business Name</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Limited Liability (LLC)</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">NGO & Foundation</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Annual Returns</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4 font-display">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{settings.address || "123 Business Way, Wuse 2, Abuja, FCT"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{settings.phone || "+234 800 000 0000"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{settings.email || "support@cac-agent.ng"}</span>
              </li>
            </ul>
          </div>
          {/* whatsapp icon and link to whatsapp chat */}
          {/* floating whatsapp chat button at the bottom right of the screen, visible on all screen sizes, with a green background and white text, with a message circle icon from lucide-react */} 
          <div style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000}} className="mt-4 md:mt-0 flex justify-center md:justify-end">
            <a href="https://wa.me/2349065480499" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EllazConsult CAC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
