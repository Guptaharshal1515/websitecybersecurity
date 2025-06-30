import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronDown, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

interface RoadmapData {
  id: string;
  title: string;
  description: string | null;
  display_order: number | null;
}

interface TopicData {
  id: string;
  title: string;
  roadmap_id: string | null;
  display_order: number | null;
}

interface SubtopicData {
  id: string;
  title: string;
  topic_id: string | null;
  resource_link: string | null;
  display_order: number | null;
  is_completed: boolean | null;
}

interface ResourceModal {
  title: string;
  description: string;
  link: string;
}

export const Roadmap = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cybersecurity', 'blockchain', 'cloud']);
  const [selectedResource, setSelectedResource] = useState<ResourceModal | null>(null);

  // Only redirect if user is not logged in or is specifically a viewer
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Restricted
            </h2>
            <p style={{ color: themeColors.accent }}>
              Please log in to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeColors.background }}>
        <Card className="border-0" style={{ backgroundColor: themeColors.surface }}>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
              Access Restricted
            </h2>
            <p style={{ color: themeColors.accent }}>
              This page is only available to customers and administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: roadmaps = [] } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as RoadmapData[];
    },
  });

  const { data: topics = [] } = useQuery({
    queryKey: ['roadmap-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap_topics')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as TopicData[];
    },
  });

  const { data: subtopics = [] } = useQuery({
    queryKey: ['roadmap-subtopics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roadmap_subtopics')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as SubtopicData[];
    },
  });

  // Dummy data structure with clickable resources
  const dummyRoadmapData = {
    categories: [
      {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        subtopics: [
          { 
            title: 'Ubuntu Basics', 
            link: 'https://ubuntu.com/tutorials',
            description: 'Learn the fundamentals of Ubuntu Linux operating system'
          },
          { 
            title: 'Shell Scripting', 
            link: 'https://www.shellscript.sh/',
            description: 'Master bash scripting for automation and system administration'
          },
          { 
            title: 'Nmap, Nikto, Metasploit', 
            link: 'https://nmap.org/book/',
            description: 'Essential penetration testing tools and techniques'
          },
          { 
            title: 'Web Pentesting', 
            link: 'https://portswigger.net/web-security',
            description: 'Comprehensive web application security testing methodology'
          },
          { 
            title: 'TryHackMe / HTB', 
            link: 'https://tryhackme.com/',
            description: 'Hands-on cybersecurity challenges and learning paths'
          },
          { 
            title: 'Certifications', 
            link: 'https://www.comptia.org/certifications/security',
            description: 'Industry-recognized cybersecurity certifications'
          }
        ]
      },
      {
        id: 'blockchain',
        title: 'Blockchain & Web3',
        subtopics: [
          { title: 'Blockchain Basics', link: null },
          { title: 'Ethereum, DeFi Concepts', link: null },
          { title: 'Solidity Programming', link: null },
          { title: 'Smart Contract Auditing', link: null },
          { title: 'Web3 Tools (Metamask, etc.)', link: null },
          { title: 'NFT, Tokens, Crypto', link: null }
        ]
      },
      {
        id: 'cloud',
        title: 'Cloud & Infrastructure',
        subtopics: [
          { title: 'Cloud Fundamentals', link: null },
          { title: 'IAM, VPC, Storage', link: null },
          { title: 'Cloud Security Practices', link: null },
          { title: 'Cloud Pentesting Labs', link: null },
          { title: 'AWS / Azure Essentials', link: null },
          { title: 'Certifications (AWS, GCP)', link: null }
        ]
      }
    ],
    semesters: [
      {
        id: '1st',
        title: '1st Semester',
        items: [
          'Ubuntu Basics & Terminal Practice',
          'Cisco Intro to Cybersecurity',
          'TryHackMe Pre-Security & Cyberi01',
          'Blockchain Intro (Bitcoin, Ethereum, DeFi)',
          'C Programming (GeeksForGeeks)',
          'Python Basics (Loops, Functions)'
        ]
      },
      {
        id: '2nd',
        title: '2nd Semester',
        items: [
          'Kali Linux Setup + Tools',
          'Nmap, Nikto, Metasploit',
          'Web Exploitation Labs (THM Red Team Path)',
          'IBM Blockchain Essentials',
          'Solidity Programming (CryptoZombies)',
          'OS in Python + Certificate'
        ]
      },
      {
        id: '3rd',
        title: '3rd Semester',
        items: [
          'XSS, SQLi, SSRF – Advanced Web Attacks',
          'HTB Starting Point Labs',
          'Git & Github Workflow',
          'Smart Contract Security (Ethernaut)',
          'dApp Deployment on Mumbai Testnet',
          'Google IT Support Certificate'
        ]
      },
      {
        id: '4th',
        title: '4th Semester',
        items: [
          'Cloud Security (IAM, VPC, S3, EC2)',
          'Cloud Pentesting Tools',
          'Smart Contract Auditing (SMC, Mythril)',
          'Python Recon + Automation Scripts',
          'Deploy Personal Dashboard (React)',
          'Blockchain + Cloud Crossover Project'
        ]
      },
      {
        id: '5th',
        title: '5th Semester',
        items: [
          'Full Red Team Lab (TryHackMe/HTB)',
          'CompTIA Pentest+ (Planned)',
          'Deploy Production-Ready dApp',
          'Solidity Optimizations',
          'Web3 & Cloud Integration',
          'Launch Portfolio + Blog'
        ]
      },
      {
        id: '6th',
        title: '6th Semester',
        items: [
          'Capture the Flag Tournaments',
          'Bug Bounty (HackerOne, Bugcrowd)',
          'Web3 / Security Open Source Projects',
          'Internship / Project Based Learning',
          'Start OSCP or Advanced Prep',
          'Build Learning Tracker Tool'
        ]
      }
    ]
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleResourceClick = (subtopic: any) => {
    if (subtopic.link) {
      setSelectedResource({
        title: subtopic.title,
        description: subtopic.description,
        link: subtopic.link
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="relative mb-16">
          <h1 
            className="text-4xl font-bold text-center text-white"
          >
            Harshal Gupta's Roadmap Journey
          </h1>
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-1 rounded mt-2"
            style={{ 
              backgroundColor: themeColors.primary,
              boxShadow: `0 0 10px ${themeColors.primary}`
            }}
          />
        </div>

        {/* Main Tech Categories */}
        <div className="mb-16">
          <h2 
            className="text-2xl font-bold mb-8 text-center text-white"
          >
            🎯 Main Tech Categories (Top-Level Overview)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {dummyRoadmapData.categories.map((category) => (
              <Card 
                key={category.id}
                className="border-0"
                style={{ backgroundColor: themeColors.surface }}
              >
                <CardContent className="p-6">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: themeColors.primary }}
                      >
                        {category.title}
                      </h3>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-5 w-5" style={{ color: themeColors.primary }} />
                      ) : (
                        <ChevronRight className="h-5 w-5" style={{ color: themeColors.primary }} />
                      )}
                    </div>
                  </button>
                  
                  {expandedCategories.includes(category.id) && (
                    <div className="space-y-2">
                      {category.subtopics.map((subtopic, index) => (
                        <div 
                          key={index}
                          className={`flex items-center justify-between p-2 rounded transition-all duration-200 ${
                            subtopic.link ? 'cursor-pointer hover:scale-105' : ''
                          }`}
                          style={{ backgroundColor: themeColors.background }}
                          onClick={() => handleResourceClick(subtopic)}
                        >
                          <span 
                            className={`text-sm ${subtopic.link ? 'hover:underline' : ''}`}
                            style={{ color: themeColors.text }}
                          >
                            • {subtopic.title}
                          </span>
                          {subtopic.link && (
                            <ExternalLink className="h-3 w-3 opacity-60" style={{ color: themeColors.primary }} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Semester-wise Learning Roadmap */}
        <div>
          <h2 
            className="text-2xl font-bold mb-8 text-center text-white"
            style={{ color: themeColors.text }}
          >
            📚 Semester-wise Learning Roadmap
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyRoadmapData.semesters.map((semester) => (
              <Card 
                key={semester.id}
                className="border-0"
                style={{ backgroundColor: themeColors.surface }}
              >
                <CardContent className="p-6">
                  <h3 
                    className="text-lg font-semibold mb-4 text-center"
                    style={{ color: themeColors.primary }}
                  >
                    📅 {semester.title}
                  </h3>
                  
                  <div className="space-y-2">
                    {semester.items.map((item, index) => (
                      <div 
                        key={index}
                        className="p-2 rounded text-sm"
                        style={{ backgroundColor: themeColors.background }}
                      >
                        <span style={{ color: themeColors.text }}>
                          ├─ {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Modal */}
      {selectedResource && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedResource(null)}
        >
          <Card 
            className="max-w-lg w-full border-0 relative"
            style={{ backgroundColor: themeColors.surface }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:opacity-80 z-10"
              style={{ backgroundColor: themeColors.primary }}
            >
              <X className="h-5 w-5 text-white" />
            </button>
            
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-4 text-white">
                {selectedResource.title}
              </h2>
              
              <p className="text-base mb-6 leading-relaxed text-gray-300">
                {selectedResource.description}
              </p>
              
              <a
                href={selectedResource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ backgroundColor: themeColors.primary, color: 'white' }}
              >
                Open Resource
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
