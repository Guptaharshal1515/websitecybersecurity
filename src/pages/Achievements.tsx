import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, FileText, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { useEditMode } from '@/contexts/EditModeContext';

interface Achievement {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  certificate_url?: string;
  upload_date: string;
  display_order: number;
  achievement_type: string;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userRole } = useAuth();
  const { isEditMode } = useEditMode();
  const containerRef = useRef<HTMLDivElement>(null);

  const canEdit = userRole === 'admin' || userRole === 'editor';

  useEffect(() => {
    fetchAchievements();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('achievements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements'
        },
        () => {
          fetchAchievements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Adjust current index if needed
      if (currentIndex >= achievements.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % achievements.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  const getItemStyle = (index: number) => {
    const distance = Math.abs(index - currentIndex);
    const isCenter = distance === 0;
    const isAdjacent = distance === 1;
    
    let transform = '';
    let opacity = 1;
    let scale = 1;
    let zIndex = 1;
    let blur = 0;

    if (isCenter) {
      transform = 'translateX(0%) rotateY(0deg)';
      scale = 1;
      zIndex = 10;
      opacity = 1;
    } else if (isAdjacent) {
      const direction = index > currentIndex ? 1 : -1;
      transform = `translateX(${direction * 60}%) rotateY(${-direction * 25}deg)`;
      scale = 0.8;
      zIndex = 5;
      opacity = 0.6;
      blur = 2;
    } else {
      const direction = index > currentIndex ? 1 : -1;
      transform = `translateX(${direction * 120}%) rotateY(${-direction * 45}deg)`;
      scale = 0.6;
      zIndex = 1;
      opacity = 0.3;
      blur = 4;
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px)`,
    };
  };

  const getRoleTint = () => {
    if (userRole === 'admin') return 'from-red-500/10 to-red-600/10 border-red-500/20';
    if (userRole === 'customer') return 'from-blue-500/10 to-blue-600/10 border-blue-500/20';
    return 'from-primary/10 to-primary/20 border-primary/20';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Achievements</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my accomplishments, certifications, and milestones achieved throughout my journey.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            
            {/* Metadata Panel */}
            <div className="lg:col-span-1 space-y-6">
              {achievements.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {achievements[currentIndex]?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(achievements[currentIndex]?.upload_date).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievements[currentIndex]?.achievement_type}
                    </Badge>
                  </div>
                  
                  {achievements[currentIndex]?.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {achievements[currentIndex].description}
                    </p>
                  )}
                  
                  {achievements[currentIndex]?.certificate_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={achievements[currentIndex].certificate_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Certificate
                      </a>
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {/* 3D Showcase */}
            <div className="lg:col-span-3">
              <div 
                ref={containerRef}
                className="relative h-96 perspective-1000"
                style={{ perspective: '1000px' }}
              >
                {achievements.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No achievements to display</p>
                      {canEdit && isEditMode && (
                      <AddContentButton onClick={() => window.location.href = '/admin'}>
                        Add Achievement
                      </AddContentButton>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Navigation Arrows */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full"
                      onClick={goToPrevious}
                      disabled={achievements.length <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full"
                      onClick={goToNext}
                      disabled={achievements.length <= 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* 3D Cards */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            className="absolute w-64 h-80"
                            style={getItemStyle(index)}
                            animate={getItemStyle(index)}
                            transition={{
                              duration: 0.6,
                              ease: [0.25, 0.1, 0.25, 1]
                            }}
                          >
                            <Card className={`relative w-full h-full bg-gradient-to-br ${getRoleTint()} hover:border-primary/30 transition-all duration-300 overflow-hidden group shadow-lg`}>
                              {canEdit && isEditMode && (
                <DeleteButton
                  onDelete={() => deleteAchievement(achievement.id)}
                  isVisible={true}
                  className="absolute top-2 right-2 z-10"
                />
                              )}
                              
                              <div className="p-6 h-full flex flex-col">
                                {achievement.image_url ? (
                                  <div className="flex-1 mb-4">
                                    {canEdit && isEditMode ? (
                    <EditableImage
                      src={achievement.image_url}
                      alt={achievement.title}
                      onSave={(url) => updateAchievement(achievement.id, { image_url: url })}
                      className="w-full h-full object-cover rounded-lg"
                    />
                                    ) : (
                                      <img
                                        src={achievement.image_url}
                                        alt={achievement.title}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex-1 mb-4 bg-muted/50 rounded-lg flex items-center justify-center">
                                    <FileText className="h-16 w-16 text-muted-foreground" />
                                  </div>
                                )}
                                
                                <div className="space-y-2">
                                  {canEdit && isEditMode ? (
                                    <EditableText
                                      value={achievement.title}
                                      onSave={(value) => updateAchievement(achievement.id, { title: value })}
                                      className="font-semibold text-sm"
                                    />
                                  ) : (
                                    <h4 className="font-semibold text-sm line-clamp-2">
                                      {achievement.title}
                                    </h4>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Progress Indicators */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2">
                      {achievements.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'bg-primary scale-125' : 'bg-muted'
                          }`}
                          onClick={() => setCurrentIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {canEdit && isEditMode && achievements.length > 0 && (
          <div className="mt-8 text-center">
            <AddContentButton onClick={() => window.location.href = '/admin'}>
              Add Achievement
            </AddContentButton>
          </div>
        )}
      </div>
    </div>
  );
}