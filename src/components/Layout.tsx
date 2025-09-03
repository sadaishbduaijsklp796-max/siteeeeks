import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useUserRole } from '@/hooks/use-user-role';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  Users, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Scale, 
  Building2, 
  Settings,
  LogOut,
  LogIn,
  MessageCircle,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin, canManageTenders, canManageLegal } = useUserRole();
  const location = useLocation();

  const navigation = [
    { name: 'Головна', href: '/', icon: Home },
    { name: 'Керівництво', href: '/leadership', icon: Users },
    { name: 'Законодавча база', href: '/laws', icon: FileText },
    { name: 'Школа права', href: '/legal-school', icon: GraduationCap },
    { name: 'Тендери', href: '/tenders', icon: Briefcase },
    { name: 'Реєстр адвокатів', href: '/lawyers', icon: Scale },
    { name: 'Підприємства', href: '/enterprises', icon: Building2 },
    { name: 'Контакти', href: '/contact', icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/20 dark:border-gray-700/30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover-lift">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                <Scale className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                ВРУ
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/50 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden lg:flex xl:hidden items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`p-3 rounded-2xl transition-all duration-300 group ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg scale-105'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/50 hover:shadow-md hover:scale-105'
                    }`}
                    title={item.name}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </Link>
                );
              })}
            </nav>
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:shadow-md'
                        }`}
                      >
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {user ? (
                <>
                  {(isAdmin() || canManageTenders() || canManageLegal()) && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <Settings className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Адмін</span>
                      </Button>
                    </Link>
                  )}
                  <Button onClick={handleSignOut} variant="outline" size="sm" className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Вийти</span>
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <LogIn className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Увійти</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/20 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <p>&copy; 2024 Верховна Рада України. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};