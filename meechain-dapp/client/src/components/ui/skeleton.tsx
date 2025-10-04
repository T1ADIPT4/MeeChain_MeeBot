import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-700/50 dark:bg-slate-700/30", className)}
      {...props}
    />
  )
}

export { Skeleton }
