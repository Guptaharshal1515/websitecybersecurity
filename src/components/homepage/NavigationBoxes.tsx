import { useNavigate } from 'react-router-dom';
import { Shield, Code, Briefcase, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationBoxesProps {
  certificatesCount: {
    cybersecurity: number;
    blockchain: number;
  } | undefined;
  projectsCount: number | undefined;
  badgesCount: number | undefined;
}

export const NavigationBoxes = ({ certificatesCount, projectsCount, badgesCount }: NavigationBoxesProps) => {
  const navigate = useNavigate();

  const boxes = [
    {
      title: 'Cybersecurity',
      count: certificatesCount?.cybersecurity || 0,
      label: 'Certificates',
      icon: Shield,
      route: '/cybersecurity-certificates',
      accent: 'hsl(var(--primary))',
    },
    {
      title: 'Blockchain',
      count: certificatesCount?.blockchain || 0,
      label: 'Certificates',
      icon: Code,
      route: '/blockchain-certificates',
      accent: 'hsl(var(--accent))',
    },
    {
      title: 'Projects',
      count: projectsCount || 0,
      label: 'Completed',
      icon: Briefcase,
      route: '/projects',
      accent: 'hsl(160 84% 45%)',
    },
    {
      title: 'Badges',
      count: badgesCount || 0,
      label: 'Collected',
      icon: Award,
      route: '/digital-badges',
      accent: 'hsl(280 70% 55%)',
    },
  ];

  return (
    <div className="mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-[0.3em]">Explore</span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {boxes.map((box, i) => (
          <motion.div
            key={box.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
          >
            <button
              onClick={() => navigate(box.route)}
              className="w-full text-left group glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-500 hover:glow-primary relative overflow-hidden"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: box.accent }}
              />

              <div className="flex items-start justify-between mb-6">
                <div
                  className="p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: box.accent + '15' }}
                >
                  <box.icon className="h-5 w-5" style={{ color: box.accent }} />
                </div>
                <span
                  className="text-3xl font-bold font-mono"
                  style={{ color: box.accent }}
                >
                  {box.count}
                </span>
              </div>

              <h3 className="text-base font-semibold text-foreground mb-1">
                {box.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {box.label}
              </p>

              {/* Hover arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <span className="text-primary text-lg">→</span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
