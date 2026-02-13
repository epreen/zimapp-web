// lib/paychangu.ts
import PayChangu from "paychangu";

if (!process.env.PAYCHANGU_SECRET_KEY) {
  throw new Error("PAYCHANGU_SECRET_KEY is not defined");
}

export const paychangu = new PayChangu({
  secretKey: process.env.PAYCHANGU_SECRET_KEY,
});