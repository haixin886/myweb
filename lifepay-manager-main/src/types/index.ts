
// User profile type definition
export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  full_name: string;
  avatar_url: string;
  balance: number;
  invite_code: string;
  online_status: boolean;
  created_at: string;
  updated_at: string;
}

// System setting type definition
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}
