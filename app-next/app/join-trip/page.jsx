"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function JoinTripPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Joining trip...");
  const [error, setError] = useState("");

  useEffect(() => {
    const acceptInvite = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("Invalid invitation link.");
        setError("No token provided in the URL.");
        return;
      }

      const authToken = localStorage.getItem("token");
      if (!authToken) {
        window.location.href = `/login?redirect=/join-trip?token=${token}`;
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/accept`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ token }),
          }
        );

        const result = await response.json();

        if (result.data?.tripId) {
          setStatus("Success! Redirecting you to the trip planner...");
          window.location.href = `/planner/${result.data.tripId}`;
        } else {
          throw new Error(result.error || "Failed to join the trip.");
        }
      } catch (err) {
        setStatus("Could not join trip.");
        setError(err.message);
      }
    };

    acceptInvite();
  }, [searchParams]);

  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>{status}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
