import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';
// import useSound from 'use-sound';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  // const [playClick] = useSound('/sounds/click.mp3', { volume: 0.3 });

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    // playClick();
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-white/60 backdrop-blur-sm border-gray-200/30 hover:bg-white/80 hover:shadow-medium transition-all duration-300 hover:scale-105"
        >
          {theme === 'light' && <Sun className="h-4 w-4" />}
          {theme === 'dark' && <Moon className="h-4 w-4" />}
          {theme === 'system' && <Monitor className="h-4 w-4" />}
          <span className="sr-only">Змінити тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[160px] bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-medium rounded-xl"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer hover:bg-gray-100/50 transition-colors duration-200 rounded-lg"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Світла</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer hover:bg-gray-100/50 transition-colors duration-200 rounded-lg"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Темна</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className="cursor-pointer hover:bg-gray-100/50 transition-colors duration-200 rounded-lg"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Системна</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}