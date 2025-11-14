'use client';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export type ThemeSwitcherProps = {
  className?: string;
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={cn(
        'relative h-8 w-8 rounded-full bg-background ring-1 ring-border hover:bg-secondary transition-colors',
        className
      )}
      onClick={toggleTheme}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'sun' : 'moon'}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};