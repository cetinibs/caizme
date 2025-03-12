import { Suspense } from 'react';
import { LoginContent, LoadingFallback } from './page.client';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}