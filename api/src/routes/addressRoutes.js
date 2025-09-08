import express from "express";

import { authenticateJwt } from "../middleware/authMiddleware.js";
import { createAddress, getAddress } from "../controller/addressController.js";
const router = express.Router();
router.post("/add-address", authenticateJwt, createAddress);
router.get("/get-address", authenticateJwt, getAddress);

export default router;
