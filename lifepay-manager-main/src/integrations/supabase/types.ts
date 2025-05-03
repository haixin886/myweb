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
      admin_profiles: {
        Row: {
          created_at: string
          id: string
          is_super_admin: boolean | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_super_admin?: boolean | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_super_admin?: boolean | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      channel_order_status_history: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          new_status: string
          note: string | null
          old_status: string | null
          order_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          new_status: string
          note?: string | null
          old_status?: string | null
          order_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          new_status?: string
          note?: string | null
          old_status?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "channel_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_orders: {
        Row: {
          amount: number
          channel_id: string
          created_at: string | null
          id: string
          note: string | null
          order_no: string
          status: string
          type: string | null
          updated_at: string | null
          usdt_amount: number
          user_id: string
        }
        Insert: {
          amount: number
          channel_id: string
          created_at?: string | null
          id?: string
          note?: string | null
          order_no: string
          status?: string
          type?: string | null
          updated_at?: string | null
          usdt_amount: number
          user_id: string
        }
        Update: {
          amount?: number
          channel_id?: string
          created_at?: string | null
          id?: string
          note?: string | null
          order_no?: string
          status?: string
          type?: string | null
          updated_at?: string | null
          usdt_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_orders_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "payment_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_service_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean
          sent_by_user: boolean
          telegram_message_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          sent_by_user?: boolean
          telegram_message_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          sent_by_user?: boolean
          telegram_message_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      customer_service_notices: {
        Row: {
          content: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      merchant_applications: {
        Row: {
          business_license: string
          company_name: string
          contact_name: string
          created_at: string
          id: string
          id_card_back: string
          id_card_front: string
          notes: string | null
          phone: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_license: string
          company_name: string
          contact_name: string
          created_at?: string
          id?: string
          id_card_back: string
          id_card_front: string
          notes?: string | null
          phone: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_license?: string
          company_name?: string
          contact_name?: string
          created_at?: string
          id?: string
          id_card_back?: string
          id_card_front?: string
          notes?: string | null
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      merchant_balance_history: {
        Row: {
          amount: number
          balance: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          merchant_id: string
          transaction_id: string | null
          type: string
        }
        Insert: {
          amount: number
          balance: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          merchant_id: string
          transaction_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          balance?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          merchant_id?: string
          transaction_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchant_balance_history_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_balance_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "user_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_profiles: {
        Row: {
          account_balance: number | null
          commission: Json | null
          created_at: string
          freeze_balance: number | null
          id: string
          ip: string | null
          nickname: string | null
          phone: string | null
          status: boolean | null
          team_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_balance?: number | null
          commission?: Json | null
          created_at?: string
          freeze_balance?: number | null
          id?: string
          ip?: string | null
          nickname?: string | null
          phone?: string | null
          status?: boolean | null
          team_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_balance?: number | null
          commission?: Json | null
          created_at?: string
          freeze_balance?: number | null
          id?: string
          ip?: string | null
          nickname?: string | null
          phone?: string | null
          status?: boolean | null
          team_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      merchant_settings: {
        Row: {
          commission_rates: Json | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rates?: Json | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rates?: Json | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      new_orders: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          merchant_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "new_orders_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          id: string
          name: string | null
          phone_number: string | null
          status: string | null
          type: string
          updated_at: string
          usdt_amount: number
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          name?: string | null
          phone_number?: string | null
          status?: string | null
          type: string
          updated_at?: string
          usdt_amount: number
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          name?: string | null
          phone_number?: string | null
          status?: string | null
          type?: string
          updated_at?: string
          usdt_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      payment_channels: {
        Row: {
          code: string
          created_at: string | null
          exchange_rate: number
          fee_rate: number
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          exchange_rate?: number
          fee_rate?: number
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          exchange_rate?: number
          fee_rate?: number
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_payment_addresses: {
        Row: {
          address: string
          created_at: string
          id: string
          is_active: boolean | null
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          type: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      recharge_order_submissions: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          attachments: string[] | null
          bank_branch: string | null
          bank_name: string | null
          contact_email: string | null
          contact_phone: string
          created_at: string | null
          id: string
          order_id: string
          purpose: string | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: string
          attachments?: string[] | null
          bank_branch?: string | null
          bank_name?: string | null
          contact_email?: string | null
          contact_phone: string
          created_at?: string | null
          id?: string
          order_id: string
          purpose?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          attachments?: string[] | null
          bank_branch?: string | null
          bank_name?: string | null
          contact_email?: string | null
          contact_phone?: string
          created_at?: string | null
          id?: string
          order_id?: string
          purpose?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recharge_order_submissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "recharge_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      recharge_orders: {
        Row: {
          actual_amount: number
          created_at: string | null
          id: string
          order_number: string
          payment_channel: string
          payment_method: string
          phone_number: string
          recharge_amount: number
          remark: string | null
          status: string
          target_account: string
          updated_at: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          actual_amount: number
          created_at?: string | null
          id?: string
          order_number: string
          payment_channel: string
          payment_method: string
          phone_number: string
          recharge_amount: number
          remark?: string | null
          status?: string
          target_account: string
          updated_at?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          actual_amount?: number
          created_at?: string | null
          id?: string
          order_number?: string
          payment_channel?: string
          payment_method?: string
          phone_number?: string
          recharge_amount?: number
          remark?: string | null
          status?: string
          target_account?: string
          updated_at?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "recharge_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          form_type: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          form_type: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          form_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      stats_business: {
        Row: {
          balance_recharge_amount: number
          balance_recharge_orders: number
          balance_withdrawal_orders: number
          created_at: string
          date: string
          electricity_payment_amount: number
          electricity_recharge_amount: number
          electricity_recharge_orders: number
          id: string
          merchant_adjustment: number
          merchant_commission: number
          merchant_settlement: number
          oil_card_payment_amount: number
          oil_card_recharge_amount: number
          oil_card_recharge_orders: number
          online_payment_amount: number
          online_recharge_amount: number
          online_recharge_orders: number
          phone_payment_amount: number
          phone_recharge_amount: number
          phone_recharge_orders: number
          platform_operation_decrease: number
          platform_operation_increase: number
          updated_at: string
          withdrawal_amount: number
        }
        Insert: {
          balance_recharge_amount?: number
          balance_recharge_orders?: number
          balance_withdrawal_orders?: number
          created_at?: string
          date?: string
          electricity_payment_amount?: number
          electricity_recharge_amount?: number
          electricity_recharge_orders?: number
          id?: string
          merchant_adjustment?: number
          merchant_commission?: number
          merchant_settlement?: number
          oil_card_payment_amount?: number
          oil_card_recharge_amount?: number
          oil_card_recharge_orders?: number
          online_payment_amount?: number
          online_recharge_amount?: number
          online_recharge_orders?: number
          phone_payment_amount?: number
          phone_recharge_amount?: number
          phone_recharge_orders?: number
          platform_operation_decrease?: number
          platform_operation_increase?: number
          updated_at?: string
          withdrawal_amount?: number
        }
        Update: {
          balance_recharge_amount?: number
          balance_recharge_orders?: number
          balance_withdrawal_orders?: number
          created_at?: string
          date?: string
          electricity_payment_amount?: number
          electricity_recharge_amount?: number
          electricity_recharge_orders?: number
          id?: string
          merchant_adjustment?: number
          merchant_commission?: number
          merchant_settlement?: number
          oil_card_payment_amount?: number
          oil_card_recharge_amount?: number
          oil_card_recharge_orders?: number
          online_payment_amount?: number
          online_recharge_amount?: number
          online_recharge_orders?: number
          phone_payment_amount?: number
          phone_recharge_amount?: number
          phone_recharge_orders?: number
          platform_operation_decrease?: number
          platform_operation_increase?: number
          updated_at?: string
          withdrawal_amount?: number
        }
        Relationships: []
      }
      stats_financial: {
        Row: {
          created_at: string
          date: string
          id: string
          pending_distribution_amount: number
          recharging_amount: number
          updated_at: string
          user_balance: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          pending_distribution_amount?: number
          recharging_amount?: number
          updated_at?: string
          user_balance?: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          pending_distribution_amount?: number
          recharging_amount?: number
          updated_at?: string
          user_balance?: number
        }
        Relationships: []
      }
      stats_pending_items: {
        Row: {
          balance_recharge_pending: number
          balance_withdrawal_pending: number
          created_at: string
          date: string
          electricity_orders_pending: number
          id: string
          merchant_address_pending: number
          merchant_withdrawal_pending: number
          oil_card_orders_pending: number
          online_orders_pending: number
          phone_orders_pending: number
          updated_at: string
        }
        Insert: {
          balance_recharge_pending?: number
          balance_withdrawal_pending?: number
          created_at?: string
          date?: string
          electricity_orders_pending?: number
          id?: string
          merchant_address_pending?: number
          merchant_withdrawal_pending?: number
          oil_card_orders_pending?: number
          online_orders_pending?: number
          phone_orders_pending?: number
          updated_at?: string
        }
        Update: {
          balance_recharge_pending?: number
          balance_withdrawal_pending?: number
          created_at?: string
          date?: string
          electricity_orders_pending?: number
          id?: string
          merchant_address_pending?: number
          merchant_withdrawal_pending?: number
          oil_card_orders_pending?: number
          online_orders_pending?: number
          phone_orders_pending?: number
          updated_at?: string
        }
        Relationships: []
      }
      stats_user: {
        Row: {
          created_at: string
          date: string
          id: string
          new_merchants_today: number
          new_merchants_yesterday: number
          new_users_today: number
          new_users_yesterday: number
          total_merchants: number
          total_users: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          new_merchants_today?: number
          new_merchants_yesterday?: number
          new_users_today?: number
          new_users_yesterday?: number
          total_merchants?: number
          total_users?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          new_merchants_today?: number
          new_merchants_yesterday?: number
          new_users_today?: number
          new_users_yesterday?: number
          total_merchants?: number
          total_users?: number
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      user_payments: {
        Row: {
          account_name: string
          account_number: string
          bank_branch: string | null
          bank_name: string | null
          created_at: string
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          qr_code_url: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_branch?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          qr_code_url?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_branch?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          qr_code_url?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          balance: number | null
          created_at: string
          full_name: string | null
          id: string
          invite_code: string
          online_status: boolean | null
          phone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number | null
          created_at?: string
          full_name?: string | null
          id: string
          invite_code: string
          online_status?: boolean | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          invite_code?: string
          online_status?: boolean | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          amount: number
          balance: number
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          status: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          balance: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          balance?: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_access: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      check_invite_code: {
        Args: { p_invite_code: string }
        Returns: boolean
      }
      check_merchant_application: {
        Args: { p_phone: string }
        Returns: {
          id: string
          status: string
          created_at: string
        }[]
      }
      create_merchant_application: {
        Args: {
          p_phone: string
          p_company_name: string
          p_contact_name: string
          p_business_license: string
          p_id_card_front: string
          p_id_card_back: string
        }
        Returns: string
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_authenticated_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_merchant_balance: {
        Args: {
          p_merchant_id: string
          p_amount: number
          p_type: string
          p_description?: string
        }
        Returns: undefined
      }
      update_merchant_settings: {
        Args: { p_merchant_id: string; p_commission_rates: Json }
        Returns: undefined
      }
      update_online_status: {
        Args: { p_online: boolean }
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
