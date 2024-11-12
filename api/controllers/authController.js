import authService from "../services/authService.js";

const login = async (req, res) => {
  //console.log("Login request received:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    // console.log("Missing credentials:", {
    //   email: !!email,
    //   password: !!password,
    // });
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const result = await authService.login(email, password);
    // console.log("Auth service result:", {
    //   ...result,
    //   token: result.token ? "exists" : "missing",
    // });

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    const cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
      path: "/",
    };
    // console.log("Setting cookie with config:", cookieConfig);

    res.cookie("token", result.token, cookieConfig);
    //console.log("Response headers:", res.getHeaders());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    // console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default login;
