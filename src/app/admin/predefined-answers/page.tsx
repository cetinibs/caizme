"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getAllPredefinedAnswers, addPredefinedAnswer, updatePredefinedAnswer, deletePredefinedAnswer } from "@/services/predefinedAnswers";
import Button from "@/components/atoms/Button";
import { FiPlus, FiEdit, FiTrash, FiSave, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface PredefinedAnswer {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export default function PredefinedAnswersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [answers, setAnswers] = useState<PredefinedAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formKeywords, setFormKeywords] = useState("");

  // Fetch all predefined answers
  const fetchAnswers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPredefinedAnswers();
      setAnswers(data);
    } catch (error) {
      console.error("Önceden tanımlanmış cevapları getirme hatası:", error);
      toast.error("Cevaplar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchAnswers();
    }
  }, [authLoading, user]);

  // Handle form submission for adding new answer
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formQuestion.trim() || !formAnswer.trim() || !formKeywords.trim()) {
      toast.error("Tüm alanları doldurun.");
      return;
    }
    
    try {
      const keywords = formKeywords.split(",").map(k => k.trim()).filter(k => k);
      const success = await addPredefinedAnswer(formQuestion, formAnswer, keywords);
      
      if (success) {
        toast.success("Cevap başarıyla eklendi.");
        setFormQuestion("");
        setFormAnswer("");
        setFormKeywords("");
        setShowAddForm(false);
        fetchAnswers();
      } else {
        toast.error("Cevap eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Cevap ekleme hatası:", error);
      toast.error("Cevap eklenirken bir hata oluştu.");
    }
  };

  // Handle form submission for updating answer
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId || !formQuestion.trim() || !formAnswer.trim() || !formKeywords.trim()) {
      toast.error("Tüm alanları doldurun.");
      return;
    }
    
    try {
      const keywords = formKeywords.split(",").map(k => k.trim()).filter(k => k);
      const success = await updatePredefinedAnswer(editingId, formQuestion, formAnswer, keywords);
      
      if (success) {
        toast.success("Cevap başarıyla güncellendi.");
        setEditingId(null);
        fetchAnswers();
      } else {
        toast.error("Cevap güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Cevap güncelleme hatası:", error);
      toast.error("Cevap güncellenirken bir hata oluştu.");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Bu cevabı silmek istediğinizden emin misiniz?")) {
      return;
    }
    
    try {
      const success = await deletePredefinedAnswer(id);
      
      if (success) {
        toast.success("Cevap başarıyla silindi.");
        fetchAnswers();
      } else {
        toast.error("Cevap silinirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Cevap silme hatası:", error);
      toast.error("Cevap silinirken bir hata oluştu.");
    }
  };

  // Start editing an answer
  const startEditing = (answer: PredefinedAnswer) => {
    setEditingId(answer.id);
    setFormQuestion(answer.question);
    setFormAnswer(answer.answer);
    setFormKeywords(answer.keywords.join(", "));
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setFormQuestion("");
    setFormAnswer("");
    setFormKeywords("");
  };

  // Start adding a new answer
  const startAdding = () => {
    setShowAddForm(true);
    setFormQuestion("");
    setFormAnswer("");
    setFormKeywords("");
  };

  // Cancel adding
  const cancelAdding = () => {
    setShowAddForm(false);
    setFormQuestion("");
    setFormAnswer("");
    setFormKeywords("");
  };

  if (authLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-custom py-12">
        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-4">Yetkisiz Erişim</h1>
          <p>Bu sayfaya erişmek için giriş yapmanız gerekmektedir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="card p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Önceden Tanımlanmış Cevaplar</h1>
          <Button 
            onClick={startAdding} 
            disabled={showAddForm}
            icon={<FiPlus />}
          >
            Yeni Ekle
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Yeni Cevap Ekle</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Soru</label>
                <input
                  type="text"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                  placeholder="Örn: Kuran-ı Kerim kaç cüzden oluşur?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cevap</label>
                <textarea
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md min-h-[200px] dark:bg-gray-700"
                  placeholder="Cevabı markdown formatında yazın..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Anahtar Kelimeler (virgülle ayırın)</label>
                <input
                  type="text"
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                  placeholder="Örn: kuran, cüz, kuran kaç cüz"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={cancelAdding} icon={<FiX />}>
                  İptal
                </Button>
                <Button type="submit" icon={<FiSave />}>
                  Kaydet
                </Button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : answers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Henüz önceden tanımlanmış cevap bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {answers.map((answer) => (
              <div key={answer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {editingId === answer.id ? (
                  <div className="p-6 bg-gray-100 dark:bg-gray-800">
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Soru</label>
                        <input
                          type="text"
                          value={formQuestion}
                          onChange={(e) => setFormQuestion(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Cevap</label>
                        <textarea
                          value={formAnswer}
                          onChange={(e) => setFormAnswer(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md min-h-[200px] dark:bg-gray-700"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Anahtar Kelimeler (virgülle ayırın)</label>
                        <input
                          type="text"
                          value={formKeywords}
                          onChange={(e) => setFormKeywords(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={cancelEditing} icon={<FiX />}>
                          İptal
                        </Button>
                        <Button type="submit" icon={<FiSave />}>
                          Güncelle
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{answer.question}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(answer)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Düzenle"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(answer.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Sil"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none mb-4">
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                        {answer.answer.split('\n').map((paragraph, index) => (
                          paragraph.trim() ? <p key={index} className="mb-2">{paragraph}</p> : <br key={index} />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {answer.keywords.map((keyword, index) => (
                        <span key={index} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-1 rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-4">
                      Oluşturulma: {new Date(answer.created_at).toLocaleString('tr-TR')}
                      {answer.updated_at !== answer.created_at && (
                        <span> | Güncelleme: {new Date(answer.updated_at).toLocaleString('tr-TR')}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
