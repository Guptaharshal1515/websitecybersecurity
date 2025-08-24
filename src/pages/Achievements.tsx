import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, FileText, ExternalLink, Plus, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { AddContentButton } from '@/components/editor/AddContentButton';
import { DeleteButton } from '@/components/editor/DeleteButton';
import { InlineEditText } from '@/components/editor/InlineEditText';
import { InlineEditImage } from '@/components/editor/InlineEditImage';
import { OverlayEditWrapper } from '@/components/editor/OverlayEditWrapper';
import { AchievementForm } from '@/components/editor/forms/AchievementForm';

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
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | undefined>();
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

  const openEditForm = (achievement?: Achievement) => {
    setEditingAchievement(achievement);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAchievement(undefined);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % achievements.length);
    // Trigger glow animation
    const activeCard = document.querySelector('.achievement-card-active');
    if (activeCard) {
      activeCard.classList.add('glow-animation');
      setTimeout(() => {
        activeCard.classList.remove('glow-animation');
      }, 1000);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
    // Trigger glow animation
    const activeCard = document.querySelector('.achievement-card-active');
    if (activeCard) {
      activeCard.classList.add('glow-animation');
      setTimeout(() => {
        activeCard.classList.remove('glow-animation');
      }, 1000);
    }
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
    if (userRole === 'admin') return 'from-destructive/10 to-destructive/20 border-destructive/20';
    if (userRole === 'customer') return 'from-primary/10 to-primary/20 border-primary/20';
    return 'from-accent/10 to-accent/20 border-accent/20';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          .glow-animation {
            animation: glow-pulse 1s ease-in-out !important;
          }
          
          @keyframes glow-pulse {
            0% { 
              box-shadow: 0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 15px hsl(var(--primary)) !important;
            }
            50% { 
              box-shadow: 0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary)) !important;
            }
            100% { 
              box-shadow: 0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 15px hsl(var(--primary)) !important;
            }
          }
        `
      }} />
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <h1 className="text-4xl font-bold text-foreground">Achievements</h1>
            {canEdit && isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditForm()}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Certificate
              </Button>
            )}
          </div>
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
                    <InlineEditText
                      value={achievements[currentIndex]?.title || ''}
                      onSave={(value) => updateAchievement(achievements[currentIndex].id, { title: value })}
                    >
                      <h3 className="text-xl font-semibold text-foreground">
                        {achievements[currentIndex]?.title}
                      </h3>
                    </InlineEditText>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(achievements[currentIndex]?.upload_date).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievements[currentIndex]?.achievement_type}
                    </Badge>
                  </div>
                  
                  {achievements[currentIndex]?.description && (
                    <InlineEditText
                      value={achievements[currentIndex]?.description || ''}
                      onSave={(value) => updateAchievement(achievements[currentIndex].id, { description: value })}
                      multiline
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {achievements[currentIndex].description}
                      </p>
                    </InlineEditText>
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
                          <div className="flex gap-2">
                            <Button onClick={() => openEditForm()} className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Add Achievement
                            </Button>
                            <Button onClick={() => openEditForm()} variant="outline" className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Add Certificate
                            </Button>
                          </div>
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
                            className={`absolute w-80 h-96 ${index === currentIndex ? 'achievement-card-active' : ''}`}
                            style={getItemStyle(index)}
                            animate={getItemStyle(index)}
                            transition={{
                              duration: 0.6,
                              ease: [0.25, 0.1, 0.25, 1]
                            }}
                          >
                            <OverlayEditWrapper 
                              onEdit={() => openEditForm(achievement)}
                              className="w-full h-full"
                            >
                              <Card className={`relative w-full h-full bg-gradient-to-br ${getRoleTint()} hover:border-primary/40 transition-all duration-300 overflow-hidden group shadow-lg border`}>
                                <div className="p-6 h-full flex flex-col">
                                  {achievement.image_url ? (
                                    <div 
                                      className="flex-1 mb-4 cursor-pointer"
                                      onClick={() => {
                                        if (achievement.certificate_url && !isEditMode) {
                                          window.open(achievement.certificate_url, '_blank');
                                        }
                                      }}
                                    >
                                      <InlineEditImage
                                        value={achievement.image_url}
                                        onSave={(url) => updateAchievement(achievement.id, { image_url: url })}
                                        bucket="certificates"
                                        className="w-full h-full"
                                      >
                                        <img
                                          src={achievement.image_url}
                                          alt={achievement.title}
                                          className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                                        />
                                      </InlineEditImage>
                                    </div>
                                  ) : (
                                    <div 
                                      className="flex-1 mb-4 bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer"
                                      onClick={() => {
                                        if (achievement.certificate_url && !isEditMode) {
                                          window.open(achievement.certificate_url, '_blank');
                                        }
                                      }}
                                    >
                                      <FileText className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                  )}
                                
                                  <div className="space-y-2">
                                    <InlineEditText
                                      value={achievement.title}
                                      onSave={(value) => updateAchievement(achievement.id, { title: value })}
                                    >
                                      <h4 className="font-semibold text-sm line-clamp-2">
                                        {achievement.title}
                                      </h4>
                                    </InlineEditText>
                                  </div>
                                </div>
                              </Card>
                            </OverlayEditWrapper>
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
            <Button onClick={() => openEditForm()} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Another Achievement
            </Button>
          </div>
        )}

        {/* Achievement Form Modal */}
        <AchievementForm
          isOpen={showForm}
          onClose={closeForm}
          achievement={editingAchievement}
          onSave={fetchAchievements}
        />
      </div>
    </div>
  );
}