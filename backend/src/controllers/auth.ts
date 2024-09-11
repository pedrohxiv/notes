import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { db } from "../lib/db";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../lib/mail";

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: (req as Request & { userId: string }).userId,
      },
    });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    return res.status(200).send("User authenticated.");
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: (req as Request & { userId: string }).userId,
      },
    });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .send("All fields (name, email and password) are required.");
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).send("A user with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({ ...user, password: undefined });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send("All fields (email and password) are required.");
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(404).send("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(404).send("Invalid email or password.");
    }

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const user = await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    return res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");

    return res.status(200).send("Logged out successfully.");
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).send("Verification code are required.");
    }

    const existingUser = await db.user.findFirst({
      where: {
        verificationToken: code,
        verificationTokenExpiresAt: { gte: new Date() },
      },
    });

    if (!existingUser) {
      return res.status(404).send("Invalid or expired verification code.");
    }

    const user = await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email are required.");
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res
        .status(404)
        .send("No account associated with this email address.");
    }

    const resetPasswordToken = crypto.randomBytes(20).toString("hex");

    const user = await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        resetPasswordToken,
        resetPasswordExpiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      },
    });

    await sendPasswordResetEmail(user.email, resetPasswordToken);

    return res
      .status(200)
      .send(
        "A password reset link has been sent to the email address provided."
      );
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    if (!password) {
      return res.status(400).send("Password are required.");
    }

    const existingUser = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: { gte: new Date() },
      },
    });

    if (!existingUser) {
      return res.status(404).send("Invalid or expired reset password token.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });

    await sendResetSuccessEmail(user.email);

    return res.status(200).send("Password has been successfully reset.");
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};
