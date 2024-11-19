"use client";
import { useRouter } from "next/navigation";
import LogOutButton from "../_components/LogOutButton";

export default function DevDashboard() {
  const router = useRouter();
  return (
    <div>
      <h1>Welcome to the development dashboard!</h1>
      <LogOutButton />
      <button onClick={() => router.push("/")}>Go to home dashboard</button>
    </div>
  );
}
