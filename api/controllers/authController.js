import authService from "../services/authService.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    res.cookie("token", result.token, result.cookieConfig);

    return res.status(200).json({
      success: true,
      message: result.message,

      token: result.token,
      // redirectUrl: result.redirectUrl,
      // user: {
      //   id: result.user.id,
      //   email: result.user.email,
      //   role: result.role,
      // },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default login;
