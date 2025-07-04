import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Code, User } from 'lucide-react';

interface NavigationBoxesProps {
  certificatesCount: {
    cybersecurity: number;
    blockchain: number;
  } | undefined;
  projectsCount: number | undefined;
}

export const NavigationBoxes = ({ certificatesCount, projectsCount }: NavigationBoxesProps) => {
  const { themeColors } = useTheme();
  const navigate = useNavigate();

  const navigationBoxes = [
    {
      title: "Cybersecurity",
      subtitle: "Certificates",
      count: `${certificatesCount?.cybersecurity || 3} Earned`,
      icon: Shield,
      route: "/cybersecurity-certificates",
      gradient: "from-red-500 to-pink-500",
      glowColor: "#dc2626"
    },
    {
      title: "Blockchain",
      subtitle: "Certificates", 
      count: `${certificatesCount?.blockchain || 2} Earned`,
      icon: Code,
      route: "/blockchain-certificates",
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "#2563eb"
    },
    {
      title: "Projects",
      subtitle: "Done",
      count: `${projectsCount || 5} Completed`,
      icon: User,
      route: "/projects",
      gradient: "from-green-500 to-emerald-500",
      glowColor: "#16a34a"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {navigationBoxes.map((box, index) => (
        <Card
          key={box.title}
          className={`group cursor-pointer border-0 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in relative pixel-box`}
          style={{ 
            backgroundColor: themeColors.surface,
            animationDelay: `${index * 200}ms`
          }}
          onClick={() => navigate(box.route)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 30px ${box.glowColor}`;
            e.currentTarget.style.border = `2px solid ${box.glowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.border = '';
          }}
        >
          <CardContent className="p-8 text-center relative">
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${box.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className={`p-4 rounded-full bg-gradient-to-br ${box.gradient} group-hover:scale-110 transition-transform duration-300`}>
                <box.icon className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold mb-2" style={{ color: themeColors.text }}>
              {box.title}
            </h3>
            <p className="text-sm mb-3" style={{ color: themeColors.accent }}>
              {box.subtitle}
            </p>
            <p className="text-lg font-semibold" style={{ color: themeColors.primary }}>
              {box.count}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};