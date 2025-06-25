import * as React from "react"

import { cn } from "@/lib/utils"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = "Select"

const SelectOption = React.forwardRef<
  HTMLOptionElement,
  React.ComponentProps<"option">
>(({ className, ...props }, ref) => (
  <option
    ref={ref}
    className={cn("bg-gray-800 text-white", className)}
    {...props}
  />
))
SelectOption.displayName = "SelectOption"

export { Select, SelectOption } 