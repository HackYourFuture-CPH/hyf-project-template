'use client';
import { useSession, signOut } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    console.log('User role:', session.user);
  }

  return (
    <div>
      <h1 className='m-6'>Welcome to the development dashboard {session.user.name}!</h1>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className='px-4 py-2 m-6 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Sign Out
      </button>
    </div>
  );
}
