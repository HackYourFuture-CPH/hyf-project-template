"use client";
import { useAuth } from "../contexts/AuthContext";

export default function Test() {
  const { currentUser, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the App</h1>
      {currentUser ? (
        <div>
          <p>Hello, {currentUser.user.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please log in to continue</p>
        </div>
      )}
    </div>
  );
}
