"use client";

import { useState, useEffect } from "react";
import { FiThumbsUp, FiLock, FiCreditCard } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { likeQuestion, checkUserLiked } from "@/services/supabase";
import { motion } from "framer-motion";
import Button from "../atoms/Button";
import CopyButton from "../atoms/CopyButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface AnswerDisplayProps {
  question: string;
  questionId: string;
  answer: string;
  isLoading: boolean;
  source?: 'ai' | 'predefined' | 'fallback';
  isPremium?: boolean;
}

const AnswerDisplay = ({ question, questionId, answer, isLoading, source = 'ai', isPremium = false }: AnswerDisplayProps) => {
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  // Kullanıcının premium üye olup olmadığını kontrol et
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  // Sayfa yüklendiğinde daha önce beğenilen soruları kontrol et
  useEffect(() => {
    if (questionId) {
      const checkLikeStatus = async () => {
        try {
          // Veritabanından beğeni durumunu kontrol et
          const isLiked = await checkUserLiked(questionId);
          setLiked(isLiked);
        } catch (error) {
          console.error("Beğeni durumu kontrol edilirken hata oluştu:", error);
        }
      };
      
      checkLikeStatus();
    }
  }, [questionId]);

  // Cevap veya yükleme durumu değiştiğinde gösterimi güncelle
  useEffect(() => {
    if (answer || isLoading) {
      setShowAnswer(true);
    }
  }, [answer, isLoading]);
  
  // Kullanıcının premium üyelik durumunu kontrol et
  useEffect(() => {
    // Kullanıcı giriş yapmışsa ve premium üyelik satın almışsa
    // Bu kısım gerçek bir ödeme sistemi entegrasyonu ile değiştirilmeli
    const checkPremiumStatus = async () => {
      if (user) {
        // Şu an için localStorage'den kontrol ediyoruz
        // Gerçek uygulamada veritabanından kontrol edilmeli
        const hasPaid = localStorage.getItem('premiumUser') === 'true';
        setHasPremiumAccess(hasPaid);
        
        // Eğer premium üyeyse tam cevabı göster
        if (hasPaid) {
          setShowFullAnswer(true);
        }
      } else {
        setHasPremiumAccess(false);
        setShowFullAnswer(false);
      }
    };
    
    checkPremiumStatus();
  }, [user]);

  // Premium satın alma işlemi
  const handlePremiumPurchase = async () => {
    try {
      // Burada gerçek bir ödeme işlemi entegre edilmeli (Stripe, PayPal vb.)
      // Şu an için sadece simule ediyoruz
      toast.success("Premium üyelik satın alma işlemi başlatılıyor...");
      
      // Ödeme başarılı olduğunda
      setTimeout(() => {
        // Kullanıcıyı premium olarak işaretle
        localStorage.setItem('premiumUser', 'true');
        setHasPremiumAccess(true);
        setShowFullAnswer(true);
        
        toast.success("Premium üyelik başarıyla etkinleştirildi!");
      }, 1500);
    } catch (error) {
      console.error("Premium satın alma işlemi sırasında hata:", error);
      toast.error("Premium satın alma işlemi başarısız oldu. Lütfen tekrar deneyin.");
    }
  };

  const handleLike = async () => {
    if (!questionId || liked || isLiking) return;
    
    try {
      setIsLiking(true);
      console.log('Beğeni işlemi başlatılıyor, questionId:', questionId);
      
      // Önce UI'da beğeniyi işaretle (kullanıcı deneyimi için)
      setLiked(true);
      
      // Soruyu beğen (veritabanına kaydet)
      const success = await likeQuestion(questionId);
      console.log('Beğeni işlemi sonucu:', success);
      
      if (success) {
        toast.success("Cevap beğenildi!");
      } else {
        toast.error("Beğeni işlemi başarısız oldu.");
        // Başarısız olursa liked durumunu geri al
        setLiked(false);
      }
    } catch (error) {
      console.error("Beğeni işlemi sırasında hata oluştu:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      // Hata durumunda liked durumunu geri al
      setLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  if (!showAnswer) return null;

  return (
    <motion.section 
      className="card p-8 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Cevap</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center py-8">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cevap hazırlanıyor...</p>
        </div>
      ) : answer ? (
        <div>
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Sorunuz:</h3>
            <p className="text-gray-600 dark:text-gray-400">{question}</p>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            {answer.split('\n').map((paragraph, index, array) => {
              // Cevabın uzunluğunu hesapla
              const totalParagraphs = array.length;
              const oneThird = Math.ceil(totalParagraphs / 3);
              
              // Premium olmayan kullanıcılar için sadece ilk 1/3'ü göster
              if (!showFullAnswer && index >= oneThird) {
                // Son paragraf olarak premium mesajını göster
                if (index === oneThird) {
                  return (
                    <div key="premium-message" className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center mb-2">
                        <FiLock className="mr-2 text-yellow-500" />
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">Premium İçerik</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Bu cevabın tamamını görmek için premium üyelik gerekiyor. 
                        Sadece 2$ ödeyerek tüm cevaplara tam erişim sağlayabilirsiniz.
                      </p>
                      <div className="flex space-x-2">
                        {user ? (
                          <Button 
                            onClick={() => handlePremiumPurchase()}
                            variant="primary"
                            size="sm"
                            icon={<FiCreditCard />}
                          >
                            Premium Satın Al (2$)
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => router.push('/giris')}
                            variant="primary"
                            size="sm"
                            icon={<FiCreditCard />}
                          >
                            Giriş Yap ve Premium Ol
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                }
                return null; // Diğer kilitli paragrafları gösterme
              }
              
              // Premium kullanıcılar veya ilk 1/3 için normal paragrafları göster
              return paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />;
            })}
          </div>
          
          {/* Cevap kaynağı gösterimi */}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
            {source === 'predefined' ? (
              <span>Bu cevap, önceden hazırlanmış veritabanımızdan alınmıştır.</span>
            ) : source === 'fallback' ? (
              <span>Bu cevap, yedek cevap sistemimiz tarafından oluşturulmuştur.</span>
            ) : (
              <span>Bu cevap, yapay zeka tarafından oluşturulmuştur.</span>
            )}
          </div>
          
          {/* Yararlı Dini Kaynaklar Linkleri */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Yararlı Dini Kaynaklar:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <a 
                href="https://kurul.diyanet.gov.tr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
              >
                <span className="mr-1">•</span> Diyanet İşleri Başkanlığı Fetva Kurulu
              </a>
              <a 
                href="https://fetva.diyanet.gov.tr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
              >
                <span className="mr-1">•</span> Diyanet Fetva Bankası
              </a>
              <a 
                href="tel:+902125713333" 
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
              >
                <span className="mr-1">•</span> Diyanet Fetva Hattı: 0212 571 3333
              </a>
              <a 
                href="https://sorularlaislamiyet.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
              >
                <span className="mr-1">•</span> Sorularla İslamiyet
              </a>
              <a 
                href="https://dinimizislam.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
              >
                <span className="mr-1">•</span> Dinimiz İslam
              </a>
              <a 
                href="https://islamqa.info/tr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
              >
                <span className="mr-1">•</span> İslam Soru Cevap
              </a>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Not: Önemli dini konularda mutlaka bir din aliminden görüş alınız.
            </p>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<FiThumbsUp className={liked ? "text-emerald-500" : ""} />}
              onClick={handleLike}
              disabled={liked || isLiking}
              isLoading={isLiking}
            >
              {liked ? "Beğenildi" : "Beğen"}
            </Button>
            
            <CopyButton text={answer} />
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 py-4">
          Henüz bir cevap yok. Lütfen bir soru sorun.
        </p>
      )}
    </motion.section>
  );
};

export default AnswerDisplay;
