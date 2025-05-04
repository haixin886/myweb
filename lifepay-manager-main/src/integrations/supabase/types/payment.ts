import { Json } from './common';

// 支付相关表格的类型定义
export interface PaymentTables {
  payment_channels: {
    Row: {
      created_at: string
      id: string
      is_active: boolean
      name: string
      payment_method: string
      settings: Json
      updated_at: string | null
    }
    Insert: {
      created_at?: string
      id?: string
      is_active?: boolean
      name: string
      payment_method: string
      settings: Json
      updated_at?: string | null
    }
    Update: {
      created_at?: string
      id?: string
      is_active?: boolean
      name?: string
      payment_method?: string
      settings?: Json
      updated_at?: string | null
    }
    Relationships: []
  }
  payment_addresses: {
    Row: {
      address: string
      channel_id: string
      created_at: string
      id: string
      is_active: boolean
      last_used_at: string | null
      metadata: Json | null
      updated_at: string | null
    }
    Insert: {
      address: string
      channel_id: string
      created_at?: string
      id?: string
      is_active?: boolean
      last_used_at?: string | null
      metadata?: Json | null
      updated_at?: string | null
    }
    Update: {
      address?: string
      channel_id?: string
      created_at?: string
      id?: string
      is_active?: boolean
      last_used_at?: string | null
      metadata?: Json | null
      updated_at?: string | null
    }
    Relationships: [
      {
        foreignKeyName: "payment_addresses_channel_id_fkey"
        columns: ["channel_id"]
        isOneToOne: false
        referencedRelation: "payment_channels"
        referencedColumns: ["id"]
      }
    ]
  }
}
