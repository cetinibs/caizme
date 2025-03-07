"use client";

import { useForm } from 'react-hook-form';
import Button from '@/components/atoms/Button';
import TextArea from '@/components/atoms/TextArea';

interface QuestionFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
}

const QuestionForm = ({ onSubmit, isLoading }: QuestionFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ question: string }>();
  
  const handleFormSubmit = async (data: { question: string }) => {
    await onSubmit(data.question);
    reset();
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
      <div className="space-y-4">
        <TextArea
          id="question"
          label="Dini sorunuzu yazın"
          placeholder="Örneğin: Oruçluyken diş fırçalamak orucu bozar mı?"
          fullWidth
          rows={4}
          className="text-lg"
          {...register('question', {
            required: 'Lütfen bir soru girin',
            minLength: {
              value: 5,
              message: 'Soru en az 5 karakter olmalıdır'
            }
          })}
          error={errors.question?.message}
        />
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="text-lg py-3"
        >
          Sor
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
