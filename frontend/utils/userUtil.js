export function returnPathByRole(role) {
  console.log("role is :", role);
  const validRoles = ["instructor", "student"];
  if (!validRoles.includes(role)) {
    throw new Error("User is not authorized");
  }
  switch (role) {
    case "instructor":
      return "/instructor-dashboard";
    case "student":
      return "/student-dashboard";
    default:
      return "/";
  }
}
