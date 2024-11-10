import authService from "../services/authService.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  try {
    const { success, message, user } = await authService.login(email, password);
    if (!success) {
      return res.status(401).json({ message });
    }

    const token = authService.generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export { login, logout };
