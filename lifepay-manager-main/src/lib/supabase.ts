
import { createClient } from '@supabase/supabase-js'

// 使用环境变量或通过安全的方式获取这些值
const supabaseUrl = 'https://atxcgfhhpgyomicyipyh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eGNnZmhocGd5b21pY3lpcHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NDIzNzEsImV4cCI6MjA1NTMxODM3MX0.jZgAuHoKvzOwp8kIW1bQZFOumbNM96UT2O7CMa6k-xY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
