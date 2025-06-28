
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, ExternalLink, Trash2, Calendar, Tag } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Archive {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  tags: string[] | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface ArchiveListProps {
  archives: Archive[];
  isLoading: boolean;
  onUpdate: () => void;
}

export const ArchiveList = ({ archives, isLoading, onUpdate }: ArchiveListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from("archives")
        .update({ is_favorite: !currentFavorite })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: currentFavorite ? "Removed from favorites" : "Added to favorites",
        description: "Archive updated successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const deleteArchive = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from("archives").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Archive deleted",
        description: "The archive has been removed successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Error deleting archive:", error);
      toast({
        title: "Error",
        description: "Failed to delete archive.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (archives.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6a2 2 0 00-2 2v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3a2 2 0 00-2-2H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No archives found</h3>
          <p className="text-gray-500">Start by adding your first web archive!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {archives.map((archive) => (
        <Card key={archive.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">
              {archive.title || "Untitled"}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {formatDate(archive.created_at)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {archive.description && (
              <p className="text-sm text-gray-600 line-clamp-3">{archive.description}</p>
            )}

            <div className="text-sm text-blue-600 truncate">
              <ExternalLink className="h-4 w-4 inline mr-1" />
              {archive.url}
            </div>

            {archive.tags && archive.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {archive.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite(archive.id, archive.is_favorite)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      archive.is_favorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={archive.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteArchive(archive.id)}
                disabled={deletingId === archive.id}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
