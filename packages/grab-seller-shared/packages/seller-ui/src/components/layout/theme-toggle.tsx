import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "../../theme";
import { Button } from "../ui/button";
import React from "react";
import { cn } from "../../lib/utils";

export const ThemeToggle = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ className, ...props }, ref) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("relative flex items-center justify-center", className)}
      onClick={(e) => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        props.onClick?.(e);
      }}
      aria-label="Toggle theme"
      {...props}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});
ThemeToggle.displayName = "ThemeToggle";
