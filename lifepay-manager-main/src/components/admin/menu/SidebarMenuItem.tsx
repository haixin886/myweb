
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { MenuItemWithSubMenu } from "@/pages/admin/menu/types";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  item: MenuItemWithSubMenu;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarMenuItem = ({ item, isOpen, onToggle }: SidebarMenuItemProps) => {
  return (
    <div>
      {item.submenu ? (
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center px-3 py-2.5 text-sm hover:bg-gray-100 rounded-md transition-colors",
            isOpen && "bg-gray-100 font-medium"
          )}
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4 text-gray-600" />}
          <span>{item.title}</span>
          <ChevronDown
            className={cn("ml-auto h-4 w-4 text-gray-500 transition-transform", 
              isOpen && "rotate-180"
            )}
          />
        </button>
      ) : (
        <Link
          to={item.href || "#"}
          className="flex items-center px-3 py-2.5 text-sm hover:bg-gray-100 rounded-md transition-colors"
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4 text-gray-600" />}
          <span>{item.title}</span>
        </Link>
      )}
      
      {item.submenu && isOpen && item.subMenuItems && (
        <div className="pl-4 mt-1">
          {item.subMenuItems.map((child) => (
            <Link
              key={child.title}
              to={child.href || "#"}
              className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors text-gray-600"
            >
              <span>{child.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

