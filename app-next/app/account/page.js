import { cookies } from "next/headers";
import React from "react";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import ElderPageComponent from "@/components/account/ElderPageComponent";
import VolunteerPageComponent from "@/components/account/VolunteerPageComponent";
const getUser = async () => {
  const accessTokenStore = await cookies();
  const accessToken = accessTokenStore.get("accessToken")?.value;
  if (!accessToken) return null;
  try {
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return {
      id: String(payload.userId ?? payload.sub ?? ""),
      email: String(payload.email ?? ""),
      role: String(payload.role ?? ""),
    };
  } catch (error) {
    console.log(error);
  }
};
export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (user.role === "ADMIN") redirect("/admin");
  return user.role === "ELDER" ? (
    <ElderPageComponent user={user} />
  ) : (
    <VolunteerPageComponent user={user} />
  );
}
