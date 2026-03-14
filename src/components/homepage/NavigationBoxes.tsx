import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Blocks, FolderKanban, Medal, ChevronRight } from 'lucide-react';
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
      subtitle: 'Certifications',
      count: certificatesCount?.cybersecurity || 0,
      description: 'View your cybersecurity certifications.',
      buttonLabel: 'View Certificates',
      icon: ShieldCheck,
      route: '/cybersecurity-certificates',
      accentHsl: '160 84% 45%',
    },
    {
      title: 'Blockchain',
      subtitle: 'Certifications',
      count: certificatesCount?.blockchain || 0,
      description: 'View your blockchain certifications',
      buttonLabel: 'View Certificates',
      icon: Blocks,
      route: '/blockchain-certificates',
      accentHsl: '45 93% 58%',
    },
    {
      title: 'Completed',
      subtitle: 'Projects',
      count: projectsCount || 0,
      description: "View the projects you've completed.",
      buttonLabel: 'View Projects',
      icon: FolderKanban,
      route: '/projects',
      accentHsl: '200 80% 55%',
    },
    {
      title: 'Badges',
      subtitle: 'Collected',
      count: badgesCount || 0,
      description: "View all the badges you've collected.",
      buttonLabel: 'View Badges',
      icon: Medal,
      route: '/digital-badges',
      accentHsl: '280 70% 60%',
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {boxes.map((box, i) => (
          <motion.div
            key={box.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
          >
            <button
              onClick={() => navigate(box.route)}
              className="w-full text-left group relative rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                background: 'hsl(var(--card) / 0.7)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Glowing border */}
              <div
                className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                style={{
                  boxShadow: `inset 0 0 0 1px hsl(${box.accentHsl} / 0.4), 0 0 20px hsl(${box.accentHsl} / 0.08)`,
                }}
              />
              {/* Top glow bar */}
              <div
                className="absolute top-0 left-1/4 right-1/4 h-[1px] opacity-60 group-hover:opacity-100 group-hover:left-[10%] group-hover:right-[10%] transition-all duration-700"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(${box.accentHsl}), transparent)`,
                }}
              />
              {/* Bottom glow */}
              <div
                className="absolute bottom-0 left-1/3 right-1/3 h-[1px] opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(${box.accentHsl} / 0.6), transparent)`,
                }}
              />

              <div className="relative p-6 flex flex-col h-full min-h-[260px]">
                {/* Header: icon + count */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110"
                    style={{
                      borderColor: `hsl(${box.accentHsl} / 0.3)`,
                      backgroundColor: `hsl(${box.accentHsl} / 0.08)`,
                    }}
                  >
                    <box.icon
                      className="h-5 w-5"
                      style={{ color: `hsl(${box.accentHsl})` }}
                    />
                  </div>
                  <span
                    className="text-3xl font-bold font-mono"
                    style={{ color: `hsl(${box.accentHsl})` }}
                  >
                    {box.count}
                  </span>
                </div>

                {/* Title + subtitle */}
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {box.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {box.subtitle}
                </p>

                {/* Divider */}
                <div
                  className="h-px w-full mb-4 opacity-20"
                  style={{ backgroundColor: `hsl(${box.accentHsl})` }}
                />

                {/* Count repeated + description */}
                <span
                  className="text-2xl font-bold font-mono mb-1"
                  style={{ color: `hsl(${box.accentHsl})` }}
                >
                  {box.count}
                </span>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  {box.description}
                </p>

                {/* Button */}
                <div className="mt-auto">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 group-hover:gap-3"
                    style={{
                      borderColor: `hsl(${box.accentHsl} / 0.4)`,
                      color: `hsl(${box.accentHsl})`,
                      backgroundColor: `hsl(${box.accentHsl} / 0.05)`,
                    }}
                  >
                    {box.buttonLabel}
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
