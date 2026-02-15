
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddArchiveForm } from "@/components/AddArchiveForm";
import { ArchiveList } from "@/components/ArchiveList";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Heart, Search, Plus } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: archives = [], isLoading, refetch } = useQuery({
    queryKey: ["archives", searchTerm, activeTab],
    queryFn: async () => {
      let query = supabase.from("archives").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,url.ilike.%${searchTerm}%`);
      }
      
      if (activeTab === "favorites") {
        query = query.eq("is_favorite", true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Archive className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Web Archive Keeper</h1>
          </div>
          <p className="text-xl text-gray-600">Save and organize your favorite web content</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              All Archives ({archives.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ArchiveList archives={archives} isLoading={isLoading} onUpdate={refetch} />
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <ArchiveList archives={archives} isLoading={isLoading} onUpdate={refetch} />
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Archive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddArchiveForm onSuccess={refetch} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Archive className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{archives.length}</div>
              <div className="text-sm text-gray-600">Total Archives</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{archives.filter(a => a.is_favorite).length}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{searchTerm ? archives.length : 0}</div>
              <div className="text-sm text-gray-600">Search Results</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
