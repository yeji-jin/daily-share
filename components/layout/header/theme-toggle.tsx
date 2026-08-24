"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CheckIcon, Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Theme, THEMES } from "@/types/theme";

export function ThemeToggle() {
  const { theme: currentTheme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const onChangeTheme = (theme: Theme) => {
    setTheme(theme);
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled />;
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            {currentTheme === "blue" ? (
              <Palette className="size-5" />
            ) : resolvedTheme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-35 p-0">
          {THEMES.map((theme) => (
            <PopoverClose
              key={`theme-button-${theme}`}
              onClick={() => onChangeTheme(theme)}
              className="hover:bg-muted flex w-full cursor-pointer items-center justify-between p-3 text-left font-medium"
            >
              {theme}
              {theme === currentTheme && <CheckIcon className="size-4" />}
            </PopoverClose>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
