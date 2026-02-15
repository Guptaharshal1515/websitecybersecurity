
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface AddArchiveFormProps {
  onSuccess: () => void;
}

export const AddArchiveForm = ({ onSuccess }: AddArchiveFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const { error } = await supabase.from("archives").insert({
        url: formData.url,
        title: formData.title || null,
        description: formData.description || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Archive saved successfully.",
      });

      setFormData({ url: "", title: "", description: "", tags: "" });
      onSuccess();
    } catch (error) {
      console.error("Error saving archive:", error);
      toast({
        title: "Error",
        description: "Failed to save archive. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => handleInputChange("url", e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Article or page title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Brief description of the content"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleInputChange("tags", e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
        <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Save Archive
          </>
        )}
      </Button>
    </form>
  );
};
