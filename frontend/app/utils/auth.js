import { setCookie, destroyCookie } from 'nookies';
export const handleSignUp = async (name, email, password, phone, role) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, role }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, role: data.role };
    } else {
      return { success: false, message: data.message || 'Sign up failed' };
    }
  } catch (error) {
    return { success: false, message: 'Error creating user' };
  }
};

export const handleSignIn = async (email, password) => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Set info into cookies
      setCookie(null, 'userToken', data.token, { path: '/' });
      setCookie(null, 'userRole', data.role, { path: '/' });
      setCookie(null, 'userName', data.name, { path: '/' });

      return { success: true, role: data.role };
    } else {
      return { success: false, message: data.message || 'Sign in failed' };
    }
  } catch (error) {
    return { success: false, message: 'Error signing in' };
  }
};

export const handleSignOut = () => {
  destroyCookie(null, 'userToken', { path: '/' });
  destroyCookie(null, 'userRole', { path: '/' });
  destroyCookie(null, 'userName', { path: '/' });
};
