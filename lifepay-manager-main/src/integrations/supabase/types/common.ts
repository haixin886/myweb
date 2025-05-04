// 基础类型定义
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// 导出数据库类型的基础结构
export type Database = {
  public: {
    Tables: {
      [key: string]: any
    }
    Enums: {
      [key: string]: any
    }
    CompositeTypes: {
      [key: string]: any
    }
  }
}

// 常量
export const Constants = {
  public: {
    Enums: {},
  },
}
