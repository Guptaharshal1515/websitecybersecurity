import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Code, User, Award } from 'lucide-react';
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
    },
    {
      title: "Digital Badges",
      subtitle: "Certifications",
      count: `${badgesCount || 6} Collected`,
      icon: Award,
      route: "/digital-badges",
      gradient: "from-purple-500 to-pink-500",
      glowColor: "#9333ea"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative">
      {/* Background decoration */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl opacity-30"></div>
      
      {navigationBoxes.map((box, index) => (
        <motion.div
          key={box.title}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.2,
            type: "spring",
            stiffness: 100 
          }}
        >
          <Card
            className="group cursor-pointer border-0 overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-2xl relative backdrop-blur-sm bg-white/10 border border-white/20"
            onClick={() => navigate(box.route)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
              e.currentTarget.style.boxShadow = `0 20px 60px ${box.glowColor}40, 0 0 40px ${box.glowColor}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <CardContent className="p-10 text-center relative overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
              
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${box.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              {/* Icon with enhanced animation */}
              <div className="mb-6 flex justify-center relative">
                <motion.div 
                  className={`p-6 rounded-2xl bg-gradient-to-br ${box.gradient} group-hover:scale-125 transition-all duration-500 shadow-2xl relative overflow-hidden`}
                  whileHover={{ 
                    rotateY: 15,
                    rotateX: 5
                  }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <box.icon className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                </motion.div>
              </div>
              
              {/* Content with improved typography */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-100 transition-colors duration-300">
                  {box.title}
                </h3>
                <p className="text-gray-300 font-medium">
                  {box.subtitle}
                </p>
                <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${box.gradient} text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {box.count}
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};