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
      category_data: {
        Row: {
          budget_limit: number
          created_at: string
          financial_data_id: string
          id: string
          name: string
          remaining: number
          spent: number
        }
        Insert: {
          budget_limit?: number
          created_at?: string
          financial_data_id: string
          id?: string
          name: string
          remaining?: number
          spent?: number
        }
        Update: {
          budget_limit?: number
          created_at?: string
          financial_data_id?: string
          id?: string
          name?: string
          remaining?: number
          spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_data_financial_data_id_fkey"
            columns: ["financial_data_id"]
            isOneToOne: false
            referencedRelation: "financial_data"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_data: {
        Row: {
          cash_in_hand: number
          created_at: string
          current_balance: number
          id: string
          month: string
          total_credits: number
          total_debits: number
          year: number
        }
        Insert: {
          cash_in_hand?: number
          created_at?: string
          current_balance?: number
          id?: string
          month: string
          total_credits?: number
          total_debits?: number
          year: number
        }
        Update: {
          cash_in_hand?: number
          created_at?: string
          current_balance?: number
          id?: string
          month?: string
          total_credits?: number
          total_debits?: number
          year?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          items: Json
          notes: string | null
          order_status: string
          payment_id: string | null
          payment_method: string
          payment_status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          items: Json
          notes?: string | null
          order_status?: string
          payment_id?: string | null
          payment_method: string
          payment_status?: string
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          items?: Json
          notes?: string | null
          order_status?: string
          payment_id?: string | null
          payment_method?: string
          payment_status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          is_admin: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          expense_type: string | null
          financial_data_id: string
          id: string
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description: string
          expense_type?: string | null
          financial_data_id: string
          id?: string
          transaction_date: string
          transaction_type: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          expense_type?: string | null
          financial_data_id?: string
          id?: string
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_financial_data_id_fkey"
            columns: ["financial_data_id"]
            isOneToOne: false
            referencedRelation: "financial_data"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          sheet_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          sheet_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          sheet_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_sheet_url: {
        Args: Record<PropertyKey, never>
        Returns: {
          sheet_url: string
        }[]
      }
      save_sheet_url: {
        Args: { p_id: string; p_url: string }
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
    Enums: {},
  },
} as const
