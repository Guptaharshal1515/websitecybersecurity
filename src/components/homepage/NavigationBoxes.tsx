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

const boxConfigs = [
  {
    title: 'Cybersecurity',
    subtitle: 'Certifications',
    description: 'View your cybersecurity certifications.',
    buttonLabel: 'View Certificates',
    icon: ShieldCheck,
    route: '/cybersecurity-certificates',
    colorClass: 'nav-box-primary',
  },
  {
    title: 'Blockchain',
    subtitle: 'Certifications',
    description: 'View your blockchain certifications',
    buttonLabel: 'View Certificates',
    icon: Blocks,
    route: '/blockchain-certificates',
    colorClass: 'nav-box-accent',
  },
  {
    title: 'Completed',
    subtitle: 'Projects',
    description: "View the projects you've completed.",
    buttonLabel: 'View Projects',
    icon: FolderKanban,
    route: '/projects',
    colorClass: 'nav-box-info',
  },
  {
    title: 'Badges',
    subtitle: 'Collected',
    description: "View all the badges you've collected.",
    buttonLabel: 'View Badges',
    icon: Medal,
    route: '/digital-badges',
    colorClass: 'nav-box-purple',
  },
] as const;

export const NavigationBoxes = ({ certificatesCount, projectsCount, badgesCount }: NavigationBoxesProps) => {
  const navigate = useNavigate();

  const counts = [
    certificatesCount?.cybersecurity || 0,
    certificatesCount?.blockchain || 0,
    projectsCount || 0,
    badgesCount || 0,
  ];

  return (
    <div id="explore-section" className="mb-24">
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
        {boxConfigs.map((box, i) => (
          <motion.div
            key={box.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
          >
            <button
              onClick={() => navigate(box.route)}
              className={`w-full text-left group relative rounded-2xl overflow-hidden bg-card/70 backdrop-blur-xl transition-all duration-500 ${box.colorClass}`}
            >
              {/* Glowing border */}
              <div className="nav-box-border absolute inset-0 rounded-2xl transition-opacity duration-500 opacity-40 group-hover:opacity-90" />
              {/* Top glow bar */}
              <div className="nav-box-glow-bar absolute top-0 left-1/4 right-1/4 h-[1px] opacity-60 group-hover:opacity-100 group-hover:left-[10%] group-hover:right-[10%] transition-all duration-700" />
              {/* Bottom glow */}
              <div className="nav-box-glow-bar absolute bottom-0 left-1/3 right-1/3 h-[1px] opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
              {/* Hover glow aura */}
              <div className="nav-box-aura absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10" />

              <div className="relative p-6 flex flex-col h-full min-h-[260px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="nav-box-icon-bg p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110">
                    <box.icon className="h-5 w-5 nav-box-icon" />
                  </div>
                  <span className="text-3xl font-bold font-mono nav-box-text">
                    {counts[i]}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {box.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {box.subtitle}
                </p>

                <div className="nav-box-divider h-px w-full mb-4 opacity-20" />

                <span className="text-2xl font-bold font-mono mb-1 nav-box-text">
                  {counts[i]}
                </span>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  {box.description}
                </p>

                <div className="mt-auto">
                  <div className="nav-box-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300 group-hover:gap-3">
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
