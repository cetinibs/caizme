"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import { ContactForm as ContactFormType } from "@/types";
import { submitContactForm } from "@/services/api";
import { toast } from "react-hot-toast";

// Form doğrulama şeması
const contactFormSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  subject: z.string().min(3, "Konu en az 3 karakter olmalıdır"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ContactFormType>({
    resolver: zodResolver(contactFormSchema),
  });

  const onRecaptchaChange = (value: string | null) => {
    setIsRecaptchaVerified(!!value);
  };

  const onSubmit = async (data: ContactFormType) => {
    if (!isRecaptchaVerified) {
      toast.error("Lütfen robot olmadığınızı doğrulayın");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submitContactForm(data);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      toast.success(response.data || "Mesajınız başarıyla gönderildi");
      reset();
      setIsRecaptchaVerified(false);
      
      // ReCAPTCHA'yı sıfırla
      const recaptchaElement = document.querySelector('[name="g-recaptcha-response"]');
      if (recaptchaElement) {
        (recaptchaElement as HTMLElement).innerHTML = "";
      }
      
    } catch (error) {
      console.error("Form gönderimi hatası:", error);
      toast.error("Mesajınız gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="email"
        type="email"
        label="E-posta Adresiniz"
        placeholder="ornek@mail.com"
        fullWidth
        {...register("email")}
        error={errors.email?.message}
      />
      
      <Input
        id="subject"
        label="Konu"
        placeholder="Mesajınızın konusu"
        fullWidth
        {...register("subject")}
        error={errors.subject?.message}
      />
      
      <TextArea
        id="message"
        label="Mesajınız"
        placeholder="Mesajınızı buraya yazın..."
        rows={6}
        fullWidth
        {...register("message")}
        error={errors.message?.message}
      />
      
      <div className="flex flex-col space-y-4">
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={onRecaptchaChange}
        />
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting || !isRecaptchaVerified}
        >
          Gönder
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
