import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Scale } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Помилка",
        description: "Будь ласка, заповніть всі поля",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
        if (!result.error) {
          toast({
            title: "Реєстрація успішна",
            description: "Перевірте свою електронну пошту для підтвердження",
          });
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          toast({
            title: "Вхід успішний",
            description: "Ласкаво просимо!",
          });
          navigate('/');
        }
      }

      if (result.error) {
        toast({
          title: "Помилка",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Щось пішло не так. Спробуйте ще раз.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medium animate-scale-in bg-white/90 border border-gray-200/50 rounded-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
            <Scale className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? 'Реєстрація' : 'Вхід'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Створіть новий обліковий запис' 
              : 'Увійдіть у свій обліковий запис'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Електронна пошта</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="transition-all duration-200 focus:shadow-soft rounded-xl border-gray-200/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="transition-all duration-200 focus:shadow-soft rounded-xl border-gray-200/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:shadow-medium transition-all duration-300 rounded-xl" 
              disabled={loading}
            >
              {loading ? 'Завантаження...' : (isSignUp ? 'Зареєструватися' : 'Увійти')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors underline-offset-4 hover:underline"
              disabled={loading}
            >
              {isSignUp 
                ? 'Вже маєте обліковий запис? Увійдіть' 
                : 'Немає облікового запису? Зареєструйтеся'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;