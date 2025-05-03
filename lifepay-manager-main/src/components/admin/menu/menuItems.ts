
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Store, 
  Users,
  Smartphone,
  CreditCard,
  Wallet2,
  Bell
} from "lucide-react";
import { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "控制台",
    path: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "运营订单",
    icon: FileText,
    children: [
      {
        title: "订单管理",
        path: "/admin/orders"
      },
      {
        title: "财务管理",
        path: "/admin/finance"
      },
      {
        title: "交易明细",
        path: "/admin/transactions"
      }
    ]
  },
  {
    title: "财务管理",
    icon: CreditCard,
    children: [
      {
        title: "支付管理",
        path: "/admin/finance/payment"
      },
      {
        title: "充值订单",
        path: "/admin/finance/recharge-orders"
      },
      {
        title: "资金明细",
        path: "/admin/balance/transactions"
      },
      {
        title: "提现管理",
        path: "/admin/balance/withdrawals"
      }
    ]
  },
  {
    title: "系统消息",
    icon: Bell,
    children: [
      {
        title: "全部消息",
        path: "/admin/messages"
      },
      {
        title: "系统通知",
        path: "/admin/notices"
      }
    ]
  },
  {
    title: "运营管理",
    icon: Settings,
    children: [
      {
        title: "系统设置",
        path: "/admin/settings"
      }
    ]
  },
  {
    title: "商家管理",
    icon: Store,
    path: "/admin/merchants"
  },
  {
    title: "管理员",
    icon: Users,
    children: [
      {
        title: "管理员列表",
        path: "/admin/admins"
      },
      {
        title: "用户管理",
        path: "/admin/users"
      }
    ]
  },
  {
    title: "商户端",
    icon: Smartphone,
    path: "/merchant"
  }
];

