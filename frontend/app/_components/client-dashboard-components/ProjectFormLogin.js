import Link from "next/link";

function ProjectFormLogin() {
  return (
    <>
      <p className="text-primary-900 text-lg  mb-10">
        Log in anytime to check the status and progress of
        your requests and to take follow up actions when
        needed.
      </p>

      <div className="w-full max-w-sm p-10 bg-primary-50 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-center text-gray-700">
          Sign in to your account
        </h2>

        <form className="mt-6">
          <div>
            <label className="block text-sm text-gray-600">
              Username or email
            </label>
            <input
              type="text"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Remember my username on this device
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-6 p-2 bg-accent-300 text-white font-semibold rounded-md hover:bg-accent-400"
          >
            Continue &#10095;
          </button>

          <div className="mt-4 text-center text-sm">
            <Link
              href="#"
              className="text-primary-500 hover:underline"
            >
              Need help signing in?
            </Link>
          </div>

          <div className="mt-6 text-center text-sm">
            <span>Don’t have an account yet?</span>
            <Link
              href="#"
              className="ml-1 text-accent-500 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProjectFormLogin;
