import { NextRequest, NextResponse } from 'next/server';
import { ContactForm } from '@/types';

export async function POST(req: NextRequest) {
  try {
    // Request gövdesini al
    const body = await req.json() as ContactForm;
    const { email, subject, message } = body;

    // Giriş doğrulama
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tüm alanların doldurulması gerekiyor' },
        { status: 400 }
      );
    }

    // E-posta formatı doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // ReCAPTCHA doğrulama
    // NOT: Gerçek bir uygulamada ReCAPTCHA doğrulaması burada yapılmalıdır
    
    // E-posta gönderimi simülasyonu
    // Gerçek uygulamada burada bir e-posta servisi kullanılmalıdır (SendGrid, Nodemailer vb.)
    console.log('İletişim formu gönderildi:', {
      from: email,
      subject,
      message
    });

    // Başarılı yanıt
    return NextResponse.json({
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
    });
  } catch (error) {
    console.error('İletişim formu hatası:', error);
    return NextResponse.json(
      { error: 'Mesajınız gönderilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
