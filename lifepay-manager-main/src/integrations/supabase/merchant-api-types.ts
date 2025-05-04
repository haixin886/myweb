// 定义 merchant_api_keys 表的类型
export type MerchantApiKey = {
  id: string;
  merchant_id: string;
  name: string;
  api_key: string;
  key_prefix: string;
  key_suffix: string;
  is_active: boolean;
  permissions: string[];
  created_at: string;
  last_used: string | null;
  updated_at: string;
};

// 定义 merchant_api_keys 表的插入类型
export type MerchantApiKeyInsert = {
  id?: string;
  merchant_id: string;
  name: string;
  api_key: string;
  key_prefix: string;
  key_suffix: string;
  is_active?: boolean;
  permissions?: string[];
  created_at?: string;
  last_used?: string | null;
  updated_at?: string;
};

// 定义 merchant_api_keys 表的更新类型
export type MerchantApiKeyUpdate = {
  id?: string;
  merchant_id?: string;
  name?: string;
  api_key?: string;
  key_prefix?: string;
  key_suffix?: string;
  is_active?: boolean;
  permissions?: string[];
  created_at?: string;
  last_used?: string | null;
  updated_at?: string;
};

// 定义 API 密钥类型（用于前端显示）
export type ApiKey = {
  id: string;
  name: string;
  key: string;
  is_active: boolean;
  created_at: string;
  last_used: string | null;
  permissions: string[];
};
