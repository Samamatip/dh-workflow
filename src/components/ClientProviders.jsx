'use client';
import { AuthProvider } from '@/contexts/AuthContext';
import { BulkShiftUploadProvider } from '@/contexts/bulkShiftUploadContext';
import { UndevelopedFunctionalityProvider } from '@/contexts/UndevelopedFunctionalityWarning';

export default function ClientProviders({ children }) {
  return (
    <UndevelopedFunctionalityProvider>
      <AuthProvider>
        <BulkShiftUploadProvider>
          {children}
        </BulkShiftUploadProvider>
      </AuthProvider>
    </UndevelopedFunctionalityProvider>
  );
}