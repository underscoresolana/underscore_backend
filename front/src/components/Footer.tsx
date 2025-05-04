import { Link } from 'react-router-dom';
import { ExternalLink, Github, Twitter } from 'lucide-react';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-sm hover:text-[var(--accent-color-1)] relative inline-flex items-center gap-1.5 transition-colors duration-300"
    target="_blank" 
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-w-[180px]">
    <h3 className="mb-3 font-medium text-foreground border-b border-white/10 pb-1">{title}</h3>
    <ul className="space-y-2">
      {children}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-black/70 backdrop-blur-md border-t border-white/10 mt-16">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0 max-w-xs">
            <Link to="/" className="title-link inline-block mb-2">
              <h2 className="title-gradient font-medium font-inter text-xl tracking-tight">
                under__score / app
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground/90 mt-2 leading-relaxed">
              Advanced analytics and scoring platform for Web3 markets with real-time data and AI-powered insights.
            </p>
            <div className="flex mt-4 space-x-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-black/50 border border-white/10 hover:border-[var(--accent-color-1)] hover:text-[var(--accent-color-1)] transition-all">
                <Twitter size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-black/50 border border-white/10 hover:border-[var(--accent-color-1)] hover:text-[var(--accent-color-1)] transition-all">
                <Github size={16} />
              </a>
              <a href="https://underscorelabs.dev/" target="_blank" rel="noopener noreferrer" className="p-2 bg-black/50 border border-white/10 hover:border-[var(--accent-color-1)] hover:text-[var(--accent-color-1)] transition-all">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-3xl">
            <FooterSection title="Navigation">
              <li><Link to="/" className="text-sm hover:text-[var(--accent-color-1)] transition-colors">Home</Link></li>
              <li><Link to="/markets" className="text-sm hover:text-[var(--accent-color-1)] transition-colors">Markets</Link></li>
              <li><Link to="/deep-dive" className="text-sm hover:text-[var(--accent-color-1)] transition-colors">Deep Dive</Link></li>
            </FooterSection>
            
            <FooterSection title="Resources">
              <li><FooterLink href="#">Documentation <ExternalLink size={12} className="ml-0.5 inline-block align-text-bottom" /></FooterLink></li>
              <li><FooterLink href="#">API <ExternalLink size={12} className="ml-0.5 inline-block align-text-bottom" /></FooterLink></li>
              <li><FooterLink href="#">Glossary <ExternalLink size={12} className="ml-0.5 inline-block align-text-bottom" /></FooterLink></li>
            </FooterSection>
            
            <FooterSection title="Company">
              <li><FooterLink href="#">About <ExternalLink size={12} className="ml-0.5 inline-block align-text-bottom" /></FooterLink></li>
              <li><FooterLink href="#">Careers <ExternalLink size={12} className="ml-0.5 inline-block align-text-bottom" /></FooterLink></li>
              <li><FooterLink href="#">Contact <ExternalLink size={12} className="ml-0.5 inline-block align-text-bottom" /></FooterLink></li>
            </FooterSection>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-xs text-muted-foreground/80 text-center">
            © {new Date().getFullYear()} under__score. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
