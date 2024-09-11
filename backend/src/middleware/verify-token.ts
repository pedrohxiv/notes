import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Unauthorized.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(401).send("Unauthorized");
    }

    (req as Request & { userId: string }).userId = (
      decoded as { userId: string }
    ).userId;

    next();
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};
