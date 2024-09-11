import express from "express";

import {
  checkAuth,
  forgotPassword,
  getUser,
  login,
  logout,
  resetPassword,
  signUp,
  verifyEmail,
} from "../controllers/auth";
import { verifyToken } from "../middleware/verify-token";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.get("/get-user", verifyToken, getUser);

router.post("/sign-up", signUp);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
