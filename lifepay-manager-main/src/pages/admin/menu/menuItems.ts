
import {
  Home,
  Settings,
  CreditCard,
  ShoppingCart,
  Users,
  Building2,
  Award,
  Gauge,
  PieChart,
  Cable,
  Lock
} from "lucide-react";

import { MenuItemWithSubMenu } from "./types";

export const menuItems: MenuItemWithSubMenu[] = [
  {
    title: "仪表盘",
    href: "/admin/dashboard",
    icon: Home,
    submenu: false
  },
  {
    title: "订单管理",
    icon: ShoppingCart,
    submenu: true,
    subMenuItems: [
      {
        title: "订单处理中心",
        href: "/admin/order-processing",
        description: "智能分配和批量处理订单"
      },
      {
        title: "在线业务订单",
        href: "/admin/online-orders",
        description: "信用卡代还、花呗代还等"
      },
      {
        title: "缴费业务订单",
        href: "/admin/business-orders",
        description: "话费、电费、油卡充值等"
      }
    ]
  },
  {
    title: "用户管理",
    icon: Users,
    submenu: true,
    subMenuItems: [
      {
        title: "用户列表",
        href: "/admin/merchants",
        description: "查看和管理平台用户"
      },
      {
        title: "风控系统",
        href: "/admin/merchant-risk",
        description: "用户评分和风险控制"
      }
    ]
  },
  {
    title: "代理管理",
    icon: Users,
    submenu: true,
    subMenuItems: [
      {
        title: "代理列表",
        href: "/admin/agents",
        description: "管理平台代理商"
      },
      {
        title: "分润与结算",
        href: "/admin/agent-settlement",
        description: "代理分润规则和结算"
      }
    ]
  },
  {
    title: "财务管理",
    icon: CreditCard,
    submenu: true,
    subMenuItems: [
      {
        title: "支付管理",
        href: "/admin/finance/payment",
        description: "统一管理支付设置、地址和通道"
      },
      {
        title: "充值订单",
        href: "/admin/finance/recharge-orders",
        description: "管理用户钱包充值订单"
      },
      {
        title: "资金明细",
        href: "/admin/finance/transactions",
        description: "查看平台资金流水"
      }
    ]
  },
  {
    title: "数据中心",
    icon: PieChart,
    submenu: true,
    subMenuItems: [
      {
        title: "数据看板",
        href: "/admin/data-dashboard",
        description: "业绩分析和实时监控"
      },
      {
        title: "报表中心",
        href: "/admin/reports",
        description: "业务报表和对账单"
      }
    ]
  },
  {
    title: "开发者",
    icon: Cable,
    submenu: true,
    subMenuItems: [
      {
        title: "API管理",
        href: "/admin/api-management",
        description: "管理API密钥和接口权限"
      },
      {
        title: "Webhook设置",
        href: "/admin/webhooks",
        description: "配置事件通知和回调"
      }
    ]
  },
  {
    title: "安全中心",
    icon: Lock,
    submenu: true,
    subMenuItems: [
      {
        title: "操作日志",
        href: "/admin/operation-logs",
        description: "查看系统操作记录"
      },
      {
        title: "权限管理",
        href: "/admin/permissions",
        description: "管理用户角色和权限"
      }
    ]
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
    submenu: false
  }
];
