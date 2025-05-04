import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { 
  useSidebar, 
  SIDEBAR_WIDTH, 
  SIDEBAR_WIDTH_MOBILE, 
  SIDEBAR_WIDTH_ICON 
} from "./context"

// 侧边栏变体定义
const sidebarVariants = cva("", {
  variants: {
    variant: {
      default: "",
      sidebar: "bg-background border-r",
      floating: "bg-background border rounded-lg shadow-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// 侧边栏组件
export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, children, ...props }, ref) => {
    const { state, open, openMobile, setOpenMobile, isMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className={cn(
              "w-[18rem] p-0",
              variant === "floating" && "m-2 rounded-lg"
            )}
          >
            <div
              ref={ref}
              className={cn(
                sidebarVariants({ variant }),
                "h-full overflow-hidden",
                className
              )}
              {...props}
            >
              {children}
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          sidebarVariants({ variant }),
          "relative h-full overflow-hidden transition-all duration-300",
          state === "expanded" ? "w-[16rem]" : "w-[3rem]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Sidebar.displayName = "Sidebar"

// 侧边栏触发器
export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn("flex size-8", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
})

SidebarTrigger.displayName = "SidebarTrigger"

// 侧边栏内容
export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  )
})

SidebarContent.displayName = "SidebarContent"

// 侧边栏组
export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})

SidebarGroup.displayName = "SidebarGroup"

// 侧边栏分隔线
export const SidebarDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      className={cn("my-2", className)}
      {...props}
    />
  )
})

SidebarDivider.displayName = "SidebarDivider"

// 侧边栏菜单
export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
})

SidebarMenu.displayName = "SidebarMenu"
