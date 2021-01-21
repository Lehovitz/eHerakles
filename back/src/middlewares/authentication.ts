import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
export type TokenBody = {
  role: string;
  email: string;
};
export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, tokenBody: TokenBody) => {
      //console.log(err);
      if (err) return res.status(403).send();
      req.email = tokenBody.email;
      req.role = tokenBody.role;
      //TODO:: wylaczyc bledy, bo ja ich nie popelniam
      next(); // pass the execution off to whatever request the client intended
    }
  );
}
