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
          className="rounded-full bg-background/60 backdrop-blur-sm border-border/50 hover:bg-background/80 hover:shadow-glow transition-all duration-300 hover:scale-105"
        >
          {theme === 'light' && <Sun className="h-4 w-4" />}
          {theme === 'dark' && <Moon className="h-4 w-4" />}
          {theme === 'system' && <Monitor className="h-4 w-4" />}
          <span className="sr-only">Змінити тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[160px] bg-background/95 backdrop-blur-sm border-border/50 shadow-medium"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer hover:bg-accent/50 transition-colors duration-200"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Світла</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer hover:bg-accent/50 transition-colors duration-200"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Темна</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className="cursor-pointer hover:bg-accent/50 transition-colors duration-200"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Системна</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}