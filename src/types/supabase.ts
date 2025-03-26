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
      alerts: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          message: string
          severity: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id: string
          is_active?: boolean | null
          message: string
          severity: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          message?: string
          severity?: string
          title?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          province: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string | null
          end_time: string
          event_date: string
          id: string
          location: string
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          end_time: string
          event_date: string
          id?: string
          location: string
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string
          event_date?: string
          id?: string
          location?: string
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          classification: string
          contact_email: string | null
          created_at: string
          id: string
          logo: string | null
          mediator_access_url: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          classification: string
          contact_email?: string | null
          created_at?: string
          id?: string
          logo?: string | null
          mediator_access_url?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          classification?: string
          contact_email?: string | null
          created_at?: string
          id?: string
          logo?: string | null
          mediator_access_url?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_specifications: {
        Row: {
          category: string
          company_id: string
          content: string
          created_at: string
          id: string
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          category: string
          company_id: string
          content: string
          created_at?: string
          id?: string
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_specifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          debilidades: string | null
          excerpt: string | null
          id: string
          observaciones: string | null
          procesos: string | null
          published_at: string | null
          status: string
          subcategory: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          debilidades?: string | null
          excerpt?: string | null
          id?: string
          observaciones?: string | null
          procesos?: string | null
          published_at?: string | null
          status?: string
          subcategory?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          debilidades?: string | null
          excerpt?: string | null
          id?: string
          observaciones?: string | null
          procesos?: string | null
          published_at?: string | null
          status?: string
          subcategory?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      content_subcategories: {
        Row: {
          created_at: string
          id: string
          level: number | null
          name: string
          parent_category: string
          parent_subcategory: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number | null
          name: string
          parent_category: string
          parent_subcategory?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: number | null
          name?: string
          parent_category?: string
          parent_subcategory?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_subcategories_parent_subcategory_fkey"
            columns: ["parent_subcategory"]
            isOneToOne: false
            referencedRelation: "content_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tags: {
        Row: {
          content_id: string
          id: string
          tag: string
        }
        Insert: {
          content_id: string
          id?: string
          tag: string
        }
        Update: {
          content_id?: string
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tags: {
        Row: {
          document_id: string
          id: string
          tag: string
        }
        Insert: {
          document_id: string
          id?: string
          tag: string
        }
        Update: {
          document_id?: string
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          company_id: string | null
          content_id: string | null
          description: string | null
          file_path: string
          file_size: string
          file_type: string
          id: string
          subcategory: string | null
          title: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string
          version: string
        }
        Insert: {
          category: string
          company_id?: string | null
          content_id?: string | null
          description?: string | null
          file_path: string
          file_size: string
          file_type: string
          id?: string
          subcategory?: string | null
          title: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
          version: string
        }
        Update: {
          category?: string
          company_id?: string | null
          content_id?: string | null
          description?: string | null
          file_path?: string
          file_size?: string
          file_type?: string
          id?: string
          subcategory?: string | null
          title?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string
          category: string
          created_at: string
          id: string
          is_locked: boolean
          is_sticky: boolean
          last_activity: string
          title: string
          views: number
        }
        Insert: {
          author_id: string
          category: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_sticky?: boolean
          last_activity?: string
          title: string
          views?: number
        }
        Update: {
          author_id?: string
          category?: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_sticky?: boolean
          last_activity?: string
          title?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string
          category: string
          company_id: string | null
          content: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_pinned: boolean
          published_at: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          company_id?: string | null
          content: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          published_at?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          company_id?: string | null
          content?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          published_at?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      news_tags: {
        Row: {
          id: string
          news_id: string
          tag: string
        }
        Insert: {
          id?: string
          news_id: string
          tag: string
        }
        Update: {
          id?: string
          news_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_tags_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_visibility: {
        Row: {
          branch: string
          id: string
          news_id: string
          user_type: string
        }
        Insert: {
          branch: string
          id?: string
          news_id: string
          user_type: string
        }
        Update: {
          branch?: string
          id?: string
          news_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_visibility_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          id: string
          module: string
          role: string
          updated_at: string | null
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module: string
          role: string
          updated_at?: string | null
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      specification_subcategories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_category: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          parent_category: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_category?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: string
          id: string
          image_url: string | null
          is_required: boolean
          level: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration: string
          id?: string
          image_url?: string | null
          is_required?: boolean
          level: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string
          id?: string
          image_url?: string | null
          is_required?: boolean
          level?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          completed_at: string | null
          completion_rate: number
          course_id: string
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_rate?: number
          course_id: string
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_rate?: number
          course_id?: string
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_type_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          id: string
          module: string
          updated_at: string | null
          user_type: string
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module: string
          updated_at?: string | null
          user_type: string
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module?: string
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          branch: string | null
          created_at: string
          description: string | null
          email: string | null
          extension: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          role: string
          telegram_username: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          extension?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          role?: string
          telegram_username?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          extension?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          role?: string
          telegram_username?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
