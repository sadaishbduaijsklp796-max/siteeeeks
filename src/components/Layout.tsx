import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useUserRole } from '@/hooks/use-user-role';
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
  LogIn
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
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl flex items-center justify-center shadow-soft">
                <Scale className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                ВРУ
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gray-800 text-white shadow-medium'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-soft'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  {(isAdmin() || canManageTenders() || canManageLegal()) && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="rounded-full bg-white/60 border-gray-200/50 hover:bg-white/80 hover:shadow-soft">
                        <Settings className="w-4 h-4 mr-2" />
                        Адмін
                      </Button>
                    </Link>
                  )}
                  <Button onClick={handleSignOut} variant="outline" size="sm" className="rounded-full bg-white/60 border-gray-200/50 hover:bg-white/80 hover:shadow-soft">
                    <LogOut className="w-4 h-4 mr-2" />
                    Вийти
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="rounded-full bg-white/60 border-gray-200/50 hover:bg-white/80 hover:shadow-soft">
                    <LogIn className="w-4 h-4 mr-2" />
                    Увійти
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
      <footer className="border-t border-gray-200/50 bg-white/50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Верховна Рада України. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};