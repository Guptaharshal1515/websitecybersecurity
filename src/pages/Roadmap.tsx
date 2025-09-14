
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoadmapCanvas } from './RoadmapCanvas';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronDown, ExternalLink, X } from 'lucide-react';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { RoadmapForm } from '@/components/editor/forms/RoadmapForm';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';
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

export const RoadmapOld = () => {
  const { themeColors, userRole } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isEditMode, canEdit } = useEditMode();
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cybersecurity', 'blockchain', 'cloud']);
  const [selectedResource, setSelectedResource] = useState<ResourceModal | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
          { 
            title: 'Blockchain Basics', 
            link: 'https://blockchain.info/learn',
            description: 'Fundamental concepts of blockchain technology'
          },
          { 
            title: 'Ethereum, DeFi Concepts', 
            link: 'https://ethereum.org/en/',
            description: 'Understanding Ethereum blockchain and DeFi protocols'
          },
          { 
            title: 'Solidity Programming', 
            link: 'https://soliditylang.org/',
            description: 'Smart contract development with Solidity'
          },
          { 
            title: 'Smart Contract Auditing', 
            link: 'https://consensys.github.io/smart-contract-best-practices/',
            description: 'Security auditing for smart contracts'
          },
          { 
            title: 'Web3 Tools (Metamask, etc.)', 
            link: 'https://metamask.io/',
            description: 'Essential Web3 development tools and wallets'
          },
          { 
            title: 'NFT, Tokens, Crypto', 
            link: 'https://opensea.io/learn',
            description: 'Understanding NFTs, tokens, and cryptocurrency'
          }
        ]
      },
      {
        id: 'cloud',
        title: 'Cloud & Infrastructure',
        subtopics: [
          { 
            title: 'Cloud Fundamentals', 
            link: 'https://aws.amazon.com/getting-started/',
            description: 'Basic cloud computing concepts and services'
          },
          { 
            title: 'IAM, VPC, Storage', 
            link: 'https://docs.aws.amazon.com/iam/',
            description: 'Identity management, networking, and storage in cloud'
          },
          { 
            title: 'Cloud Security Practices', 
            link: 'https://aws.amazon.com/security/',
            description: 'Security best practices for cloud infrastructure'
          },
          { 
            title: 'Cloud Pentesting Labs', 
            link: 'https://flaws.cloud/',
            description: 'Hands-on cloud penetration testing exercises'
          },
          { 
            title: 'AWS / Azure Essentials', 
            link: 'https://aws.amazon.com/training/',
            description: 'Core services and features of major cloud providers'
          },
          { 
            title: 'Certifications (AWS, GCP)', 
            link: 'https://aws.amazon.com/certification/',
            description: 'Professional cloud certifications and career paths'
          }
        ]
      }
    ],
    semesters: [
      {
        id: '1st',
        title: '1st Semester',
        items: [
          { 
            title: 'Ubuntu Basics & Terminal Practice',
            link: 'https://ubuntu.com/tutorials',
            description: 'Learn Ubuntu Linux basics and command line interface'
          },
          { 
            title: 'Cisco Intro to Cybersecurity',
            link: 'https://www.netacad.com/courses/cybersecurity',
            description: 'Introduction to cybersecurity fundamentals by Cisco'
          },
          { 
            title: 'TryHackMe Pre-Security & Cyberi01',
            link: 'https://tryhackme.com/path/outline/presecurity',
            description: 'Beginner-friendly cybersecurity learning path'
          },
          { 
            title: 'Blockchain Intro (Bitcoin, Ethereum, DeFi)',
            link: 'https://bitcoin.org/en/getting-started',
            description: 'Introduction to blockchain technology and cryptocurrencies'
          },
          { 
            title: 'C Programming (GeeksForGeeks)',
            link: 'https://www.geeksforgeeks.org/c-programming-language/',
            description: 'Learn C programming fundamentals'
          },
          { 
            title: 'Python Basics (Loops, Functions)',
            link: 'https://www.python.org/about/gettingstarted/',
            description: 'Python programming basics and syntax'
          }
        ]
      },
      {
        id: '2nd',
        title: '2nd Semester',
        items: [
          { 
            title: 'Kali Linux Setup + Tools',
            link: 'https://www.kali.org/docs/introduction/',
            description: 'Setting up Kali Linux and penetration testing tools'
          },
          { 
            title: 'Nmap, Nikto, Metasploit',
            link: 'https://nmap.org/book/',
            description: 'Essential penetration testing tools and techniques'
          },
          { 
            title: 'Web Exploitation Labs (THM Red Team Path)',
            link: 'https://tryhackme.com/path/outline/redteaming',
            description: 'Hands-on web application security testing'
          },
          { 
            title: 'IBM Blockchain Essentials',
            link: 'https://www.ibm.com/blockchain/education',
            description: 'IBM blockchain fundamentals course'
          },
          { 
            title: 'Solidity Programming (CryptoZombies)',
            link: 'https://cryptozombies.io/',
            description: 'Learn Solidity through interactive coding lessons'
          },
          { 
            title: 'OS in Python + Certificate',
            link: 'https://www.coursera.org/learn/python-operating-system',
            description: 'Operating systems concepts using Python'
          }
        ]
      },
      {
        id: '3rd',
        title: '3rd Semester',
        items: [
          { 
            title: 'XSS, SQLi, SSRF – Advanced Web Attacks',
            link: 'https://portswigger.net/web-security',
            description: 'Advanced web application security vulnerabilities'
          },
          { 
            title: 'HTB Starting Point Labs',
            link: 'https://www.hackthebox.com/hacker/hacking-labs',
            description: 'Beginner penetration testing labs on HackTheBox'
          },
          { 
            title: 'Git & Github Workflow',
            link: 'https://git-scm.com/doc',
            description: 'Version control with Git and GitHub collaboration'
          },
          { 
            title: 'Smart Contract Security (Ethernaut)',
            link: 'https://ethernaut.openzeppelin.com/',
            description: 'Smart contract security challenges and vulnerabilities'
          },
          { 
            title: 'dApp Deployment on Mumbai Testnet',
            link: 'https://docs.polygon.technology/docs/develop/getting-started',
            description: 'Deploy decentralized applications on Polygon testnet'
          },
          { 
            title: 'Google IT Support Certificate',
            link: 'https://www.coursera.org/professional-certificates/google-it-support',
            description: 'Google IT Support Professional Certificate program'
          }
        ]
      },
      {
        id: '4th',
        title: '4th Semester',
        items: [
          { 
            title: 'Cloud Security (IAM, VPC, S3, EC2)',
            link: 'https://aws.amazon.com/security/',
            description: 'AWS cloud security fundamentals and best practices'
          },
          { 
            title: 'Cloud Pentesting Tools',
            link: 'https://flaws.cloud/',
            description: 'Cloud-specific penetration testing methodologies'
          },
          { 
            title: 'Smart Contract Auditing (SMC, Mythril)',
            link: 'https://mythril-classic.readthedocs.io/',
            description: 'Automated smart contract security analysis tools'
          },
          { 
            title: 'Python Recon + Automation Scripts',
            link: 'https://automatetheboringstuff.com/',
            description: 'Python automation for cybersecurity tasks'
          },
          { 
            title: 'Deploy Personal Dashboard (React)',
            link: 'https://reactjs.org/tutorial/tutorial.html',
            description: 'Build and deploy a personal portfolio website'
          },
          { 
            title: 'Blockchain + Cloud Crossover Project',
            link: 'https://aws.amazon.com/blockchain/',
            description: 'Integrating blockchain with cloud infrastructure'
          }
        ]
      },
      {
        id: '5th',
        title: '5th Semester',
        items: [
          { 
            title: 'Full Red Team Lab (TryHackMe/HTB)',
            link: 'https://tryhackme.com/path/outline/redteaming',
            description: 'Complete red team simulation exercises'
          },
          { 
            title: 'CompTIA Pentest+ (Planned)',
            link: 'https://www.comptia.org/certifications/pentest',
            description: 'Professional penetration testing certification'
          },
          { 
            title: 'Deploy Production-Ready dApp',
            link: 'https://docs.ethereum.org/en/developers/tutorials/',
            description: 'Build and deploy a production blockchain application'
          },
          { 
            title: 'Solidity Optimizations',
            link: 'https://docs.soliditylang.org/en/latest/optimizations.html',
            description: 'Gas optimization techniques for smart contracts'
          },
          { 
            title: 'Web3 & Cloud Integration',
            link: 'https://moralis.io/web3/',
            description: 'Integrating Web3 applications with cloud services'
          },
          { 
            title: 'Launch Portfolio + Blog',
            link: 'https://pages.github.com/',
            description: 'Create professional portfolio and technical blog'
          }
        ]
      },
      {
        id: '6th',
        title: '6th Semester',
        items: [
          { 
            title: 'Capture the Flag Tournaments',
            link: 'https://ctftime.org/',
            description: 'Participate in competitive cybersecurity challenges'
          },
          { 
            title: 'Bug Bounty (HackerOne, Bugcrowd)',
            link: 'https://www.hackerone.com/',
            description: 'Ethical hacking and vulnerability disclosure programs'
          },
          { 
            title: 'Web3 / Security Open Source Projects',
            link: 'https://github.com/topics/web3-security',
            description: 'Contribute to open source security projects'
          },
          { 
            title: 'Internship / Project Based Learning',
            link: 'https://www.linkedin.com/jobs/',
            description: 'Gain practical experience through internships'
          },
          { 
            title: 'Start OSCP or Advanced Prep',
            link: 'https://www.offensive-security.com/pwk-oscp/',
            description: 'Prepare for advanced penetration testing certification'
          },
          { 
            title: 'Build Learning Tracker Tool',
            link: 'https://github.com/',
            description: 'Develop a personal learning progress tracking application'
          }
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

  const addRoadmapMutation = useMutation({
    mutationFn: async (newRoadmap: { title: string; description: string }) => {
      const { data, error } = await supabase
        .from('roadmaps')
        .insert([newRoadmap])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      toast({ title: 'Roadmap category added successfully!' });
      setShowAddForm(false);
    }
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.background }}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <div className="relative">
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
          
          {canEdit && (
            <div className="flex gap-2">
              <AddContentButton onClick={() => setShowAddForm(true)}>
                Add Category
              </AddContentButton>
              <AddContentButton onClick={() => {}}>
                Add Topics
              </AddContentButton>
            </div>
          )}
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
                   <InlineEditText
                     value={category.title}
                     onSave={(value) => {/* TODO: Add update mutation */}}
                   >
                     <h3 
                       className="text-lg font-semibold"
                       style={{ color: themeColors.primary }}
                     >
                       {category.title}
                     </h3>
                   </InlineEditText>
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
                        className={`p-2 rounded text-sm transition-all duration-200 ${
                          item.link ? 'cursor-pointer hover:scale-105' : ''
                        }`}
                        style={{ backgroundColor: themeColors.background }}
                        onClick={() => item.link && handleResourceClick(item)}
                      >
                        <div className="flex items-center justify-between">
                          <span style={{ color: themeColors.text }}>
                            ├─ {item.title}
                          </span>
                          {item.link && (
                            <ExternalLink className="h-3 w-3 opacity-60" style={{ color: themeColors.primary }} />
                          )}
                        </div>
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

// New canvas-based roadmap as default export
export const Roadmap = () => {
  return <RoadmapCanvas />;
};
