import React from "react";

export default function VolunteerPageComponent({ user }) {
  console.log(user);
  return (
    <div>
      <p>{user.role}</p>
      <p>{user.email}</p>
      <p> Volunteer Page Component</p>
    </div>
  );
}
