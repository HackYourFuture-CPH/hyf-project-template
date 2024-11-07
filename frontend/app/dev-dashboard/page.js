'use client';
import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { handleSignOut } from '../utils/auth';

export default function DevDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const userToken = cookies.userToken;
    const userRole = cookies.userRole;
    const userName = cookies.userName;

    if (userToken && userRole === 'developer' && userName) {
      setUser({ name: userName, role: userRole });
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        Welcome to the development dashboard, {user.name} ({user.role})!
      </h1>
      <button
        onClick={() => {
          handleSignOut();
          router.push('/login');
        }}
        className='px-4 py-2 m-6 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Sign Out
      </button>
    </div>
  );
}
