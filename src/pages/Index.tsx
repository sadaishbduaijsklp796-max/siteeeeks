import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Users,
  TrendingUp,
  Scale,
  Building2,
  Award
} from 'lucide-react';

interface Statistics {
  laws_count: number;
  school_topics_count: number;
  active_tenders_count: number;
  staff_count: number;
}

const Index = () => {
  const [stats, setStats] = useState<Statistics>({
    laws_count: 0,
    school_topics_count: 0,
    active_tenders_count: 0,
    staff_count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data, error } = await supabase
          .from('statistics')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching statistics:', error);
        } else if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const statsCards = [
    {
      title: 'Законів у базі',
      value: stats.laws_count,
      icon: FileText,
      description: 'Активних законодавчих актів',
      gradient: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Тем у школі права',
      value: stats.school_topics_count,
      icon: GraduationCap,
      description: 'Навчальних матеріалів',
      gradient: 'from-green-600 to-green-700',
    },
    {
      title: 'Активних тендерів',
      value: stats.active_tenders_count,
      icon: Briefcase,
      description: 'Відкритих конкурсів',
      gradient: 'from-purple-600 to-purple-700',
    },
    {
      title: 'Співробітників у фракції',
      value: stats.staff_count,
      icon: Users,
      description: 'Активних працівників',
      gradient: 'from-orange-600 to-orange-700',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-white border border-gray-200/50 shadow-medium hover-lift fade-in">
          <div className="relative px-6 py-12 md:py-16 text-center">
            <div className="mx-auto max-w-4xl">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-medium pulse-glow">
                  <Scale className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 slide-up">
                Верховна Рада України
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 slide-up max-w-2xl mx-auto">
                Офіційний портал парламенту України. Тут ви знайдете актуальну інформацію про 
                законодавчу діяльність, керівництво та можливості співпраці.
              </p>
              <div className="flex flex-wrap justify-center gap-4 fade-in">
                <div className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/30 shadow-soft flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Прозорість</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/30 shadow-soft flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Ефективність</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/30 shadow-soft flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Розвиток</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="slide-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Статистика</h2>
            <p className="text-gray-600">Актуальні дані про діяльність парламенту</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card 
                  key={card.title} 
                  className="clean-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {card.title}
                      </CardTitle>
                      <div className={`p-2.5 rounded-xl bg-gradient-to-r ${card.gradient} shadow-soft`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">
                        {loading ? '...' : card.value.toLocaleString()}
                      </div>
                      <CardDescription className="text-xs text-gray-500">
                        {card.description}
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Links */}
        <section className="scale-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Швидкий доступ</h2>
            <p className="text-gray-600">Основні розділи порталу</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="clean-card cursor-pointer hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 shadow-soft">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gray-900">Законодавча база</CardTitle>
                <CardDescription className="text-gray-600">
                  Доступ до повного архіву законів та нормативних актів України
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="clean-card cursor-pointer hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-soft">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gray-900">Школа права</CardTitle>
                <CardDescription className="text-gray-600">
                  Навчальні матеріали та курси з правознавства для громадян
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="clean-card cursor-pointer hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4 shadow-soft">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gray-900">Тендери</CardTitle>
                <CardDescription className="text-gray-600">
                  Активні конкурси та можливості співпраці з парламентом
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
