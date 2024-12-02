export const buildUserDto = (user) => {
    return {
        id: user.user_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImageUrl: user.profile_image_url,
        about: user.about,
        role: user.role,
      }
};