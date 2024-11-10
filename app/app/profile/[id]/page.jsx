// app/profile/[id]/page.jsx
import { useEffect, useState } from "react";

export default function ProfilePage({ params }) {
    const [profile, setProfile] = useState(null);
    const { id } = params; // The dynamic 'id' parameter from the URL

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch(`/api/profiles/${id}`);
            const data = await res.json();
            setProfile(data);
        }

        fetchProfile();
    }, [id]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h1>{profile.name}'s Profile</h1>
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio}</p>
            {/* Add other profile details here */}
        </div>
    );
}
