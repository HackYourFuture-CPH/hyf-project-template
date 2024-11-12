// app/profile/[id]/page.jsx

"use client"; // This ensures that this component will be treated as a Client Component

import { useEffect, useState } from "react";

export default function ProfilePage({ params }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Fetch the profile based on the id (params.id) when the component mounts
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/profiles/${params.id}`);
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        if (params.id) {
            fetchProfile();
        }
    }, [params.id]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h1>{profile.name}'s Profile</h1>
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio}</p>
            {/* Render other profile details */}
        </div>
    );
}
