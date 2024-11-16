import { useRouter } from 'next/navigation';

import { handleLogOut } from '../utils/auth';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function LogOutButton({}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        handleLogOut(() => {
          document.cookie.split(';').forEach(function (c) {
            Cookies.remove(c.split('=')[0].trim());
          });
          router.push('/');
          toast.success('Successfully logged out.');
        });
      }}
      className='px-4 py-2 m-6 bg-red-500 text-white rounded hover:bg-red-600'
    >
      Sign Out
    </button>
  );
}

export default LogOutButton;
