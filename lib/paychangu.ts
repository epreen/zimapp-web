// lib/paychangu.ts
import PayChangu from "paychangu";

let _instance: InstanceType<typeof PayChangu> | null = null;

/**
 * Lazily create PayChangu client so the module can load at build time
 * without PAYCHANGU_SECRET_KEY. Throws when used at runtime if key is missing.
 */
export function getPaychangu(): InstanceType<typeof PayChangu> {
  if (!_instance) {
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;
    if (!secretKey) {
      throw new Error("PAYCHANGU_SECRET_KEY is not defined");
    }
    _instance = new PayChangu({ secretKey });
  }
  return _instance;
}