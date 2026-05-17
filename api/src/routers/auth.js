import express from "express";
import { signup, login, getMe } from "#controllers/auth.js";
import { authenticate } from "#middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authenticate, getMe);

export default router;
