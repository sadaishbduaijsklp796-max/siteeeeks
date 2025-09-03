import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105 w-10 h-10 p-0"
        >
          {theme === 'light' && <Sun className="h-4 w-4 text-amber-500 transition-transform duration-300 hover:rotate-12" />}
          {theme === 'dark' && <Moon className="h-4 w-4 text-blue-400 transition-transform duration-300 hover:rotate-12" />}
          {theme === 'system' && <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 hover:scale-110" />}
          <span className="sr-only">Змінити тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[160px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-600/50 shadow-xl rounded-2xl animate-in slide-in-from-top-2 duration-300"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 rounded-xl group"
        >
          <Sun className="mr-3 h-4 w-4 text-amber-500 transition-transform duration-200 group-hover:rotate-12" />
          <span>Світла</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-xl group"
        >
          <Moon className="mr-3 h-4 w-4 text-blue-400 transition-transform duration-200 group-hover:rotate-12" />
          <span>Темна</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 rounded-xl group"
        >
          <Monitor className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 group-hover:scale-110" />
          <span>Системна</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}