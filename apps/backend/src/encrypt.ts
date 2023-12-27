import crypto from "crypto";

const encryptionMethod = "aes-256-cbc";

export const encrypt = (val: string) => {
  let cipher = crypto.createCipheriv(
    encryptionMethod,
    process.env.ENCRYPTION_KEY as string,
    process.env.ENCRYPTION_IV as string,
  );
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

export const decrypt = (encrypted: string) => {
  let decipher = crypto.createDecipheriv(
    encryptionMethod,
    process.env.ENCRYPTION_KEY as string,
    process.env.ENCRYPTION_IV as string,
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
