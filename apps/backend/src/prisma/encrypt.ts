import crypto from "crypto";

const encryptionMethod = "aes-256-cbc";

import config from "@/config";

export const encrypt = (val: string) => {
  const cipher = crypto.createCipheriv(
    encryptionMethod,
    config.ENCRYPTION_KEY as string,
    config.ENCRYPTION_IV as string,
  );
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

export const decrypt = (encrypted: string) => {
  const decipher = crypto.createDecipheriv(
    encryptionMethod,
    config.ENCRYPTION_KEY as string,
    config.ENCRYPTION_IV as string,
  );
  const decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
