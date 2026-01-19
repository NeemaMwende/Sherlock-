import jwt from "jsonwebtoken";

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
