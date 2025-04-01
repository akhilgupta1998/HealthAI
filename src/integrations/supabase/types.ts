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
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          calories_burned: number | null
          duration_minutes: number | null
          exercise_name: string
          exercise_type: string | null
          id: string
          muscle_group: string | null
          recorded_date: string | null
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          duration_minutes?: number | null
          exercise_name: string
          exercise_type?: string | null
          id?: string
          muscle_group?: string | null
          recorded_date?: string | null
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          duration_minutes?: number | null
          exercise_name?: string
          exercise_type?: string | null
          id?: string
          muscle_group?: string | null
          recorded_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fitness_metrics: {
        Row: {
          blood_pressure: string | null
          blood_sugar: string | null
          calories_burned: number | null
          created_at: string | null
          heart_rate: number | null
          id: string
          recorded_date: string
          sleep_hours: number | null
          steps: number | null
          user_id: string
          weight: number | null
        }
        Insert: {
          blood_pressure?: string | null
          blood_sugar?: string | null
          calories_burned?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          recorded_date: string
          sleep_hours?: number | null
          steps?: number | null
          user_id: string
          weight?: number | null
        }
        Update: {
          blood_pressure?: string | null
          blood_sugar?: string | null
          calories_burned?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          recorded_date?: string
          sleep_hours?: number | null
          steps?: number | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_tracking: {
        Row: {
          completed_date: string
          created_at: string | null
          habit_id: string
          id: string
          status: boolean | null
        }
        Insert: {
          completed_date: string
          created_at?: string | null
          habit_id: string
          id?: string
          status?: boolean | null
        }
        Update: {
          completed_date?: string
          created_at?: string | null
          habit_id?: string
          id?: string
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_tracking_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string | null
          description: string | null
          frequency: string
          id: string
          name: string
          remind_time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          frequency: string
          id?: string
          name: string
          remind_time?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          frequency?: string
          id?: string
          name?: string
          remind_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          fat: number | null
          food_name: string
          id: string
          image_url: string | null
          meal_time: string | null
          meal_type: string
          portion_amount: string | null
          portion_type: string | null
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          food_name: string
          id?: string
          image_url?: string | null
          meal_time?: string | null
          meal_type: string
          portion_amount?: string | null
          portion_type?: string | null
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          food_name?: string
          id?: string
          image_url?: string | null
          meal_time?: string | null
          meal_type?: string
          portion_amount?: string | null
          portion_type?: string | null
          protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          calories_per_serving: number | null
          carbs_per_serving: number | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          fat_per_serving: number | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          instructions: string[] | null
          likes: number | null
          preparation_time: number | null
          protein_per_serving: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          fat_per_serving?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string[] | null
          likes?: number | null
          preparation_time?: number | null
          protein_per_serving?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          fat_per_serving?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string[] | null
          likes?: number | null
          preparation_time?: number | null
          protein_per_serving?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          plan_type: string
          recurring: boolean | null
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          plan_type: string
          recurring?: boolean | null
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          plan_type?: string
          recurring?: boolean | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          granted_to_user_id: string
          id: string
          permission_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          granted_to_user_id: string
          id?: string
          permission_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          granted_to_user_id?: string
          id?: string
          permission_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          avatar_url: string | null
          bio: string | null
          clerk_id: string | null
          created_at: string | null
          dietary_preferences: string[] | null
          display_name: string | null
          gender: string | null
          goal_weight: number | null
          has_completed_onboarding: boolean | null
          health_goals: string[] | null
          height: number | null
          id: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          clerk_id?: string | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          display_name?: string | null
          gender?: string | null
          goal_weight?: number | null
          has_completed_onboarding?: boolean | null
          health_goals?: string[] | null
          height?: number | null
          id: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          clerk_id?: string | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          display_name?: string | null
          gender?: string | null
          goal_weight?: number | null
          has_completed_onboarding?: boolean | null
          health_goals?: string[] | null
          height?: number | null
          id?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          referral_code: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          referral_code?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          referral_code?: string | null
        }
        Relationships: []
      }
      water_intake: {
        Row: {
          amount_ml: number
          id: string
          recorded_at: string | null
          user_id: string
        }
        Insert: {
          amount_ml: number
          id?: string
          recorded_at?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number
          id?: string
          recorded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_onboarding_completed: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
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
