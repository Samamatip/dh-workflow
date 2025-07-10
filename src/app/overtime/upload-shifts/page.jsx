'use client';
import UploadShifts from '@/components/account/Admin/overtime/uploadShifts/UploadShifts';
import { usePageAccessRequirement } from '@/utilities/pageAccessRequirement';


export default function Home() {
  // Only allow users with the 'admin' role
  usePageAccessRequirement('admin');

  return (
    <div className="min-h-screen bg-background-1">
      <UploadShifts />
    </div>
  );
};
