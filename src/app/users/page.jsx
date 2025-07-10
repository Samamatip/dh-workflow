'use client';
import Users from '@/components/account/Admin/users/Users';
import { usePageAccessRequirement } from '@/utilities/pageAccessRequirement';

export default function Home() {
  // Only allow users with the 'admin' role
  usePageAccessRequirement('admin');
  return (
    <div className="min-h-screen bg-background-1">
      <Users />
    </div>
  );
}
