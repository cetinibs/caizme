"use client";

import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // navigator.clipboard API kullanımı yerine daha güvenli bir yöntem
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Görünmez yap
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      
      // Metni seç ve kopyala
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        toast.success("Metin kopyalandı");
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error("Kopyalama başarısız oldu");
      }
    } catch (err) {
      console.error("Kopyalama hatası:", err);
      toast.error("Kopyalama sırasında bir hata oluştu");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-md transition-colors ${
        copied
          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      } ${className}`}
      aria-label="Metni kopyala"
      title="Metni kopyala"
    >
      {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
    </button>
  );
}
