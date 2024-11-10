// app/profile/create/page.jsx
import { useState } from "react";

export default function CreateProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Profile Created!\nName: ${name}\nEmail: ${email}\nBio: ${bio}`);
    };

    return (
        <div>
            <h1>Create Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label>Bio:</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a bit about yourself"
                        required
                    ></textarea>
                </div>
                <button type="submit">Create Profile</button>
            </form>
        </div>
    );
}
