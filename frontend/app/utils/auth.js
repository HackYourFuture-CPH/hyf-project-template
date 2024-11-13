export const handleSignUp = async data => {
  try {
    const response = await fetch(`/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      alert(result.message + ' Sign In again.');
      window.location.href = '/';
      return result;
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert('Error during sign-up: ' + error.message);
  }
};

export const handleLogIn = async (email, password) => {
  try {
    const response = await fetch(`/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log(result.message);
    } else {
      alert(result.message);
    }
    return result;
  } catch (error) {
    alert('Error signing in' + error.message);
  }
};

export const handleLogOut = async () => {
  try {
    const response = await fetch(`/api/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      alert('Failed to sign out. Please try again.');
    }
  } catch (error) {
    alert('An error occurred during sign-out: ' + error.message);
  }
};
