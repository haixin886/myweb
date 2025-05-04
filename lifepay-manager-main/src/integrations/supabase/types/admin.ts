import { Json } from './common';

// 管理员相关表格的类型定义
export interface AdminTables {
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
}
