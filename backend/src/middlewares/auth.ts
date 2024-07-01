import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}
export const generalAuthoriser = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  if (request.method === 'OPTIONS') {
    return response.sendStatus(204); // No Content
  }

  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return response.status(401).json({
        message: `You are not authorized to view this page`,
      });
    }

    const tokenParts = authorization.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return response.status(401).json({
        status: `Failed`,
        message: `Login required`,
      });
    }

    const mainToken = tokenParts[1];
    if (!mainToken) {
      return response.status(401).json({
        status: `Failed`,
        message: `Login required`,
      });
    }

    const decoded = jwt.verify(mainToken, process.env.APP_SECRET as string);
    request.user = decoded;
    next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return response.status(401).json({
      status: 'Failed',
      message: 'Invalid token',
    });
  }
};
