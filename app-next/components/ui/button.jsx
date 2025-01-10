import { cn } from "@/lib/utils";

export const Button = ({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        {
          "bg-blue-500 text-white hover:bg-blue-600": variant === "default",
          "text-gray-300 hover:text-blue-400": variant === "ghost",
        },
        {
          "h-10 py-2 px-4": size === "default",
          "h-11 px-8": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}