"use client";

import { useState, useEffect } from "react";
import { supabase, checkUserLiked, likeQuestion } from "@/services/supabase";

export default function TestSupabase() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testQuestionId, setTestQuestionId] = useState("test-123");
  const [likeStatus, setLikeStatus] = useState(false);

  // Supabase bağlantısını test et
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Basit bir sorgu ile bağlantıyı test et
      const { data, error } = await supabase.from("questions").select("id").limit(1);
      
      if (error) {
        console.error("Supabase bağlantı hatası:", error);
        setError(`Supabase bağlantı hatası: ${error.message}`);
        return;
      }
      
      setSuccess(`Supabase bağlantısı başarılı! Veri: ${JSON.stringify(data)}`);
      console.log("Supabase bağlantısı başarılı:", data);
    } catch (err) {
      console.error("Test sırasında hata:", err);
      setError(`Test sırasında hata: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Beğeni durumunu kontrol et
  const testLikeStatus = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const isLiked = await checkUserLiked(testQuestionId);
      setLikeStatus(isLiked);
      setSuccess(`Beğeni durumu: ${isLiked ? "Beğenilmiş" : "Beğenilmemiş"}`);
    } catch (err) {
      console.error("Beğeni durumu kontrolü sırasında hata:", err);
      setError(`Beğeni durumu kontrolü sırasında hata: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Test sorusunu beğen
  const testLikeQuestion = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await likeQuestion(testQuestionId);
      if (result) {
        setSuccess("Soru başarıyla beğenildi!");
        setLikeStatus(true);
      } else {
        setError("Beğeni işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error("Beğeni işlemi sırasında hata:", err);
      setError(`Beğeni işlemi sırasında hata: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Supabase kullanıcı bilgisini kontrol et
  const checkUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        setError(`Kullanıcı bilgisi alınamadı: ${error.message}`);
        return;
      }
      
      if (data.user) {
        setSuccess(`Kullanıcı giriş yapmış. ID: ${data.user.id}`);
      } else {
        setSuccess("Kullanıcı giriş yapmamış.");
      }
    } catch (err) {
      setError(`Kullanıcı kontrolü sırasında hata: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Test Sayfası</h1>
      
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Supabase Bağlantı Testi</h2>
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Bağlantıyı Test Et
        </button>
        <button 
          onClick={checkUser}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Kullanıcı Kontrolü
        </button>
      </div>
      
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Beğeni Sistemi Testi</h2>
        <div className="flex items-center mb-4">
          <label className="mr-2">Test Soru ID:</label>
          <input 
            type="text" 
            value={testQuestionId}
            onChange={(e) => setTestQuestionId(e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-700"
          />
        </div>
        <button 
          onClick={testLikeStatus}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded mr-2"
        >
          Beğeni Durumunu Kontrol Et
        </button>
        <button 
          onClick={testLikeQuestion}
          disabled={loading || likeStatus}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
        >
          Test Sorusunu Beğen
        </button>
        <div className="mt-2">
          <span className="font-medium">Beğeni Durumu:</span> {likeStatus ? "Beğenilmiş ❤️" : "Beğenilmemiş 🖤"}
        </div>
      </div>
      
      {loading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg">
          İşlem yapılıyor...
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
          <strong>Hata:</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
          <strong>Başarılı:</strong> {success}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
        <h3 className="font-semibold mb-2">Tarayıcı Konsolunu Kontrol Edin</h3>
        <p>Detaylı hata mesajları için tarayıcı konsolunu (F12) açın ve kontrol edin.</p>
      </div>
    </div>
  );
}
