import { useRouter } from "next/navigation";

import { handleLogOut } from "../../utils/auth";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function LogOutButton({}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        handleLogOut(() => {
          Cookies.remove("userRole", { path: "/" });
          Cookies.remove("userId", { path: "/" });
          Cookies.remove("projectTitle", { path: "/" });

          router.push("/");
          toast.success("Signed out successfully! 🔐");
        });
      }}
      className="px-2 py-1 min-w-20 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}

export default LogOutButton;
