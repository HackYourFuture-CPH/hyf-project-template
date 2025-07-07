export default function api(route) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api${route}`;
}
