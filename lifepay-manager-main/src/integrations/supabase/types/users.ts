import { Json } from './common';

// 用户相关表格的类型定义
export interface UserTables {
  customers: {
    Row: {
      created_at: string
      email: string | null
      id: string
      name: string | null
      phone: string | null
      updated_at: string | null
      user_id: string | null
    }
    Insert: {
      created_at?: string
      email?: string | null
      id?: string
      name?: string | null
      phone?: string | null
      updated_at?: string | null
      user_id?: string | null
    }
    Update: {
      created_at?: string
      email?: string | null
      id?: string
      name?: string | null
      phone?: string | null
      updated_at?: string | null
      user_id?: string | null
    }
    Relationships: [
      {
        foreignKeyName: "customers_user_id_fkey"
        columns: ["user_id"]
        isOneToOne: false
        referencedRelation: "users"
        referencedColumns: ["id"]
      }
    ]
  }
  merchants: {
    Row: {
      created_at: string
      id: string
      name: string
      settings: Json | null
      updated_at: string | null
      user_id: string
    }
    Insert: {
      created_at?: string
      id?: string
      name: string
      settings?: Json | null
      updated_at?: string | null
      user_id: string
    }
    Update: {
      created_at?: string
      id?: string
      name?: string
      settings?: Json | null
      updated_at?: string | null
      user_id?: string
    }
    Relationships: [
      {
        foreignKeyName: "merchants_user_id_fkey"
        columns: ["user_id"]
        isOneToOne: false
        referencedRelation: "users"
        referencedColumns: ["id"]
      }
    ]
  }
  profiles: {
    Row: {
      avatar_url: string | null
      created_at: string
      id: string
      updated_at: string | null
      user_id: string
    }
    Insert: {
      avatar_url?: string | null
      created_at?: string
      id?: string
      updated_at?: string | null
      user_id: string
    }
    Update: {
      avatar_url?: string | null
      created_at?: string
      id?: string
      updated_at?: string | null
      user_id?: string
    }
    Relationships: [
      {
        foreignKeyName: "profiles_user_id_fkey"
        columns: ["user_id"]
        isOneToOne: true
        referencedRelation: "users"
        referencedColumns: ["id"]
      }
    ]
  }
}
