export default function api(route) {
  return `${import.meta.env.VITE_API_URL}/api${route}`;
}
