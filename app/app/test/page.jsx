"use client";
import { useAuth } from "../contexts/AuthContext";

function ProfileComponent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <div>Username: {currentUser.user.username}</div>
      <div>Email: {currentUser.user.email}</div>
      {currentUser.user.first_name && (
        <div>First Name: {currentUser.user.first_name}</div>
      )}
      {currentUser.last_name && (
        <div>Last Name: {currentUser.user.last_name}</div>
      )}
      {/* Add any other currentUser fields you want to display */}
    </div>
  );
}

export default ProfileComponent;
