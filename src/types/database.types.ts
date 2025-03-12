export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_type: string;
          category: string;
          file_size: string;
          version: string;
          file_path: string;
          uploaded_by: string;
          uploaded_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          file_type: string;
          category: string;
          file_size: string;
          version: string;
          file_path: string;
          uploaded_by: string;
          uploaded_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          file_type?: string;
          category?: string;
          file_size?: string;
          version?: string;
          file_path?: string;
          uploaded_by?: string;
          uploaded_at?: string;
          updated_at?: string;
        };
      };
      document_tags: {
        Row: {
          id: string;
          document_id: string;
          tag: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          tag: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          tag?: string;
        };
      };
      content: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string | null;
          category: string;
          status: string;
          author_id: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt?: string | null;
          category: string;
          status?: string;
          author_id: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string | null;
          category?: string;
          status?: string;
          author_id?: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_tags: {
        Row: {
          id: string;
          content_id: string;
          tag: string;
        };
        Insert: {
          id?: string;
          content_id: string;
          tag: string;
        };
        Update: {
          id?: string;
          content_id?: string;
          tag?: string;
        };
      };
      forum_threads: {
        Row: {
          id: string;
          title: string;
          category: string;
          author_id: string;
          created_at: string;
          last_activity: string;
          views: number;
          is_sticky: boolean;
          is_locked: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          author_id: string;
          created_at?: string;
          last_activity?: string;
          views?: number;
          is_sticky?: boolean;
          is_locked?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          author_id?: string;
          created_at?: string;
          last_activity?: string;
          views?: number;
          is_sticky?: boolean;
          is_locked?: boolean;
        };
      };
      forum_replies: {
        Row: {
          id: string;
          thread_id: string;
          content: string;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          content: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          content?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string | null;
          category: string;
          author_id: string;
          published_at: string;
          is_pinned: boolean;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt?: string | null;
          category: string;
          author_id: string;
          published_at?: string;
          is_pinned?: boolean;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string | null;
          category?: string;
          author_id?: string;
          published_at?: string;
          is_pinned?: boolean;
          image_url?: string | null;
        };
      };
      training_courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          duration: string;
          level: string;
          image_url: string | null;
          is_required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: string;
          duration: string;
          level: string;
          image_url?: string | null;
          is_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          duration?: string;
          level?: string;
          image_url?: string | null;
          is_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_courses: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          completion_rate: number;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          completion_rate?: number;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          completion_rate?: number;
          started_at?: string;
          completed_at?: string | null;
        };
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          start_time: string;
          end_time: string;
          location: string;
          category: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_date: string;
          start_time: string;
          end_time: string;
          location: string;
          category: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          start_time?: string;
          end_time?: string;
          location?: string;
          category?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_attendees: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
