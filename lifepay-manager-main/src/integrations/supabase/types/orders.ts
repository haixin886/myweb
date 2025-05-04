import { Json } from './common';

// 订单相关表格的类型定义
export interface OrderTables {
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
        referencedRelation: "orders"
        referencedColumns: ["id"]
      }
    ]
  }
  orders: {
    Row: {
      amount: number
      channel_id: string | null
      created_at: string
      customer_id: string | null
      id: string
      merchant_id: string | null
      order_number: string
      payment_method: string | null
      status: string
      updated_at: string | null
    }
    Insert: {
      amount: number
      channel_id?: string | null
      created_at?: string
      customer_id?: string | null
      id?: string
      merchant_id?: string | null
      order_number: string
      payment_method?: string | null
      status?: string
      updated_at?: string | null
    }
    Update: {
      amount?: number
      channel_id?: string | null
      created_at?: string
      customer_id?: string | null
      id?: string
      merchant_id?: string | null
      order_number?: string
      payment_method?: string | null
      status?: string
      updated_at?: string | null
    }
    Relationships: [
      {
        foreignKeyName: "orders_channel_id_fkey"
        columns: ["channel_id"]
        isOneToOne: false
        referencedRelation: "payment_channels"
        referencedColumns: ["id"]
      },
      {
        foreignKeyName: "orders_customer_id_fkey"
        columns: ["customer_id"]
        isOneToOne: false
        referencedRelation: "customers"
        referencedColumns: ["id"]
      },
      {
        foreignKeyName: "orders_merchant_id_fkey"
        columns: ["merchant_id"]
        isOneToOne: false
        referencedRelation: "merchants"
        referencedColumns: ["id"]
      }
    ]
  }
}
