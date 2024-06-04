import crypto from "crypto";

const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString("hex").slice(0, 32);
};

const generateEncryptionIV = () => {
  return crypto.randomBytes(16).toString("hex").slice(0, 16);
};

// used to generate a new encryption key and IV for dev / prod
const logEncryptionKeyAndIv = () => {
  console.log("Encryption Key:", generateEncryptionKey());
  console.log("Encryption IV:", generateEncryptionIV());
};

logEncryptionKeyAndIv();
