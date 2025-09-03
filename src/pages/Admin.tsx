import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/use-user-role';
import { AdminLeadership } from '@/components/admin/AdminLeadership';
import { AdminLaws } from '@/components/admin/AdminLaws';
import { AdminLegalSchool } from '@/components/admin/AdminLegalSchool';
import { AdminTenders } from '@/components/admin/AdminTenders';
import { AdminLawyers } from '@/components/admin/AdminLawyers';
import { AdminEnterprises } from '@/components/admin/AdminEnterprises';
import { AdminFeedback } from '@/components/admin/AdminFeedback';
import { AdminStatistics } from '@/components/admin/AdminStatistics';
import { AdminUserRoles } from '@/components/admin/AdminUserRoles';
import { AdminTenderQuestions } from '@/components/admin/AdminTenderQuestions';
import { AdminTenderResponses } from '@/components/admin/AdminTenderResponses';
import { 
  Settings, 
  Users, 
  FileText, 
  GraduationCap, 
  Briefcase, 
  Scale, 
  Building2, 
  MessageSquare,
  BarChart3,
  Shield,
  HelpCircle,
  MessageCircleQuestion
} from 'lucide-react';

const Admin = () => {
  const { isAdmin, canManageTenders, canManageLegal, loading } = useUserRole();
  const [activeTab, setActiveTab] = useState('statistics');

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Завантаження...</span>
        </div>
      </Layout>
    );
  }

  if (!isAdmin() && !canManageTenders() && !canManageLegal()) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Доступ заборонено</h2>
          <p className="text-gray-600">У вас немає доступу до адміністративної панелі.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <section className="text-center space-y-6 fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-medium pulse-glow">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Адміністративна панель
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Керування контентом та налаштуваннями сайту
          </p>
        </section>

        {/* Admin Tabs */}
        <Card className="clean-card scale-in">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 h-auto p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl">
                <TabsTrigger value="statistics" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Статистика</span>
                </TabsTrigger>
                
                {(isAdmin() || canManageLegal()) && (
                  <>
                    <TabsTrigger value="leadership" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Керівництво</span>
                    </TabsTrigger>
                    <TabsTrigger value="laws" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Закони</span>
                    </TabsTrigger>
                    <TabsTrigger value="legal-school" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <GraduationCap className="w-4 h-4" />
                      <span className="hidden sm:inline">Школа права</span>
                    </TabsTrigger>
                    <TabsTrigger value="lawyers" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <Scale className="w-4 h-4" />
                      <span className="hidden sm:inline">Адвокати</span>
                    </TabsTrigger>
                  </>
                )}

                {(isAdmin() || canManageTenders()) && (
                  <>
                    <TabsTrigger value="tenders" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <Briefcase className="w-4 h-4" />
                      <span className="hidden sm:inline">Тендери</span>
                    </TabsTrigger>
                    <TabsTrigger value="tender-questions" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <HelpCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Питання</span>
                    </TabsTrigger>
                    <TabsTrigger value="tender-responses" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <MessageCircleQuestion className="w-4 h-4" />
                      <span className="hidden sm:inline">Відповіді</span>
                    </TabsTrigger>
                    <TabsTrigger value="enterprises" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                      <Building2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Підприємства</span>
                    </TabsTrigger>
                  </>
                )}

                <TabsTrigger value="feedback" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Зворотний зв'язок</span>
                </TabsTrigger>

                {isAdmin() && (
                  <TabsTrigger value="users" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Користувачі</span>
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="p-6 bg-white/50 dark:bg-gray-900/50 rounded-b-2xl">
                <TabsContent value="statistics">
                  <AdminStatistics />
                </TabsContent>

                {(isAdmin() || canManageLegal()) && (
                  <>
                    <TabsContent value="leadership">
                      <AdminLeadership />
                    </TabsContent>

                    <TabsContent value="laws">
                      <AdminLaws />
                    </TabsContent>

                    <TabsContent value="legal-school">
                      <AdminLegalSchool />
                    </TabsContent>

                    <TabsContent value="lawyers">
                      <AdminLawyers />
                    </TabsContent>
                  </>
                )}

                {(isAdmin() || canManageTenders()) && (
                  <>
                    <TabsContent value="tenders">
                      <AdminTenders />
                    </TabsContent>

                    <TabsContent value="tender-questions">
                      <AdminTenderQuestions />
                    </TabsContent>

                    <TabsContent value="tender-responses">
                      <AdminTenderResponses />
                    </TabsContent>

                    <TabsContent value="enterprises">
                      <AdminEnterprises />
                    </TabsContent>
                  </>
                )}

                <TabsContent value="feedback">
                  <AdminFeedback />
                </TabsContent>

                {isAdmin() && (
                  <TabsContent value="users">
                    <AdminUserRoles />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;