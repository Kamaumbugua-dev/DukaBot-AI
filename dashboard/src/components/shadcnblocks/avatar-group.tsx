import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarGroupProps {
  children: React.ReactNode
  className?: string
  max?: number
}

export function AvatarGroup({ children, className, max }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children)
  const visible = max ? childArray.slice(0, max) : childArray

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((child, i) => (
        <div key={i} className="ring-2 ring-background rounded-full">
          {child}
        </div>
      ))}
    </div>
  )
}

interface AvatarMoreProps {
  count: number
  className?: string
}

export function AvatarMore({ count, className }: AvatarMoreProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-muted ring-2 ring-background text-xs font-medium text-muted-foreground",
        className
      )}
    >
      +{count}
    </div>
  )
}
