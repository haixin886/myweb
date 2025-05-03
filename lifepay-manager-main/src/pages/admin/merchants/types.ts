
export interface Merchant {
  id: string;
  user_id: string;
  email?: string | null;
  avatar_url?: string | null;
  nickname: string | null;
  phone: string | null;
  level?: string | null;
  account_balance: number;
  freeze_balance: number;
  team_count?: number;
  status: boolean;
  ip?: string | null;
  created_at: string;
  updated_at?: string | null;
  commission?: any;
  
  // 前端显示用的字段，可以从数据库字段映射
  balance?: number;
  frozen_balance?: number;
  ip_address?: string | null;
  last_sign_in_at?: string | null;
}

export interface SearchParams {
  nickname?: string;
  phone?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
