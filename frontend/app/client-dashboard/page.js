'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    console.log('User role:', session.user);
  }
  return (
    <div>
      <h1 className='m-6'>Welcome to the client dashboard! {session.user.name}</h1>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className='px-4 py-2 m-6 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Sign Out
      </button>
    </div>
  );
}
