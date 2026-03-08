import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';

const siteMap = [
  { label: 'Home', path: '/' },
  { label: 'Cybersecurity', path: '/cybersecurity-certificates' },
  { label: 'Blockchain', path: '/blockchain-certificates' },
  { label: 'Projects', path: '/projects' },
  { label: 'Achievements', path: '/achievements' },
  { label: 'Digital Badges', path: '/digital-badges' },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/Guptaharshal1515', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/harshal-gupta-a27914287/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:guptaharshal1515@gmail.com', label: 'Email' },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-mono text-sm text-primary tracking-widest">~/portfolio</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Cybersecurity professional & blockchain enthusiast. Building secure systems and decentralized solutions.
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full mt-6" />
          </div>

          {/* Site Map */}
          <div>
            <h3 className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-5">Navigation</h3>
            <ul className="space-y-3">
              {siteMap.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-5">Connect</h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              contact@example.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Built with precision & purpose
          </p>
        </div>
      </div>
    </footer>
  );
};
