// This helper function returns the full API URL for a given route based on the environment variable `VITE_API_URL` you have set.
export default function api(route) {
  return `${import.meta.env.VITE_API_URL}/api${route}`;
}
