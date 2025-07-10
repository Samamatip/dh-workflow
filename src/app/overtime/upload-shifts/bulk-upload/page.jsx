'use client';
import BulkUploadPage from '@/components/account/Admin/overtime/uploadShifts/bulkUpload/BulkUploadPage';
import { usePageAccessRequirement } from '@/utilities/pageAccessRequirement';

export default function Home() {
  // Only allow users with the 'admin' role
  usePageAccessRequirement('admin');
  return (
    <div className="min-h-screen bg-background-1">
      <BulkUploadPage />
    </div>
  );
}
