import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Loader2, Trash2, Mail, User } from 'lucide-react';

interface UserWithRoles {
  id: string;
  email?: string;
  roles: string[];
}

export const AdminUserRoles = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    user_id: '',
    role: 'law_manager',
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Group roles by user ID
      const userRoleMap = new Map<string, string[]>();
      userRoles?.forEach(userRole => {
        const existingRoles = userRoleMap.get(userRole.user_id) || [];
        userRoleMap.set(userRole.user_id, [...existingRoles, userRole.role]);
      });

      // Create users with their roles
      const usersWithRoles = Array.from(userRoleMap.entries()).map(([userId, roles]) => ({
        id: userId,
        roles: roles
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити користувачів',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Find user by ID
      const user = users.find(u => u.id === formData.user_id);
      if (!user) {
        // User doesn't exist in our records yet, but that's okay for new users
      }

      // Check if user already has this role
      if (user && user.roles.includes(formData.role)) {
        toast({
          title: 'Помилка',
          description: 'Користувач вже має цю роль',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: formData.user_id,
          role: formData.role
        });

      if (error) throw error;

      toast({
        title: 'Успіх',
        description: 'Роль успішно додано',
      });

      await fetchUsers();
      setDialogOpen(false);
      setFormData({ user_id: '', role: 'law_manager' });
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати роль',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити роль "${role}"?`)) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: 'Успіх',
        description: 'Роль успішно видалено',
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити роль',
        variant: 'destructive',
      });
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Адміністратор';
      case 'law_manager': return 'Керівник законів';
      case 'license_manager': return 'Керівник ліцензій';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'law_manager': return 'bg-blue-100 text-blue-700';
      case 'license_manager': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
        <span>Завантаження...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Керування ролями користувачів</h2>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Додати роль
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Додати роль користувачу</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRole} className="space-y-4">
              <div className="form-field">
                <Label htmlFor="user_id">ID користувача *</Label>
                <Input
                  id="user_id"
                  type="text"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                  className="form-input"
                  placeholder="Введіть ID користувача"
                />
              </div>
              
              <div className="form-field">
                <Label htmlFor="role">Роль *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="form-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Адміністратор</SelectItem>
                    <SelectItem value="law_manager">Керівник законів</SelectItem>
                    <SelectItem value="license_manager">Керівник ліцензій</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                  Скасувати
                </Button>
                <Button type="submit" className="btn-primary">
                  Додати роль
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
          <Card className="clean-card">
            <CardContent className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Користувачів поки що немає</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user, index) => (
            <Card key={user.id} className="clean-card" style={{ animationDelay: `${index * 0.05}s` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <CardTitle className="text-lg">ID: {user.id}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length === 0 ? (
                        <Badge variant="outline" className="rounded-full">
                          Без ролей
                        </Badge>
                      ) : (
                        user.roles.map((role) => (
                          <div key={role} className="flex items-center gap-1">
                            <Badge className={`rounded-full ${getRoleColor(role)}`}>
                              {getRoleLabel(role)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRole(user.id, role)}
                              className="h-6 w-6 p-0 rounded-full hover:bg-red-100"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};