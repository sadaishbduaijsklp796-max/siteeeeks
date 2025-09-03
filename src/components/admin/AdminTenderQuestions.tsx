import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, Plus, Edit, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

interface TenderQuestion {
  id: string;
  tender_id: string;
  question: string;
  question_type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  options?: string[];
  is_required: boolean;
  order_index: number;
  created_at: string;
}

interface Tender {
  id: string;
  title: string;
}

export const AdminTenderQuestions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<TenderQuestion[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState<string>('');
  const [editingQuestion, setEditingQuestion] = useState<TenderQuestion | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    question_type: 'text' as const,
    options: [''],
    is_required: false,
    order_index: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchTenders();
  }, []);

  useEffect(() => {
    if (selectedTender) {
      fetchQuestions();
    }
  }, [selectedTender]);

  const fetchTenders = async () => {
    try {
      const { data, error } = await supabase
        .from('tenders')
        .select('id, title')
        .eq('has_form', true)
        .order('title');

      if (error) throw error;
      setTenders(data || []);
      if (data && data.length > 0) {
        setSelectedTender(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити тендери',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    if (!selectedTender) return;

    try {
      const { data, error } = await supabase
        .from('tender_form_questions')
        .select('*')
        .eq('tender_id', selectedTender)
        .order('order_index');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTender) {
      toast({
        title: 'Помилка',
        description: 'Оберіть тендер',
        variant: 'destructive',
      });
      return;
    }

    try {
      const dataToSave = {
        tender_id: selectedTender,
        question: formData.question,
        question_type: formData.question_type,
        options: ['select', 'radio', 'checkbox'].includes(formData.question_type) 
          ? formData.options.filter(opt => opt.trim() !== '') 
          : null,
        is_required: formData.is_required,
        order_index: formData.order_index,
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from('tender_form_questions')
          .update(dataToSave)
          .eq('id', editingQuestion.id);

        if (error) throw error;
        toast({ title: 'Успіх', description: 'Питання оновлено' });
      } else {
        const { error } = await supabase
          .from('tender_form_questions')
          .insert([dataToSave]);

        if (error) throw error;
        toast({ title: 'Успіх', description: 'Нове питання додано' });
      }

      await fetchQuestions();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося зберегти питання',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це питання?')) return;

    try {
      const { error } = await supabase
        .from('tender_form_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Успіх', description: 'Питання видалено' });
      await fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити питання',
        variant: 'destructive',
      });
    }
  };

  const moveQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    try {
      const updates = [
        { id: questions[currentIndex].id, order_index: questions[newIndex].order_index },
        { id: questions[newIndex].id, order_index: questions[currentIndex].order_index },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('tender_form_questions')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }

      await fetchQuestions();
    } catch (error) {
      console.error('Error moving question:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося перемістити питання',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      question_type: 'text',
      options: [''],
      is_required: false,
      order_index: questions.length,
    });
    setEditingQuestion(null);
  };

  const openEditDialog = (question: TenderQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      question_type: question.question_type,
      options: question.options || [''],
      is_required: question.is_required,
      order_index: question.order_index,
    });
    setDialogOpen(true);
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
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
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Питання для тендерів</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedTender} onValueChange={setSelectedTender}>
            <SelectTrigger className="w-full sm:w-64 rounded-xl">
              <SelectValue placeholder="Оберіть тендер" />
            </SelectTrigger>
            <SelectContent>
              {tenders.map((tender) => (
                <SelectItem key={tender.id} value={tender.id}>
                  {tender.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Додати питання
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? 'Редагувати питання' : 'Додати нове питання'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-field">
                  <Label htmlFor="question">Текст питання *</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                    className="form-input"
                    rows={3}
                  />
                </div>
                
                <div className="form-field">
                  <Label htmlFor="question_type">Тип питання *</Label>
                  <Select
                    value={formData.question_type}
                    onValueChange={(value: any) => setFormData({ ...formData, question_type: value })}
                  >
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Текстове поле</SelectItem>
                      <SelectItem value="textarea">Багаторядкове поле</SelectItem>
                      <SelectItem value="select">Випадаючий список</SelectItem>
                      <SelectItem value="radio">Радіо кнопки</SelectItem>
                      <SelectItem value="checkbox">Чекбокси</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {['select', 'radio', 'checkbox'].includes(formData.question_type) && (
                  <div className="form-field">
                    <Label>Варіанти відповідей</Label>
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Варіант ${index + 1}`}
                            className="form-input"
                          />
                          {formData.options.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(index)}
                              className="rounded-xl"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                        className="rounded-xl"
                      >
                        + Додати варіант
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_required"
                    checked={formData.is_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                  />
                  <Label htmlFor="is_required">Обов'язкове питання</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                    Скасувати
                  </Button>
                  <Button type="submit" className="btn-primary">
                    {editingQuestion ? 'Оновити' : 'Додати'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!selectedTender ? (
        <Card className="clean-card">
          <CardContent className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Оберіть тендер для керування питаннями</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <Card className="clean-card">
              <CardContent className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Питання для цього тендера поки що не додано</p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id} className="clean-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <CardTitle className="text-lg">{question.question}</CardTitle>
                        {question.is_required && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Обов'язкове
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        Тип: {question.question_type} • Порядок: {question.order_index + 1}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestion(question.id, 'up')}
                        disabled={index === 0}
                        className="rounded-xl"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveQuestion(question.id, 'down')}
                        disabled={index === questions.length - 1}
                        className="rounded-xl"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(question)}
                        className="rounded-xl"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        className="rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {question.options && question.options.length > 0 && (
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      <strong>Варіанти:</strong> {question.options.join(', ')}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};