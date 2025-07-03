export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      archives: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          about_bio: string | null
          contact_email: string | null
          created_at: string | null
          github_url: string | null
          id: string
          introduction: string | null
          linkedin_url: string | null
          profile_image_url: string | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          about_bio?: string | null
          contact_email?: string | null
          created_at?: string | null
          github_url?: string | null
          id?: string
          introduction?: string | null
          linkedin_url?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          about_bio?: string | null
          contact_email?: string | null
          created_at?: string | null
          github_url?: string | null
          id?: string
          introduction?: string | null
          linkedin_url?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      journey_entries: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          entry_date: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          entry_date: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          entry_date?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page_layouts: {
        Row: {
          id: string
          layout_type: string | null
          page_name: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          layout_type?: string | null
          page_name: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          layout_type?: string | null
          page_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          github_url: string | null
          id: string
          image_url: string | null
          project_url: string | null
          technologies: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      roadmap_subtopics: {
        Row: {
          completed_by: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_completed: boolean | null
          resource_link: string | null
          title: string
          topic_id: string | null
        }
        Insert: {
          completed_by?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_completed?: boolean | null
          resource_link?: string | null
          title: string
          topic_id?: string | null
        }
        Update: {
          completed_by?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_completed?: boolean | null
          resource_link?: string | null
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_subtopics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "roadmap_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_topics: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          roadmap_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          roadmap_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          roadmap_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_topics_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tracker_entries: {
        Row: {
          completed_by: string | null
          completion_date: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          proof_link: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          completed_by?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          proof_link?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          completed_by?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          proof_link?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "viewer" | "customer" | "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["viewer", "customer", "admin", "editor"],
    },
  },
} as const
