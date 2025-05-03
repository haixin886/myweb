
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  path?: string;
  icon: LucideIcon;
  children?: MenuItemChild[];
}

export interface MenuItemChild {
  title: string;
  path: string;
}

// 子菜单项定义
export interface SubMenuItem {
  title: string;
  href: string;
  description?: string;
}

// 菜单项定义
export interface MenuItemWithSubMenu {
  title: string;
  icon: LucideIcon;
  href?: string;
  submenu?: boolean;
  subMenuItems?: SubMenuItem[];
}
