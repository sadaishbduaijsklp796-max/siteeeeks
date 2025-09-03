import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircleQuestion, Loader2, User, Calendar, FileText } from 'lucide-react';

interface TenderResponse {
  id: string;
  tender_id: string;
  user_id: string;
  responses: Record<string, any>;
  submitted_at: string;
}

interface TenderQuestion {
  id: string;
  question: string;
  question_type: string;
  options?: string[];
}

interface Tender {
  id: string;
  title: string;
}

export const AdminTenderResponses = () => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<TenderResponse[]>([]);
  const [questions, setQuestions] = useState<TenderQuestion[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState<string>('');

  useEffect(() => {
    fetchTenders();
  }, []);

  useEffect(() => {
    if (selectedTender) {
      fetchResponses();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    if (!selectedTender) return;

    try {
      const { data, error } = await supabase
        .from('tender_form_responses')
        .select('*')
        .eq('tender_id', selectedTender)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
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

  const getQuestionById = (questionId: string) => {
    return questions.find(q => q.id === questionId);
  };

  const formatResponse = (questionId: string, response: any) => {
    const question = getQuestionById(questionId);
    if (!question) return String(response);

    if (question.question_type === 'checkbox' && Array.isArray(response)) {
      return response.join(', ');
    }

    return String(response);
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
          <MessageCircleQuestion className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Відповіді на тендери</h2>
        </div>
        
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
      </div>

      {!selectedTender ? (
        <Card className="clean-card">
          <CardContent className="text-center py-12">
            <MessageCircleQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Оберіть тендер для перегляду відповідей</p>
          </CardContent>
        </Card>
      ) : responses.length === 0 ? (
        <Card className="clean-card">
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Відповідей на цей тендер поки що немає</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {responses.map((response, index) => (
            <Card key={response.id} className="clean-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Заявка #{index + 1}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(response.submitted_at).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Користувач ID: {response.user_id || 'Анонімний'}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(response.responses).map(([questionId, answer]) => {
                    const question = getQuestionById(questionId);
                    return (
                      <div key={questionId} className="border-l-4 border-blue-200 pl-4">
                        <div className="font-medium text-gray-900 mb-1">
                          {question?.question || 'Невідоме питання'}
                        </div>
                        <div className="text-gray-600">
                          {formatResponse(questionId, answer)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};