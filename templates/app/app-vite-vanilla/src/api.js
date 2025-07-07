export default function api(route) {
  console.log(import.meta.env);
  return `${import.meta.env.VITE_API_URL}/api${route}`;
}
